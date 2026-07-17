import { HERO_BADGE_ICON_OPTIONS } from "@/lib/hero-slides/icons";

export type FieldType =
  | "text" | "number" | "email" | "textarea" | "select" | "checkbox" | "date" | "json" | "icon"
  | "specList" | "vehicleFitList";

export interface AdminFieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Load select options from API */
  optionsSource?: "brands" | "categories" | "products" | "users";
  /** When optionsSource is set, auto-fill this slug field on selection */
  slugKey?: string;
  /** When optionsSource is set, auto-fill a related field (e.g. userId → userName) */
  linkedKey?: string;
  /** Display-only field (e.g. auto-filled slug) */
  readOnly?: boolean;
  /** Default for checkbox fields on create */
  defaultChecked?: boolean;
  /** Searchable dropdown for large option lists */
  searchable?: boolean;
  colSpan?: 1 | 2;
  hideInTable?: boolean;
}

export interface AdminColumnDef {
  key: string;
  label: string;
  render?: "price" | "date" | "badge" | "orderStatus" | "bool" | "icon";
}

export interface AdminEntityConfig {
  resource: string;
  title: string;
  description?: string;
  addLabel?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  searchKeys?: string[];
  columns: AdminColumnDef[];
  fields: AdminFieldDef[];
}

const orderStatuses = [
  "pending", "confirmed", "processing", "shipped", "out_for_delivery",
  "delivered", "cancelled", "returned", "refunded",
].map((s) => ({ value: s, label: s.replace(/_/g, " ") }));

const bookingStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
  .map((s) => ({ value: s, label: s }));

const serviceTypes = ["ppf", "detailing", "installation", "ceramic", "tint", "inspection"]
  .map((s) => ({ value: s, label: s.toUpperCase() }));

const couponTypes = [
  { value: "fixed", label: "Fixed Amount" },
  { value: "percentage", label: "Percentage" },
  { value: "free_shipping", label: "Free Shipping" },
];

const bannerPositions = [
  { value: "hero", label: "Hero" },
  { value: "middle", label: "Middle" },
  { value: "bottom", label: "Bottom" },
  { value: "sidebar", label: "Sidebar" },
];

const userRoles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "customer", label: "Customer" },
];

