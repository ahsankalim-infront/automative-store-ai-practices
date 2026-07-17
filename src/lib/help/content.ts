import type { BrandConfig } from "@/lib/brand/types";
import { DEFAULT_BRAND } from "@/lib/brand/config";

export interface PolicySection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const HELP_LAST_UPDATED = "July 14, 2026";

export function buildFaqItems(brand: BrandConfig = DEFAULT_BRAND): FaqItem[] {
  return [
  {
    id: "faq-orders-1",
    category: "Orders & Payment",
    question: "How do I place an order?",
    answer:
      "Browse products, add items to your cart, and proceed to checkout. Enter your delivery address, choose Cash on Delivery (COD), card, or bank transfer, and confirm your order. You will receive an order number on the confirmation screen and in your account.",
  },
  {
    id: "faq-orders-2",
    category: "Orders & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) across Pakistan, debit/credit cards, and bank transfer. For custom seat covers and poshish work, a partial advance may be required before production begins.",
  },
  {
    id: "faq-orders-3",
    category: "Orders & Payment",
    question: "Can I change or cancel my order?",
    answer:
      "Contact us within 2 hours of placing your order via WhatsApp or phone. Once custom seat covers or floor matting enter production, changes may not be possible. Standard stocked items can usually be modified before dispatch.",
  },
  {
    id: "faq-shipping-1",
    category: "Shipping & Delivery",
    question: "Do you deliver outside Lahore?",
    answer:
      "Yes. We deliver nationwide across Pakistan through trusted courier partners. Lahore orders often qualify for same-week delivery; other cities typically receive orders in 3–5 business days.",
  },
  {
    id: "faq-shipping-2",
    category: "Shipping & Delivery",
    question: "Is delivery free?",
    answer:
      "Orders above Rs. 1,500 qualify for free delivery within Lahore. For other cities, shipping is calculated at checkout based on weight and destination. Bulky custom matting sets may incur a small surcharge.",
  },
  {
    id: "faq-shipping-3",
    category: "Shipping & Delivery",
    question: "How long does custom seat cover delivery take?",
    answer:
      "Custom made PU/PVC seat covers usually require 5–10 business days for stitching and quality check before dispatch. We will confirm the expected date when you place your order.",
  },
  {
    id: "faq-products-1",
    category: "Products & Fitting",
    question: "Are seat covers custom fit for my car?",
    answer:
      "Yes. Our signature custom seat covers are made to your vehicle make, model, and year. Share your car details at checkout or visit our Lahore studio for measurement and colour selection.",
  },
  {
    id: "faq-products-2",
    category: "Products & Fitting",
    question: "Do you offer installation?",
    answer:
      "Yes. Professional seat cover fitting and interior poshish services are available at our Lahore office and through booked appointments. Installation charges vary by product — see the product page or contact us for a quote.",
  },
  {
    id: "faq-products-3",
    category: "Products & Fitting",
    question: "What is the difference between 5D, 7D, and 9D floor matting?",
    answer:
      "5D mats offer high-wall protection with a simpler design. 7D adds full-surround coverage and thicker channels for dirt and spills. 9D is our premium line with maximum wall height, luxury finish, and extended heel-pad protection.",
  },
  {
    id: "faq-returns-1",
    category: "Returns & Warranty",
    question: "Can I return a product?",
    answer:
      "Standard ready-made items in unused condition can be returned within 7 days of delivery. Custom-made seat covers, cut floor matting, and installed products are non-returnable unless there is a manufacturing defect.",
  },
  {
    id: "faq-returns-2",
    category: "Returns & Warranty",
    question: "What if my product arrives damaged?",
    answer:
      "Inspect your parcel on delivery. If the item is damaged or incorrect, refuse the package if possible and contact us within 48 hours with photos. We will arrange a replacement or refund after verification.",
  },
  {
    id: "faq-returns-3",
    category: "Returns & Warranty",
    question: "Do products come with a warranty?",
    answer:
      "Seat covers and floor matting include a workmanship warranty against stitching defects and material peeling under normal use. Warranty duration varies by product line — typically 6–12 months. Abuse, burns, and improper cleaning are not covered.",
  },
  {
    id: "faq-store-1",
    category: "Store & Contact",
    question: "Where is your shop located?",
    answer: `Visit us at ${brand.address.full}. We are open ${brand.businessHours}. Walk-ins are welcome for colour samples, measurements, and consultations.`,
  },
  {
    id: "faq-store-2",
    category: "Store & Contact",
    question: "How can I get a quote for custom poshish?",
    answer:
      `WhatsApp us at ${brand.primaryPhone}, call our team, or use the contact form on this website. Share your car model, preferred material (PU/PVC), colour, and photos of your interior for the fastest quote.`,
  },
];
}

export const FAQ_ITEMS = buildFaqItems();

