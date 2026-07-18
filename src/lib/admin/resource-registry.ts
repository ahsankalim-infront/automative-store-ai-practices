import {
  getCategories, getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
  getBrands, getBrandById, createBrand, updateBrand, deleteBrand,
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  getOrders, getOrderById, updateOrder, deleteOrder,
  getUsers, getUserById, updateUser, deleteUser, toPublicUser,
  getReviews, getReviewById, createReview, updateReview, deleteReview,
  getServices, getServiceById, createService, updateService, deleteService,
  getBookings, getBookingById, createBooking, updateBooking, deleteBooking,
  getContactMessages, getContactMessageById, deleteContactMessage,
  getCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon,
  getAllBanners, getBannerById, createBanner, updateBanner, deleteBanner,
  getAllBundleOffers, getBundleOfferById, createBundleOffer, updateBundleOffer, deleteBundleOffer,
  getAllAboutTeamMembers, getAboutTeamMemberById, createAboutTeamMember, updateAboutTeamMember, deleteAboutTeamMember,
  getAllAboutMilestones, getAboutMilestoneById, createAboutMilestone, updateAboutMilestone, deleteAboutMilestone,
  getAllHeroSlides, getHeroSlideById, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  getAllPromotionPopups, getPromotionPopupById, createPromotionPopup, updatePromotionPopup, deletePromotionPopup,
  getBlogPosts, getBlogById, createBlogPost, updateBlogPost, deleteBlogPost,
  getVehicleMakes, getVehicleMakeById, createVehicleMake, updateVehicleMake, deleteVehicleMake,
  getStores, getStoreById, createStore, updateStore, deleteStore,
  getStoreSettings, updateStoreSettings,
  type UserRecord,
} from "@/lib/data/repositories";
import { slugify } from "@/lib/utils";
import { parseSpecifications, parseVehicleCompatibility } from "@/lib/products/specs-fitment";
import { parseProductImagesFromForm } from "@/lib/products/product-images";
import { readAllVehicleMakes } from "@/lib/data/cached-reads";
import type {
  Category, Brand, Product, Order, Review, Service, ServiceBooking,
  Coupon, Banner, BlogPost, VehicleMake, Store, UserRole, BundleOffer, AboutTeamMember, AboutMilestone, HeroSlide, PromotionPopup,
} from "@/types";

export type AdminResource =
  | "categories" | "brands" | "products" | "orders" | "customers" | "reviews"
  | "services" | "bookings" | "contactMessages" | "coupons" | "banners" | "bundleOffers" | "aboutTeam" | "aboutMilestones" | "heroSlides" | "promotionPopups" | "blogs" | "vehicles"
  | "stores" | "users";

export const ADMIN_RESOURCE_KEYS: AdminResource[] = [
  "categories", "brands", "products", "orders", "customers", "reviews",
  "services", "bookings", "contactMessages", "coupons", "banners", "bundleOffers", "aboutTeam", "aboutMilestones", "heroSlides", "promotionPopups", "blogs", "vehicles", "stores", "users",
];

type CrudOps = {
  list: () => Promise<{ id: string }[]>;
  get: (id: string) => Promise<{ id: string } | null>;
  create?: (body: Record<string, unknown>) => Promise<{ id: string }>;
  update: (id: string, body: Record<string, unknown>) => Promise<{ id: string } | null>;
  delete?: (id: string) => Promise<boolean>;
};

function parseJsonField(val: unknown, fallback: unknown = []) {
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return val ?? fallback;
}

function bool(val: unknown) {
  return val === true || val === "true" || val === 1 || val === "1";
}

