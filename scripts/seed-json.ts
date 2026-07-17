/**
 * Seeds data/json/ from existing mock-data modules.
 * Run: npx tsx scripts/seed-json.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";
import { products } from "../src/lib/mock-data/products";
import { categories } from "../src/lib/mock-data/categories";
import { brands } from "../src/lib/mock-data/brands";
import { vehicleMakes } from "../src/lib/mock-data/vehicles";
import { blogPosts } from "../src/lib/mock-data/blogs";
import { services, stores, mockBookings } from "../src/lib/mock-data/services";
import { mockOrders, mockReviews, salesData, topProducts } from "../src/lib/mock-data/orders";
import { DEFAULT_HOME_LAYOUT } from "../src/lib/home-layout/defaults";
import { DEFAULT_BUNDLE_OFFERS, DEFAULT_BUNDLE_OFFERS_SECTION } from "../src/lib/bundles/defaults";
import {
  DEFAULT_ABOUT_JOURNEY_SECTION,
  DEFAULT_ABOUT_LEADERSHIP_SECTION,
  DEFAULT_ABOUT_TEAM,
  DEFAULT_ABOUT_MILESTONES,
} from "../src/lib/about-content/defaults";
import { DEFAULT_HERO_SLIDES } from "../src/lib/hero-slides/defaults";

const DATA_DIR = join(process.cwd(), "data", "json");

function write(name: string, data: unknown) {
  writeFileSync(join(DATA_DIR, `${name}.json`), JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✓ ${name}.json`);
}

async function main() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const adminHash = await bcrypt.hash("Admin@123", 10);
  const customerHash = await bcrypt.hash("Customer@123", 10);

  const users = [
    {
      id: "u-admin",
      name: "Admin User",
      email: "admin@autozone.pk",
      phone: "0300-0000001",
      role: "admin",
      passwordHash: adminHash,
      addresses: [],
      createdAt: "2024-01-01T00:00:00Z",
      isVerified: true,
    },
    {
      id: "u-001",
      name: "Ahmed Khan",
      email: "ahmed@email.com",
      phone: "0300-1234567",
      role: "customer",
      passwordHash: customerHash,
      addresses: [
        {
          fullName: "Ahmed Khan",
          phone: "0300-1234567",
          address: "House 23, Street 5, Gulberg III",
          city: "Lahore",
          state: "Punjab",
          country: "Pakistan",
        },
      ],
      createdAt: "2025-06-01T00:00:00Z",
      isVerified: true,
      loyaltyPoints: 450,
    },
    {
      id: "u-002",
      name: "Sara Malik",
      email: "sara@email.com",
      phone: "0321-9876543",
      role: "customer",
      passwordHash: customerHash,
      addresses: [],
      createdAt: "2025-08-15T00:00:00Z",
      isVerified: true,
    },
  ];

  const coupons = [
    {
      id: "cpn-1",
      code: "WELCOME500",
      description: "Welcome discount for new customers",
      type: "fixed",
      value: 500,
      minOrderAmount: 2000,
      usedCount: 45,
      validFrom: "2025-01-01T00:00:00Z",
      validTo: "2027-12-31T23:59:59Z",
      isActive: true,
    },
    {
      id: "cpn-2",
      code: "SAVE10",
      description: "10% off on orders above Rs. 5000",
      type: "percentage",
      value: 10,
      minOrderAmount: 5000,
      maxDiscount: 2000,
      usedCount: 120,
      validFrom: "2025-01-01T00:00:00Z",
      validTo: "2027-12-31T23:59:59Z",
      isActive: true,
    },
    {
      id: "cpn-3",
      code: "FIRST20",
      description: "20% off first order",
      type: "percentage",
      value: 20,
      minOrderAmount: 3000,
      maxDiscount: 3000,
      usageLimit: 1,
      usedCount: 0,
      validFrom: "2025-01-01T00:00:00Z",
      validTo: "2027-12-31T23:59:59Z",
      isActive: true,
    },
  ];

  const banners = [
    {
      id: "bn-1",
      title: "Premium Seat Covers",
      subtitle: "Custom fit for all major models",
      ctaText: "Shop Now",
      ctaLink: "/products?category=seat-covers",
      image: "/images/seat-cover-hero.png",
      position: "hero",
      isActive: true,
      sortOrder: 1,
    },
    {
      id: "bn-2",
      title: "LED Headlights",
      subtitle: "Up to 40% brighter than stock",
      ctaText: "Explore",
      ctaLink: "/products?category=lighting",
      image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
      position: "hero",
      isActive: true,
      sortOrder: 2,
    },
  ];

  console.log("Seeding data/json/ ...");
  write("products", products);
  write("categories", categories);
  write("brands", brands);
  write("vehicle-makes", vehicleMakes);
  write("blogs", blogPosts);
  write("services", services);
  write("stores", stores);
  write("orders", mockOrders);
  write("reviews", mockReviews);
  write("bookings", mockBookings);
  write("users", users);
  write("coupons", coupons);
  write("banners", banners);
  write("home-layout", [DEFAULT_HOME_LAYOUT]);
  write("bundle-offers", DEFAULT_BUNDLE_OFFERS);
  write("bundle-offers-section", [DEFAULT_BUNDLE_OFFERS_SECTION]);
  write("about-journey-section", [DEFAULT_ABOUT_JOURNEY_SECTION]);
  write("about-leadership-section", [DEFAULT_ABOUT_LEADERSHIP_SECTION]);
  write("about-team", DEFAULT_ABOUT_TEAM);
  write("about-milestones", DEFAULT_ABOUT_MILESTONES);
  write("hero-slides", DEFAULT_HERO_SLIDES);
  write("contact-messages", []);
  write("notifications", []);
  write("newsletter-subscribers", []);
  write("analytics", { salesData, topProducts });
  write("push-subscriptions", []);
  write("activity-logs", []);
  console.log("\nDone! Default credentials:");
  console.log("  Admin:    admin@autozone.pk / Admin@123");
  console.log("  Customer: ahmed@email.com / Customer@123");
}

main().catch(console.error);