export function buildShippingSections(brand: BrandConfig = DEFAULT_BRAND): PolicySection[] {
  return [
  {
    id: "coverage",
    title: "Delivery Coverage",
    paragraphs: [
      `${brand.name} delivers premium car poshish products across Pakistan. Lahore customers enjoy priority dispatch from our Abbot Road studio. Nationwide orders are shipped via reliable courier partners including TCS, Leopards, and M&P.`,
    ],
    bullets: [
      "Lahore — same-city delivery in 1–3 business days",
      "Major cities (Karachi, Islamabad, Rawalpindi, Faisalabad, Multan) — 3–5 business days",
      "Other areas — 4–7 business days depending on courier coverage",
      "Remote locations may require additional 1–2 days",
    ],
  },
  {
    id: "rates",
    title: "Shipping Rates",
    paragraphs: [
      "Shipping charges are calculated at checkout based on order value, weight, and destination.",
    ],
    bullets: [
      "Free delivery on orders above Rs. 1,500 within Lahore",
      "Standard Lahore delivery: Rs. 250 for orders below Rs. 1,500",
      "Nationwide courier: from Rs. 350–800 depending on city and package size",
      "Heavy custom matting sets or bulk orders — quoted individually",
    ],
    note: "Promotional free-shipping offers may apply during sales events and will be shown at checkout.",
  },
  {
    id: "processing",
    title: "Order Processing Time",
    paragraphs: [
      "In-stock accessories and lighting ship within 1–2 business days after order confirmation.",
      "Custom seat covers and made-to-order floor matting require production time before dispatch.",
    ],
    bullets: [
      "Ready stock items — 1–2 business days",
      "Custom seat covers — 5–10 business days",
      "Custom floor matting — 3–7 business days",
      "Car top covers — 2–5 business days",
    ],
  },
  {
    id: "tracking",
    title: "Order Tracking",
    paragraphs: [
      "Once your order is shipped, you will receive a tracking number via SMS/WhatsApp or in your account. Use our Track Order page with your order number and registered phone number to check status anytime.",
    ],
  },
  {
    id: "installation",
    title: "Studio Pickup & Installation",
    paragraphs: [
      "You may collect orders from our Lahore office during business hours. Seat cover fitting and poshish installation can be scheduled at checkout or by booking a service appointment.",
      "Installation slots are subject to availability. We recommend booking in advance for weekend fittings.",
    ],
  },
  {
    id: "issues",
    title: "Delivery Issues",
    paragraphs: [
      "If your parcel is delayed, damaged, or lost in transit, contact us immediately with your order number.",
    ],
    bullets: [
      "Report missing parcels within 7 days of expected delivery",
      "Provide photos for damaged packaging or products",
      "We will coordinate with the courier and arrange replacement or refund where applicable",
    ],
  },
];
}

export const SHIPPING_SECTIONS = buildShippingSections();

export function buildReturnsSections(brand: BrandConfig = DEFAULT_BRAND): PolicySection[] {
  return [
  {
    id: "overview",
    title: "Returns Overview",
    paragraphs: [
      `At ${brand.name}, customer satisfaction is our priority. We want you to love your car poshish products. If something is not right, please review the policy below before initiating a return.`,
    ],
    note: "Custom-made and installed products have special conditions — see Custom Products below.",
  },
  {
    id: "eligible",
    title: "Eligible for Return",
    paragraphs: ["The following items may be returned within 7 days of delivery if unused and in original packaging:"],
    bullets: [
      "Ready-made accessories (LED lights, car care, gadgets)",
      "Standard-size car top covers (unopened/unused)",
      "Items received incorrect or different from what was ordered",
      "Defective products with manufacturing faults",
    ],
  },
  {
    id: "not-eligible",
    title: "Not Eligible for Return",
    paragraphs: ["The following cannot be returned or exchanged except in case of verified defect:"],
    bullets: [
      "Custom-made seat covers (any colour, stitch pattern, or vehicle-specific cut)",
      "Custom-cut floor matting (5D/7D/9D) made for your vehicle model",
      "Products that have been installed, used, washed, or altered",
      "Clearance or final-sale items marked non-returnable",
      "Items returned without original tags, packaging, or proof of purchase",
    ],
  },
  {
    id: "process",
    title: "How to Request a Return",
    paragraphs: ["Follow these steps to start a return or exchange:"],
    bullets: [
      `Contact us on WhatsApp ${brand.primaryPhone} or email ${brand.email} within 7 days`,
      "Provide your order number, reason for return, and clear photos",
      "Wait for return authorization (RMA) and instructions",
      "Ship the item back in original packaging or drop off at our Lahore office",
      "Refunds are processed within 5–7 business days after we receive and inspect the item",
    ],
  },
  {
    id: "refunds",
    title: "Refunds",
    paragraphs: [
      "Approved refunds are credited to your original payment method. Cash on Delivery orders receive a bank transfer or JazzCash/EasyPaisa refund after verification.",
    ],
    bullets: [
      "Product price is refunded in full for defective or wrong items",
      "Original shipping fees are non-refundable unless we shipped the wrong item",
      "Return shipping for change-of-mind returns is paid by the customer",
      "Partial refunds may apply if packaging or accessories are missing",
    ],
  },
  {
    id: "exchanges",
    title: "Exchanges",
    paragraphs: [
      "We offer exchanges for size or colour on eligible standard products subject to stock availability. Custom products cannot be exchanged — a new order must be placed.",
    ],
  },
  {
    id: "warranty",
    title: "Warranty Claims",
    paragraphs: [
      "Workmanship warranty covers stitching defects, seam opening, and material peeling under normal use. Warranty does not cover burns, cuts, pet damage, or harsh chemical cleaning.",
      "Contact us with photos and your order details. We may request inspection at our Lahore studio for custom poshish items.",
    ],
  },
];
}

export const RETURNS_SECTIONS = buildReturnsSections();

export const TRACK_ORDER_STEPS = [
  {
    title: "Enter order number",
    description: "Track any order using the number from your confirmation SMS or email.",
  },
  {
    title: "Or use your phone",
    description: "Optionally add your phone to see all active orders still on the way.",
  },
  {
    title: "View live status",
    description: "See processing, shipped, and delivery updates instantly.",
  },
];

export const HELP_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Policy", href: "/shipping" },
  { label: "Terms & Conditions", href: "/terms" },
];