function parseTags(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String).filter(Boolean);
  if (typeof val === "string") {
    return val.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function stripProductFormFields(b: Record<string, unknown>): Record<string, unknown> {
  const { imageUrl, images, specCount, fitCount, seoMetaTitle, seoMetaDescription, seoOgImage, seoNoindex, ...rest } = b;
  void imageUrl;
  void images;
  void specCount;
  void fitCount;
  void seoMetaTitle;
  void seoMetaDescription;
  void seoOgImage;
  void seoNoindex;
  return rest;
}

function buildProductSeo(b: Record<string, unknown>) {
  const metaTitle = (b.seoMetaTitle as string)?.trim();
  const metaDescription = (b.seoMetaDescription as string)?.trim();
  const ogImage = (b.seoOgImage as string)?.trim();
  const noindex = bool(b.seoNoindex);
  if (!metaTitle && !metaDescription && !ogImage && !noindex) return undefined;
  return {
    ...(metaTitle ? { metaTitle } : {}),
    ...(metaDescription ? { metaDescription } : {}),
    ...(ogImage ? { ogImage } : {}),
    ...(noindex ? { noindex: true } : {}),
  };
}

async function buildProductPayload(b: Record<string, unknown>) {
  const makes = await readAllVehicleMakes();
  return {
    slug: (b.slug as string) || slugify(b.name as string),
    name: b.name as string,
    sku: b.sku as string,
    brand: b.brand as string,
    brandSlug: (b.brandSlug as string) || slugify(b.brand as string),
    category: b.category as string,
    categorySlug: (b.categorySlug as string) || slugify(b.category as string),
    price: Number(b.price) || 0,
    originalPrice: b.originalPrice ? Number(b.originalPrice) : undefined,
    stock: Math.max(0, Number(b.stock) || 0),
    // Sold out when stock is 0 or below; otherwise respect admin toggle
    inStock: Math.max(0, Number(b.stock) || 0) > 0 && bool(b.inStock ?? true),
    description: (b.description as string) || "",
    shortDescription: (b.shortDescription as string) || "",
    specifications: parseSpecifications(b.specifications),
    vehicleCompatibility: parseVehicleCompatibility(b.vehicleCompatibility, makes),
    warranty: (b.warranty as string) || undefined,
    tags: parseTags(b.tags),
    installationAvailable: bool(b.installationAvailable),
    installationPrice: b.installationPrice ? Number(b.installationPrice) : undefined,
    isFeatured: bool(b.isFeatured),
    isNew: bool(b.isNew),
    isBestSeller: bool(b.isBestSeller),
    isFlashSale: bool(b.isFlashSale),
    seo: buildProductSeo(b),
  };
}

export function getAdminResource(name: string): CrudOps | null {
  switch (name as AdminResource) {
    case "categories":
      return {
        list: getAllCategories,
        get: getCategoryById,
        create: (b) => createCategory({
          id: crypto.randomUUID(),
          slug: (b.slug as string) || slugify(b.name as string),
          name: b.name as string,
          icon: b.icon as string,
          image: b.image as string,
          description: b.description as string,
          productCount: Number(b.productCount) || 0,
          sortOrder: Number(b.sortOrder) || 0,
          isActive: bool(b.isActive ?? true),
        } as Category),
        update: (id, b) => updateCategory(id, {
          ...(b as Partial<Category>),
          ...(b.isActive !== undefined ? { isActive: bool(b.isActive) } : {}),
        }),
        delete: deleteCategory,
      };
    case "brands":
      return {
        list: getBrands,
        get: getBrandById,
        create: (b) => createBrand({
          id: crypto.randomUUID(),
          slug: (b.slug as string) || slugify(b.name as string),
          name: b.name as string,
          logo: (b.logo as string) || "",
          description: b.description as string,
          productCount: Number(b.productCount) || 0,
          isPrivateLabel: bool(b.isPrivateLabel),
          country: b.country as string,
        } as Brand),
        update: (id, b) => updateBrand(id, b as Partial<Brand>),
        delete: deleteBrand,
      };
    case "products":
      return {
        list: () => getProducts({ includeInactiveCategories: true }),
        get: async (id) => {
          const p = await getProductById(id);
          if (!p) return null;
          return {
            ...p,
            seoMetaTitle: p.seo?.metaTitle ?? "",
            seoMetaDescription: p.seo?.metaDescription ?? "",
            seoOgImage: p.seo?.ogImage ?? "",
            seoNoindex: p.seo?.noindex ?? false,
          };
        },
        create: async (b) => {
          const now = new Date().toISOString();
          const productName = String(b.name ?? "");
          const payload = await buildProductPayload(stripProductFormFields(b));
          const images = parseProductImagesFromForm(b, productName) ?? [];
          return createProduct({
            id: crypto.randomUUID(),
            ...payload,
            images,
            rating: Number(b.rating) || 0,
            reviewCount: Number(b.reviewCount) || 0,
            createdAt: now,
            updatedAt: now,
          } as Product);
        },
        update: async (id, b) => {
          const existing = await getProductById(id);
          if (!existing) return null;

          const merged: Record<string, unknown> = {
            name: existing.name,
            slug: existing.slug,
            sku: existing.sku,
            brand: existing.brand,
            brandSlug: existing.brandSlug,
            category: existing.category,
            categorySlug: existing.categorySlug,
            price: existing.price,
            originalPrice: existing.originalPrice,
            stock: existing.stock,
            inStock: existing.inStock,
            description: existing.description,
            shortDescription: existing.shortDescription,
            specifications: existing.specifications,
            vehicleCompatibility: existing.vehicleCompatibility,
            warranty: existing.warranty,
            tags: existing.tags,
            installationAvailable: existing.installationAvailable,
            installationPrice: existing.installationPrice,
            isFeatured: existing.isFeatured,
            isNew: existing.isNew,
            isBestSeller: existing.isBestSeller,
            isFlashSale: existing.isFlashSale,
            seoMetaTitle: existing.seo?.metaTitle ?? "",
            seoMetaDescription: existing.seo?.metaDescription ?? "",
            seoOgImage: existing.seo?.ogImage ?? "",
            seoNoindex: existing.seo?.noindex ?? false,
            ...stripProductFormFields(b),
          };

          const patch: Partial<Product> = await buildProductPayload(merged);
          if (b.price !== undefined) patch.price = Number(b.price);
          if (b.stock !== undefined) patch.stock = Number(b.stock);
          if (b.inStock !== undefined) patch.inStock = bool(b.inStock);
          const images = parseProductImagesFromForm(b, String(merged.name ?? ""));
          if (images !== undefined) patch.images = images;
          return updateProduct(id, patch);
        },
        delete: deleteProduct,
      };
    case "orders":
      return {
        list: getOrders,
        get: getOrderById,
        update: (id, b) => updateOrder(id, b as Partial<Order>),
        delete: deleteOrder,
      };
    case "customers":
      return {
        list: async () => (await getUsers("customer")).map(toPublicUser) as { id: string }[],
        get: async (id) => {
          const u = await getUserById(id);
          return u ? toPublicUser(u) : null;
        },
        update: async (id, b) => {
          const patch: Partial<UserRecord> = {};
          if (b.name) patch.name = b.name as string;
          if (b.phone) patch.phone = b.phone as string;
          if (b.role) patch.role = b.role as UserRole;
          const u = await updateUser(id, patch);
          return u ? toPublicUser(u) : null;
        },
      };
    case "reviews":
      return {
        list: getReviews,
        get: getReviewById,
        create: (b) => createReview({
          id: crypto.randomUUID(),
          productId: b.productId as string,
          userId: b.userId as string,
          userName: b.userName as string,
          rating: Number(b.rating) || 5,
          title: b.title as string,
          body: b.body as string,
          isVerifiedPurchase: bool(b.isVerifiedPurchase),
          helpfulCount: Number(b.helpfulCount) || 0,
          createdAt: new Date().toISOString(),
        } as Review),
        update: (id, b) => updateReview(id, b as Partial<Review>),
        delete: deleteReview,
      };
    case "services":
      return {
        list: getServices,
        get: getServiceById,
        create: (b) => createService({
          id: crypto.randomUUID(),
          slug: (b.slug as string) || slugify(b.name as string),
          type: b.type as Service["type"],
          name: b.name as string,
          description: b.description as string,
          image: b.image as string,
          priceFrom: Number(b.priceFrom) || 0,
          priceTo: b.priceTo ? Number(b.priceTo) : undefined,
          duration: b.duration as string,
          features: parseJsonField(b.features, []) as string[],
          popular: bool(b.popular),
        } as Service),
        update: (id, b) => updateService(id, {
          ...b,
          features: b.features ? parseJsonField(b.features) : undefined,
        } as Partial<Service>),
        delete: deleteService,
      };
    case "bookings":
      return {
        list: getBookings,
        get: getBookingById,
        create: (b) => createBooking({
          id: crypto.randomUUID(),
          serviceId: b.serviceId as string,
          serviceName: b.serviceName as string,
          userId: b.userId as string,
          userName: b.userName as string,
          userPhone: b.userPhone as string,
          branchId: b.branchId as string,
          branchName: b.branchName as string,
          date: b.date as string,
          timeSlot: b.timeSlot as string,
          vehicleInfo: b.vehicleInfo as string,
          notes: b.notes as string,
          status: (b.status as ServiceBooking["status"]) || "pending",
          price: b.price ? Number(b.price) : undefined,
          createdAt: new Date().toISOString(),
        } as ServiceBooking),
        update: (id, b) => updateBooking(id, b as Partial<ServiceBooking>),
        delete: deleteBooking,
      };
    case "contactMessages":
      return {
        list: getContactMessages,
        get: getContactMessageById,
        update: (id) => getContactMessageById(id),
        delete: deleteContactMessage,
      };
    case "coupons":
      return {
        list: getCoupons,
        get: getCouponById,
        create: (b) => createCoupon({
          id: crypto.randomUUID(),
          code: (b.code as string).toUpperCase(),
          description: b.description as string,
          type: b.type as Coupon["type"],
          value: Number(b.value) || 0,
          minOrderAmount: b.minOrderAmount ? Number(b.minOrderAmount) : undefined,
          maxDiscount: b.maxDiscount ? Number(b.maxDiscount) : undefined,
          usageLimit: b.usageLimit ? Number(b.usageLimit) : undefined,
          usedCount: Number(b.usedCount) || 0,
          validFrom: b.validFrom as string,
          validTo: b.validTo as string,
          isActive: bool(b.isActive ?? true),
        } as Coupon),
        update: (id, b) => updateCoupon(id, b as Partial<Coupon>),
        delete: deleteCoupon,
      };
    case "banners":
      return {
        list: getAllBanners,
        get: getBannerById,
        create: (b) => createBanner({
          id: crypto.randomUUID(),
          title: b.title as string,
          subtitle: b.subtitle as string,
          ctaText: b.ctaText as string,
          ctaLink: b.ctaLink as string,
          image: b.image as string,
          position: b.position as Banner["position"],
          isActive: bool(b.isActive ?? true),
          sortOrder: Number(b.sortOrder) || 0,
        } as Banner),
        update: (id, b) => updateBanner(id, b as Partial<Banner>),
        delete: deleteBanner,
      };
    case "bundleOffers":
      return {
        list: getAllBundleOffers,
        get: getBundleOfferById,
        create: (b) => createBundleOffer({
          id: crypto.randomUUID(),
          title: b.title as string,
          description: b.description as string,
          price: Number(b.price) || 0,
          originalPrice: Number(b.originalPrice) || 0,
          image: b.image as string,
          href: (b.href as string) || "/products",
          tag: b.tag as string,
          productIds: parseJsonField(b.productIds, []) as string[],
          sortOrder: Number(b.sortOrder) || 0,
          isActive: bool(b.isActive ?? true),
        } as BundleOffer),
        update: (id, b) => updateBundleOffer(id, {
          ...b,
          price: b.price !== undefined ? Number(b.price) : undefined,
          originalPrice: b.originalPrice !== undefined ? Number(b.originalPrice) : undefined,
          sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) : undefined,
          productIds: b.productIds ? parseJsonField(b.productIds) : undefined,
        } as Partial<BundleOffer>),
        delete: deleteBundleOffer,
      };
    case "aboutTeam":
      return {
        list: getAllAboutTeamMembers,
        get: getAboutTeamMemberById,
        create: (b) => createAboutTeamMember({
          id: crypto.randomUUID(),
          name: b.name as string,
          role: b.role as string,
          bio: b.bio as string,
          image: b.image as string,
          sortOrder: Number(b.sortOrder) || 0,
          isActive: bool(b.isActive ?? true),
        } as AboutTeamMember),
        update: (id, b) => updateAboutTeamMember(id, {
          ...b,
          sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) : undefined,
        } as Partial<AboutTeamMember>),
        delete: deleteAboutTeamMember,
      };
    case "aboutMilestones":
      return {
        list: getAllAboutMilestones,
        get: getAboutMilestoneById,
        create: (b) => createAboutMilestone({
          id: crypto.randomUUID(),
          year: b.year as string,
          title: b.title as string,
          description: b.description as string,
          sortOrder: Number(b.sortOrder) || 0,
          isActive: bool(b.isActive ?? true),
        } as AboutMilestone),
        update: (id, b) => updateAboutMilestone(id, {
          ...b,
          sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) : undefined,
        } as Partial<AboutMilestone>),
        delete: deleteAboutMilestone,
      };
    case "heroSlides":
      return {
        list: getAllHeroSlides,
        get: getHeroSlideById,
        create: (b) => createHeroSlide({
          id: crypto.randomUUID(),
          tag: b.tag as string,
          title: b.title as string,
          mobileTitle: b.mobileTitle as string,
          highlight: b.highlight as string,
          mobileCta: b.mobileCta as string,
          description: b.description as string,
          ctaLabel: b.ctaLabel as string,
          ctaHref: (b.ctaHref as string) || "/products",
          secondaryLabel: b.secondaryLabel as string,
          secondaryHref: (b.secondaryHref as string) || "/about",
          productImage: b.productImage as string,
          productLabel: b.productLabel as string,
          productPrice: b.productPrice as string,
          badgeIcon: (b.badgeIcon as string) || "Star",
          badgeText: b.badgeText as string,
          stat1Value: b.stat1Value as string,
          stat1Label: b.stat1Label as string,
          stat2Value: b.stat2Value as string,
          stat2Label: b.stat2Label as string,
          stat3Value: b.stat3Value as string,
          stat3Label: b.stat3Label as string,
          leftBg: (b.leftBg as string) || "from-[#0d0d0d] via-[#1a0a00] to-[#0d0d0d]",
          rightBg: (b.rightBg as string) || "from-[#f5f0eb] to-[#ede8e0]",
          accent: (b.accent as string) || "#D50000",
          accentLight: (b.accentLight as string) || "#ff5252",
          sortOrder: Number(b.sortOrder) || 0,
          isActive: bool(b.isActive ?? true),
        } as HeroSlide),
        update: (id, b) => updateHeroSlide(id, {
          ...b,
          sortOrder: b.sortOrder !== undefined ? Number(b.sortOrder) : undefined,
        } as Partial<HeroSlide>),
        delete: deleteHeroSlide,
      };
    case "promotionPopups":
      return {
        list: getAllPromotionPopups,
        get: getPromotionPopupById,
        create: (b) => createPromotionPopup({
          id: crypto.randomUUID(),
          title: b.title as string,
          subtitle: b.subtitle as string,
          description: b.description as string,
          badgeText: b.badgeText as string,
          couponCode: b.couponCode as string,
          image: b.image as string,
          mobileImage: b.mobileImage as string,
          ctaLabel: (b.ctaLabel as string) || "Shop Now",
          ctaHref: (b.ctaHref as string) || "/products",
          secondaryLabel: b.secondaryLabel as string,
          secondaryHref: b.secondaryHref as string,
          accentColor: (b.accentColor as string) || "#D50000",
          isActive: bool(b.isActive ?? true),
          sortOrder: Number(b.sortOrder) || 0,
          showDelayMs: Number(b.showDelayMs) || 1200,
          dismissDays: Number(b.dismissDays) || 3,
          validFrom: b.validFrom as string | undefined,
          validTo: b.validTo as string | undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as PromotionPopup),
        update: (id, b) => updatePromotionPopup(id, {
          ...(b as Partial<PromotionPopup>),
          ...(b.isActive !== undefined ? { isActive: bool(b.isActive) } : {}),
          ...(b.showDelayMs !== undefined ? { showDelayMs: Number(b.showDelayMs) } : {}),
          ...(b.dismissDays !== undefined ? { dismissDays: Number(b.dismissDays) } : {}),
          ...(b.sortOrder !== undefined ? { sortOrder: Number(b.sortOrder) } : {}),
        }),
        delete: deletePromotionPopup,
      };
    case "blogs":
      return {
        list: getBlogPosts,
        get: getBlogById,
        create: (b) => createBlogPost({
          id: crypto.randomUUID(),
          slug: (b.slug as string) || slugify(b.title as string),
          title: b.title as string,
          excerpt: b.excerpt as string,
          content: b.content as string,
          coverImage: b.coverImage as string,
          author: b.author as string,
          category: b.category as string,
          tags: parseJsonField(b.tags, []) as string[],
          readTime: Number(b.readTime) || 5,
          viewCount: Number(b.viewCount) || 0,
          publishedAt: b.publishedAt as string || new Date().toISOString(),
          isFeatured: bool(b.isFeatured),
        } as BlogPost),
        update: (id, b) => updateBlogPost(id, {
          ...b,
          tags: b.tags ? parseJsonField(b.tags) : undefined,
        } as Partial<BlogPost>),
        delete: deleteBlogPost,
      };
    case "vehicles":
      return {
        list: getVehicleMakes,
        get: getVehicleMakeById,
        create: (b) => createVehicleMake({
          id: crypto.randomUUID(),
          slug: (b.slug as string) || slugify(b.name as string),
          name: b.name as string,
          country: b.country as string,
          models: parseJsonField(b.models, []) as VehicleMake["models"],
        } as VehicleMake),
        update: (id, b) => updateVehicleMake(id, {
          ...b,
          models: b.models ? parseJsonField(b.models) : undefined,
        } as Partial<VehicleMake>),
        delete: deleteVehicleMake,
      };
    case "stores":
      return {
        list: getStores,
        get: getStoreById,
        create: (b) => createStore({
          id: crypto.randomUUID(),
          name: b.name as string,
          city: b.city as string,
          address: b.address as string,
          phone: b.phone as string,
          email: b.email as string,
          hours: b.hours as string,
          services: parseJsonField(b.services, []) as string[],
          isMainBranch: bool(b.isMainBranch),
        } as Store),
        update: (id, b) => updateStore(id, {
          ...b,
          services: b.services ? parseJsonField(b.services) : undefined,
        } as Partial<Store>),
        delete: deleteStore,
      };
    case "users":
      return {
        list: async () => {
          const all = await getUsers();
          return all.filter((u) => ["admin", "manager", "staff"].includes(u.role)).map(toPublicUser) as { id: string }[];
        },
        get: async (id) => {
          const u = await getUserById(id);
          return u && ["admin", "manager", "staff"].includes(u.role) ? toPublicUser(u) : null;
        },
        update: async (id, b) => {
          const patch: Partial<UserRecord> = {};
          if (b.name) patch.name = b.name as string;
          if (b.role) patch.role = b.role as UserRole;
          if (b.phone) patch.phone = b.phone as string;
          const u = await updateUser(id, patch);
          return u ? toPublicUser(u) : null;
        },
      };
    default:
      return null;
  }
}

export { getStoreSettings, updateStoreSettings };