export const ADMIN_ENTITY_CONFIGS: Record<string, AdminEntityConfig> = {
  categories: {
    resource: "categories",
    title: "Categories",
    description: "Manage product categories",
    addLabel: "Add Category",
    columns: [
      { key: "icon", label: "Icon", render: "icon" },
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "productCount", label: "Products" },
      { key: "isActive", label: "Active", render: "bool" },
      { key: "sortOrder", label: "Order" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", placeholder: "auto-generated from name" },
      { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      {
        key: "icon",
        label: "Category Nav Icon",
        type: "icon",
        colSpan: 2,
        placeholder: "Lucide icon name shown in the category navigation bar",
      },
      { key: "image", label: "Image URL", type: "text" },
      { key: "productCount", label: "Product Count", type: "number" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active (visible on storefront)", type: "checkbox", defaultChecked: true },
    ],
  },
  brands: {
    resource: "brands",
    title: "Brands",
    description: "Manage product brands",
    addLabel: "Add Brand",
    columns: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "country", label: "Country" },
      { key: "productCount", label: "Products" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "logo", label: "Logo URL", type: "text", colSpan: 2 },
      { key: "country", label: "Country", type: "text" },
      { key: "productCount", label: "Product Count", type: "number" },
      { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      { key: "isPrivateLabel", label: "Private Label", type: "checkbox" },
    ],
  },
  products: {
    resource: "products",
    title: "Products",
    description: "Manage store products",
    addLabel: "Add Product",
    searchKeys: ["name", "sku", "brand", "category"],
    columns: [
      { key: "name", label: "Product" },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      { key: "price", label: "Price", render: "price" },
      { key: "stock", label: "Stock" },
      { key: "inStock", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "name", label: "Product Name", type: "text", required: true, colSpan: 2 },
      { key: "sku", label: "SKU", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "brand", label: "Brand", type: "select", optionsSource: "brands", slugKey: "brandSlug", required: true },
      { key: "brandSlug", label: "Brand Slug", type: "text", readOnly: true },
      { key: "category", label: "Category", type: "select", optionsSource: "categories", slugKey: "categorySlug", required: true },
      { key: "categorySlug", label: "Category Slug", type: "text", readOnly: true },
      { key: "price", label: "Price (Rs.)", type: "number", required: true },
      { key: "originalPrice", label: "Original Price", type: "number" },
      { key: "stock", label: "Stock", type: "number", required: true },
      { key: "imageUrl", label: "Primary Image URL", type: "text", colSpan: 2 },
      { key: "shortDescription", label: "Short Description", type: "textarea", colSpan: 2 },
      { key: "description", label: "Full Description", type: "textarea", colSpan: 2 },
      { key: "warranty", label: "Warranty", type: "text", colSpan: 2, placeholder: "e.g. 1 Year Manufacturer Warranty" },
      { key: "specifications", label: "Specifications", type: "specList", colSpan: 2 },
      { key: "vehicleCompatibility", label: "Vehicle Fitment", type: "vehicleFitList", colSpan: 2 },
      { key: "tags", label: "Tags", type: "text", colSpan: 2, placeholder: "led, headlight, h4 (comma-separated)" },
      { key: "inStock", label: "In Stock", type: "checkbox" },
      { key: "isFeatured", label: "Featured", type: "checkbox" },
      { key: "isNew", label: "New Arrival", type: "checkbox" },
      { key: "isBestSeller", label: "Best Seller", type: "checkbox" },
      { key: "isFlashSale", label: "Flash Sale", type: "checkbox" },
      { key: "installationAvailable", label: "Installation Available", type: "checkbox" },
      { key: "installationPrice", label: "Installation Price", type: "number" },
      { key: "seoMetaTitle", label: "SEO Meta Title", type: "text", colSpan: 2, placeholder: "Override page title for search engines" },
      { key: "seoMetaDescription", label: "SEO Meta Description", type: "textarea", colSpan: 2, placeholder: "155–160 characters recommended" },
      { key: "seoOgImage", label: "SEO OG Image URL", type: "text", colSpan: 2 },
      { key: "seoNoindex", label: "Hide from Search (noindex)", type: "checkbox" },
    ],
  },
  orders: {
    resource: "orders",
    title: "Orders",
    description: "View and manage customer orders",
    canCreate: false,
    canDelete: true,
    searchKeys: ["orderNumber", "status"],
    columns: [
      { key: "orderNumber", label: "Order #" },
      { key: "status", label: "Status", render: "orderStatus" },
      { key: "total", label: "Total", render: "price" },
      { key: "paymentMethod", label: "Payment" },
      { key: "createdAt", label: "Date", render: "date" },
    ],
    fields: [
      { key: "orderNumber", label: "Order Number", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: orderStatuses, required: true },
      { key: "paymentStatus", label: "Payment Status", type: "select", options: [
        { value: "pending", label: "Pending" }, { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" }, { value: "refunded", label: "Refunded" },
      ]},
      { key: "paymentMethod", label: "Payment Method", type: "select", options: [
        { value: "cod", label: "COD" }, { value: "card", label: "Card" },
        { value: "bank_transfer", label: "Bank Transfer" }, { value: "wallet", label: "Wallet" },
      ]},
      { key: "trackingNumber", label: "Tracking Number", type: "text" },
      { key: "notes", label: "Notes", type: "textarea", colSpan: 2 },
    ],
  },
  customers: {
    resource: "customers",
    title: "Customers",
    description: "Manage registered customers",
    canCreate: false,
    canDelete: false,
    searchKeys: ["name", "email", "phone"],
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "role", label: "Role", render: "badge" },
      { key: "createdAt", label: "Joined", render: "date" },
    ],
    fields: [
      { key: "name", label: "Full Name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "role", label: "Role", type: "select", options: userRoles },
    ],
  },
  reviews: {
    resource: "reviews",
    title: "Reviews",
    description: "Moderate product reviews",
    addLabel: "Add Review",
    columns: [
      { key: "userName", label: "Customer" },
      { key: "productId", label: "Product" },
      { key: "rating", label: "Rating" },
      { key: "title", label: "Title" },
      { key: "createdAt", label: "Date", render: "date" },
    ],
    fields: [
      { key: "productId", label: "Product", type: "select", optionsSource: "products", searchable: true, required: true },
      { key: "userId", label: "Customer", type: "select", optionsSource: "users", linkedKey: "userName", searchable: true, required: true },
      { key: "userName", label: "Display Name", type: "text", readOnly: true, required: true },
      { key: "rating", label: "Rating (1-5)", type: "number", required: true },
      { key: "title", label: "Title", type: "text", required: true },
      { key: "body", label: "Review Body", type: "textarea", colSpan: 2, required: true },
      { key: "isVerifiedPurchase", label: "Verified Purchase", type: "checkbox" },
      { key: "helpfulCount", label: "Helpful Count", type: "number" },
    ],
  },
  services: {
    resource: "services",
    title: "Services",
    description: "Manage installation & detailing services",
    addLabel: "Add Service",
    columns: [
      { key: "name", label: "Service" },
      { key: "type", label: "Type", render: "badge" },
      { key: "priceFrom", label: "From", render: "price" },
      { key: "duration", label: "Duration" },
    ],
    fields: [
      { key: "name", label: "Service Name", type: "text", required: true, colSpan: 2 },
      { key: "slug", label: "Slug", type: "text" },
      { key: "type", label: "Type", type: "select", options: serviceTypes, required: true },
      { key: "priceFrom", label: "Price From", type: "number", required: true },
      { key: "priceTo", label: "Price To", type: "number" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "image", label: "Image URL", type: "text", colSpan: 2 },
      { key: "description", label: "Description", type: "textarea", colSpan: 2, required: true },
      { key: "features", label: "Features (JSON array)", type: "json", colSpan: 2, placeholder: '["Feature 1","Feature 2"]' },
      { key: "popular", label: "Popular", type: "checkbox" },
    ],
  },
  bookings: {
    resource: "bookings",
    title: "Service Bookings",
    description: "Manage service appointments",
    addLabel: "Add Booking",
    columns: [
      { key: "serviceName", label: "Service" },
      { key: "userName", label: "Customer" },
      { key: "branchName", label: "Branch" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status", render: "badge" },
    ],
    fields: [
      { key: "serviceId", label: "Service ID", type: "text", required: true },
      { key: "serviceName", label: "Service Name", type: "text", required: true },
      { key: "userId", label: "User ID", type: "text", required: true },
      { key: "userName", label: "Customer Name", type: "text", required: true },
      { key: "userPhone", label: "Phone", type: "text", required: true },
      { key: "branchId", label: "Branch ID", type: "text", required: true },
      { key: "branchName", label: "Branch Name", type: "text", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "timeSlot", label: "Time Slot", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: bookingStatuses },
      { key: "vehicleInfo", label: "Vehicle", type: "text" },
      { key: "price", label: "Price", type: "number" },
      { key: "notes", label: "Notes", type: "textarea", colSpan: 2 },
    ],
  },
  contactMessages: {
    resource: "contactMessages",
    title: "Contact Messages",
    description: "Messages sent from the website contact form",
    canCreate: false,
    canEdit: false,
    searchKeys: ["name", "email", "phone", "subject", "message"],
    columns: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "subject", label: "Subject" },
      { key: "createdAt", label: "Received", render: "date" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", readOnly: true },
      { key: "phone", label: "Phone", type: "text", readOnly: true },
      { key: "email", label: "Email", type: "email", readOnly: true },
      { key: "subject", label: "Subject", type: "text", readOnly: true },
      { key: "createdAt", label: "Received At", type: "text", readOnly: true },
      { key: "message", label: "Message", type: "textarea", colSpan: 2, readOnly: true },
    ],
  },
  coupons: {
    resource: "coupons",
    title: "Coupons",
    description: "Manage discount codes",
    addLabel: "Add Coupon",
    columns: [
      { key: "code", label: "Code" },
      { key: "type", label: "Type", render: "badge" },
      { key: "value", label: "Value" },
      { key: "usedCount", label: "Used" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "code", label: "Coupon Code", type: "text", required: true },
      { key: "description", label: "Description", type: "text", required: true, colSpan: 2 },
      { key: "type", label: "Type", type: "select", options: couponTypes, required: true },
      { key: "value", label: "Value", type: "number", required: true },
      { key: "minOrderAmount", label: "Min Order", type: "number" },
      { key: "maxDiscount", label: "Max Discount", type: "number" },
      { key: "usageLimit", label: "Usage Limit", type: "number" },
      { key: "usedCount", label: "Used Count", type: "number" },
      { key: "validFrom", label: "Valid From", type: "date", required: true },
      { key: "validTo", label: "Valid To", type: "date", required: true },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  banners: {
    resource: "banners",
    title: "Banners",
    description: "Manage homepage and promo banners",
    addLabel: "Add Banner",
    columns: [
      { key: "title", label: "Title" },
      { key: "position", label: "Position", render: "badge" },
      { key: "sortOrder", label: "Order" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
      { key: "image", label: "Image URL", type: "text", required: true, colSpan: 2 },
      { key: "ctaText", label: "Button Text", type: "text" },
      { key: "ctaLink", label: "Button Link", type: "text" },
      { key: "position", label: "Position", type: "select", options: bannerPositions, required: true },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  heroSlides: {
    resource: "heroSlides",
    title: "Hero Carousel Slides",
    description: "Homepage hero banner slides (split layout with product image)",
    addLabel: "Add Slide",
    columns: [
      { key: "mobileTitle", label: "Title" },
      { key: "tag", label: "Tag" },
      { key: "productPrice", label: "Price" },
      { key: "sortOrder", label: "Order" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "tag", label: "Tag Badge", type: "text", colSpan: 2, placeholder: "🏆 {shortName} or ★ Best Seller" },
      { key: "title", label: "Title (desktop, use \\n for line break)", type: "textarea", colSpan: 2, required: true },
      { key: "mobileTitle", label: "Mobile Title", type: "text", required: true, colSpan: 2 },
      { key: "highlight", label: "Highlight Line", type: "text", required: true, colSpan: 2 },
      { key: "description", label: "Description", type: "textarea", colSpan: 2, required: true },
      { key: "mobileCta", label: "Mobile CTA Label", type: "text", required: true },
      { key: "ctaLabel", label: "Primary Button Label", type: "text", required: true },
      { key: "ctaHref", label: "Primary Button Link", type: "text", required: true, colSpan: 2 },
      { key: "secondaryLabel", label: "Secondary Button Label", type: "text", required: true },
      { key: "secondaryHref", label: "Secondary Button Link", type: "text", required: true, colSpan: 2 },
      { key: "productImage", label: "Product Image URL", type: "text", required: true, colSpan: 2 },
      { key: "productLabel", label: "Product Label", type: "text", required: true },
      { key: "productPrice", label: "Product Price Text", type: "text", required: true, placeholder: "From Rs. 9,500" },
      { key: "badgeIcon", label: "Badge Icon", type: "select", options: [...HERO_BADGE_ICON_OPTIONS], required: true },
      { key: "badgeText", label: "Badge Text", type: "text", required: true },
      { key: "stat1Value", label: "Stat 1 Value", type: "text", required: true },
      { key: "stat1Label", label: "Stat 1 Label", type: "text", required: true },
      { key: "stat2Value", label: "Stat 2 Value", type: "text", required: true },
      { key: "stat2Label", label: "Stat 2 Label", type: "text", required: true },
      { key: "stat3Value", label: "Stat 3 Value", type: "text", required: true },
      { key: "stat3Label", label: "Stat 3 Label", type: "text", required: true },
      { key: "leftBg", label: "Left Gradient Classes", type: "text", colSpan: 2, placeholder: "from-[#120d18] via-[#0a0610] to-[#120d18]" },
      { key: "rightBg", label: "Right Gradient Classes", type: "text", colSpan: 2, placeholder: "from-[#f3e8ff] to-[#e9d5ff]" },
      { key: "accent", label: "Accent Color (hex)", type: "text", placeholder: "#7C3AED" },
      { key: "accentLight", label: "Accent Light (hex)", type: "text", placeholder: "#C4B5FD" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  promotionPopups: {
    resource: "promotionPopups",
    title: "Promotion Popups",
    description: "Landing page popup shown when visitors first load the homepage",
    addLabel: "Add Promotion Popup",
    searchKeys: ["title", "subtitle", "couponCode"],
    columns: [
      { key: "title", label: "Title" },
      { key: "couponCode", label: "Coupon" },
      { key: "showDelayMs", label: "Delay (ms)" },
      { key: "dismissDays", label: "Dismiss Days" },
      { key: "sortOrder", label: "Priority" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
      { key: "description", label: "Description", type: "textarea", colSpan: 2 },
      { key: "badgeText", label: "Badge Text", type: "text", placeholder: "Limited Offer" },
      { key: "couponCode", label: "Coupon Code (optional)", type: "text", placeholder: "SPH10" },
      { key: "image", label: "Image URL", type: "text", required: true, colSpan: 2 },
      { key: "mobileImage", label: "Mobile Image URL (optional)", type: "text", colSpan: 2 },
      { key: "ctaLabel", label: "Primary Button Label", type: "text", required: true },
      { key: "ctaHref", label: "Primary Button Link", type: "text", required: true, colSpan: 2 },
      { key: "secondaryLabel", label: "Dismiss Button Label", type: "text", placeholder: "Maybe later" },
      { key: "secondaryHref", label: "Secondary Link (optional)", type: "text", colSpan: 2 },
      { key: "accentColor", label: "Accent Color (hex)", type: "text", placeholder: "#D50000" },
      { key: "showDelayMs", label: "Show Delay (ms)", type: "number", placeholder: "1200" },
      { key: "dismissDays", label: "Hide After Dismiss (days)", type: "number", placeholder: "3" },
      { key: "validFrom", label: "Valid From", type: "date" },
      { key: "validTo", label: "Valid To", type: "date" },
      { key: "sortOrder", label: "Priority (lower = first)", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox", defaultChecked: true },
    ],
  },
  bundleOffers: {
    resource: "bundleOffers",
    title: "Bundle Offers",
    description: "Manage homepage bundle cards",
    addLabel: "Add Bundle",
    columns: [
      { key: "title", label: "Title" },
      { key: "price", label: "Price", render: "price" },
      { key: "originalPrice", label: "Was", render: "price" },
      { key: "tag", label: "Tag" },
      { key: "sortOrder", label: "Order" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "description", label: "Description", type: "textarea", colSpan: 2, required: true },
      { key: "price", label: "Bundle Price (Rs.)", type: "number", required: true },
      { key: "originalPrice", label: "Original Price (Rs.)", type: "number", required: true },
      { key: "image", label: "Image URL", type: "text", required: true, colSpan: 2 },
      { key: "href", label: "Link URL", type: "text", colSpan: 2, placeholder: "/products?category=interior" },
      { key: "tag", label: "Badge Tag", type: "text", placeholder: "Leave empty to auto-calculate Save %" },
      { key: "productIds", label: "Linked Product IDs (JSON array)", type: "json", colSpan: 2, placeholder: '["prod-id-1","prod-id-2"]', hideInTable: true },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  aboutTeam: {
    resource: "aboutTeam",
    title: "Leadership Team",
    description: "Team members shown on the About page",
    addLabel: "Add Team Member",
    columns: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "sortOrder", label: "Order" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, colSpan: 2 },
      { key: "role", label: "Role / Title", type: "text", required: true, colSpan: 2 },
      { key: "bio", label: "Short Bio", type: "text", colSpan: 2, required: true },
      { key: "image", label: "Photo URL", type: "text", required: true, colSpan: 2, placeholder: "https://... or upload via Media Library" },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  aboutMilestones: {
    resource: "aboutMilestones",
    title: "Journey Milestones",
    description: "Timeline entries for the Our Journey section",
    addLabel: "Add Milestone",
    columns: [
      { key: "year", label: "Year" },
      { key: "title", label: "Title" },
      { key: "sortOrder", label: "Order" },
      { key: "isActive", label: "Active", render: "bool" },
    ],
    fields: [
      { key: "year", label: "Year", type: "text", required: true, placeholder: "2026" },
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "description", label: "Description", type: "textarea", colSpan: 2, required: true },
      { key: "sortOrder", label: "Sort Order", type: "number" },
      { key: "isActive", label: "Active", type: "checkbox" },
    ],
  },
  blogs: {
    resource: "blogs",
    title: "Blog Posts",
    description: "Manage blog articles",
    addLabel: "Add Post",
    columns: [
      { key: "title", label: "Title" },
      { key: "category", label: "Category" },
      { key: "author", label: "Author" },
      { key: "publishedAt", label: "Published", render: "date" },
      { key: "isFeatured", label: "Featured", render: "bool" },
    ],
    fields: [
      { key: "title", label: "Title", type: "text", required: true, colSpan: 2 },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "author", label: "Author", type: "text", required: true },
      { key: "coverImage", label: "Cover Image URL", type: "text", colSpan: 2, required: true },
      { key: "excerpt", label: "Excerpt", type: "textarea", colSpan: 2, required: true },
      { key: "content", label: "Content", type: "textarea", colSpan: 2 },
      { key: "tags", label: "Tags (JSON array)", type: "json", colSpan: 2, placeholder: '["tips","guides"]' },
      { key: "readTime", label: "Read Time (min)", type: "number" },
      { key: "viewCount", label: "View Count", type: "number" },
      { key: "publishedAt", label: "Published Date", type: "date" },
      { key: "isFeatured", label: "Featured", type: "checkbox" },
    ],
  },
  vehicles: {
    resource: "vehicles",
    title: "Vehicle Database",
    description: "Manage vehicle makes and models",
    addLabel: "Add Make",
    columns: [
      { key: "name", label: "Make" },
      { key: "slug", label: "Slug" },
      { key: "country", label: "Country" },
    ],
    fields: [
      { key: "name", label: "Make Name", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text" },
      { key: "country", label: "Country", type: "text" },
      { key: "models", label: "Models (JSON array)", type: "json", colSpan: 2,
        placeholder: '[{"id":"m1","slug":"corolla","name":"Corolla","makeId":"","makeName":"","years":[2020,2021]}]' },
    ],
  },
  stores: {
    resource: "stores",
    title: "Store Branches",
    description: "Manage physical store locations",
    addLabel: "Add Branch",
    columns: [
      { key: "name", label: "Branch" },
      { key: "city", label: "City" },
      { key: "phone", label: "Phone" },
      { key: "isMainBranch", label: "Main", render: "bool" },
    ],
    fields: [
      { key: "name", label: "Branch Name", type: "text", required: true, colSpan: 2 },
      { key: "city", label: "City", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text", required: true },
      { key: "address", label: "Address", type: "textarea", colSpan: 2, required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "hours", label: "Opening Hours", type: "text", placeholder: "Mon-Sun: 10AM-10PM" },
      { key: "services", label: "Services (JSON array)", type: "json", colSpan: 2, placeholder: '["PPF","Detailing"]' },
      { key: "isMainBranch", label: "Main Branch", type: "checkbox" },
    ],
  },
  users: {
    resource: "users",
    title: "Admin Users & Roles",
    description: "Manage admin, manager, and staff accounts",
    canCreate: false,
    canDelete: false,
    searchKeys: ["name", "email"],
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role", render: "badge" },
      { key: "phone", label: "Phone" },
    ],
    fields: [
      { key: "name", label: "Full Name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "phone", label: "Phone", type: "text" },
      { key: "role", label: "Role", type: "select", options: userRoles.filter((r) => r.value !== "customer"), required: true },
    ],
  },
};

export function getEntityConfig(key: string): AdminEntityConfig | null {
  return ADMIN_ENTITY_CONFIGS[key] ?? null;
}
