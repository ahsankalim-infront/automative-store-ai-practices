/**
 * Plain-text terms & policies included on order summary PDFs.
 * Keep in sync with /terms page content.
 */

export const LEGAL_META = {
  lastUpdated: "July 13, 2026",
  effectiveDate: "January 1, 2024",
} as const;

export interface PolicySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const ORDER_SUMMARY_TERMS: PolicySection[] = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By placing an order with Shahzad Poshish House, you confirm that you have read, understood, and agree to these Terms & Conditions and our store policies.",
      "These terms constitute a legally binding agreement between you and Shahzad Poshish House.",
    ],
  },
  {
    title: "2. Eligibility & Account",
    paragraphs: [
      "You must be at least 18 years of age to place an order. You are responsible for maintaining accurate account and contact information.",
    ],
  },
  {
    title: "3. Products & Pricing",
    paragraphs: [
      "All prices are in Pakistani Rupees (PKR) unless stated otherwise. Product images are for illustration; actual colour and packaging may vary slightly.",
      "We reserve the right to modify prices, limit quantities, or cancel orders in case of pricing errors or stock unavailability.",
    ],
  },
  {
    title: "4. Orders & Payment",
    paragraphs: [
      "Your order is an offer to purchase. A contract is formed when we confirm and dispatch your order.",
      "Accepted payment methods: Cash on Delivery (COD), credit/debit cards, bank transfer, and digital wallets (JazzCash, EasyPaisa) where available.",
      "We may cancel orders for suspected fraud, stock issues, or pricing errors. A full refund will be processed if cancelled after payment.",
    ],
  },
];

export const ORDER_SUMMARY_POLICIES: PolicySection[] = [
  {
    title: "Shipping & Delivery Policy",
    paragraphs: [
      "We deliver nationwide across Pakistan. Delivery timelines are estimates and may vary by location and courier capacity.",
    ],
    bullets: [
      "Major cities (Lahore, Karachi, Islamabad): 1–3 business days",
      "Other cities: 3–5 business days",
      "Remote areas: 5–10 business days",
      "Free shipping on orders above Rs. 1,500; otherwise standard shipping fee applies",
      "Risk of loss passes to you upon delivery to the address provided",
    ],
  },
  {
    title: "Returns & Refunds Policy",
    paragraphs: [
      "7-day return policy applies to eligible unused items in original packaging with proof of purchase.",
    ],
    bullets: [
      "Items must be unused, in original condition, with tags and accessories",
      "Non-returnable: installed/used products, customized items, opened consumables, electrical items once used",
      "Refunds processed within 5–7 business days after inspection",
      "Refunds credited to the original payment method where applicable",
    ],
  },
  {
    title: "Warranty Policy",
    paragraphs: [
      "Manufacturer warranties apply where specified. Shahzad Poshish House branded products carry a 1-year limited warranty unless stated otherwise.",
    ],
    bullets: [
      "Third-party brands: per manufacturer warranty",
      "Installation services: 30-day workmanship warranty",
      "Warranty excludes misuse, unauthorized modifications, and improper self-installation",
    ],
  },
  {
    title: "Installation Services Policy",
    paragraphs: [
      "Professional installation is available for compatible products. You agree to provide the vehicle at the agreed time and follow post-installation care instructions.",
      "We may decline installation if the vehicle is unsuitable or unsafe. Product warranty and installation workmanship warranty are separate.",
    ],
  },
  {
    title: "Privacy Policy (Summary)",
    paragraphs: [
      "We collect and process personal data to fulfill orders, provide support, and improve our services. We do not sell your personal data to third parties.",
      "Order data may be shared with logistics and payment partners as required to complete your purchase. See our full Privacy Policy on the website.",
    ],
  },
  {
    title: "Limitation of Liability & Governing Law",
    paragraphs: [
      "Shahzad Poshish House is not liable for indirect or consequential damages beyond the amount paid for the specific order, to the extent permitted by law.",
      "These terms are governed by the laws of Pakistan. Disputes are subject to the courts of Lahore, Punjab.",
    ],
  },
];

export function flattenPolicySections(sections: PolicySection[]): string[] {
  const lines: string[] = [];
  for (const section of sections) {
    lines.push(section.title);
    for (const p of section.paragraphs) lines.push(p);
    if (section.bullets?.length) {
      for (const b of section.bullets) lines.push(`• ${b}`);
    }
    lines.push("");
  }
  return lines;
}
