import type { Service, Store, ServiceBooking } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=400&q=80`;

export const services: Service[] = [
  {
    id: "svc-1", slug: "paint-protection-film", type: "ppf",
    name: "Paint Protection Film (PPF)",
    description: "Professional PPF installation using premium self-healing TPU films. Choose from clear, matte, or colored PPF for full or partial coverage — applied in a dustfree studio.",
    image: img("1619767886558-6fe7a3507b2d"),
    priceFrom: 25000, priceTo: 150000, duration: "1-2 Days",
    features: ["Self-Healing TPU", "UV Resistant", "10 Year Warranty", "Dustfree Studio", "Free Pre-Inspection"],
    popular: true,
  },
  {
    id: "svc-2", slug: "ceramic-coating", type: "ceramic",
    name: "Ceramic Coating",
    description: "Nano-ceramic coating that permanently bonds with your paint for superior gloss, hydrophobic protection, and UV resistance. Applied by certified technicians.",
    image: img("1607860108855-64acf2078ed9"),
    priceFrom: 18000, priceTo: 75000, duration: "2-3 Days",
    features: ["9H Hardness", "Hydrophobic Effect", "UV Protection", "3-5 Year Life", "Mirror Gloss Finish"],
    popular: true,
  },
  {
    id: "svc-3", slug: "car-detailing", type: "detailing",
    name: "Car Detailing",
    description: "Complete interior and exterior detailing. Paint correction, deep clean, clay bar treatment, wax, and full protection for a showroom-fresh finish.",
    image: img("1596838132731-3301c3fd4317"),
    priceFrom: 5000, priceTo: 35000, duration: "4-8 Hours",
    features: ["Paint Correction", "Deep Interior Clean", "Engine Bay Wash", "Odor Removal", "Machine Polishing"],
    popular: false,
  },
  {
    id: "svc-4", slug: "window-tint", type: "tint",
    name: "Window Tinting",
    description: "Premium Maximus nano-ceramic window tints with up to 99% UV rejection and superior heat blocking. 12 shades available, legally compliant options included.",
    image: img("1544636331-9849c66b2a09"),
    priceFrom: 8000, priceTo: 35000, duration: "3-5 Hours",
    features: ["99% UV Rejection", "Heat Rejection", "12 Shades", "Anti-Scratch Coat", "3 Year Warranty"],
    popular: true,
  },
  {
    id: "svc-5", slug: "installation", type: "installation",
    name: "Product Installation",
    description: "Professional installation of any car accessory — Android panels, reverse cameras, LED lights, dash cams, body kits, and more by certified auto technicians.",
    image: img("1558618047-3d306a4ff9b2"),
    priceFrom: 500, priceTo: 15000, duration: "1-4 Hours",
    features: ["Certified Technicians", "All Accessories", "Clean Wire Management", "Testing Included", "1 Month Warranty"],
    popular: false,
  },
  {
    id: "svc-6", slug: "vehicle-inspection", type: "inspection",
    name: "Vehicle Inspection",
    description: "Comprehensive pre-purchase or maintenance inspection. 100-point exterior, interior, mechanical, and electronics check with a detailed written report.",
    image: img("1502877338535-766f1f6deb61"),
    priceFrom: 2500, priceTo: 5000, duration: "2-3 Hours",
    features: ["100-Point Check", "Written Report", "Photos Included", "Expert Consultation", "No Hidden Costs"],
    popular: false,
  },
];

export const stores: Store[] = [
  { id: "store-1", name: "AutoZone - Main Branch Lahore", city: "Lahore", address: "23-B, Gulberg III, Lahore", phone: "042-35780001", email: "lahore@autozone.pk", hours: "Mon-Sun: 10AM-10PM", services: ["PPF", "Detailing", "Installation", "Ceramic", "Tinting"], isMainBranch: true },
  { id: "store-2", name: "AutoZone - DHA Lahore", city: "Lahore", address: "Phase 5, DHA, Lahore", phone: "042-35780002", hours: "Mon-Sun: 10AM-10PM", services: ["PPF", "Installation", "Tinting"] },
  { id: "store-3", name: "AutoZone - Faisalabad", city: "Faisalabad", address: "Susan Road, Madina Town, Faisalabad", phone: "041-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["Installation", "Detailing"] },
  { id: "store-4", name: "AutoZone - Karachi Clifton", city: "Karachi", address: "Block 5, Clifton, Karachi", phone: "021-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["PPF", "Detailing", "Installation", "Ceramic"] },
  { id: "store-5", name: "AutoZone - Islamabad", city: "Islamabad", address: "F-7/1, Islamabad", phone: "051-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["PPF", "Installation", "Tinting"] },
  { id: "store-6", name: "AutoZone - Multan", city: "Multan", address: "Gulgasht Colony, Multan", phone: "061-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["Installation", "Detailing"] },
  { id: "store-7", name: "AutoZone - Sialkot", city: "Sialkot", address: "Cantt, Sialkot", phone: "052-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["Installation"] },
  { id: "store-8", name: "AutoZone - Gujranwala", city: "Gujranwala", address: "G.T. Road, Gujranwala", phone: "055-35780001", hours: "Mon-Sun: 10AM-10PM", services: ["Installation", "Detailing"] },
];

export const mockBookings: ServiceBooking[] = [
  { id: "bk-001", serviceId: "svc-1", serviceName: "Paint Protection Film", userId: "u-001", userName: "Ahmed Khan", userPhone: "0300-1234567", branchId: "store-1", branchName: "AutoZone - Main Branch Lahore", date: "2026-07-18", timeSlot: "10:00 AM", vehicleInfo: "Toyota Corolla 2022", status: "confirmed", price: 45000, createdAt: "2026-07-13T00:00:00Z" },
  { id: "bk-002", serviceId: "svc-2", serviceName: "Ceramic Coating", userId: "u-002", userName: "Sara Ahmed", userPhone: "0321-9876543", branchId: "store-4", branchName: "AutoZone - Karachi Clifton", date: "2026-07-19", timeSlot: "02:00 PM", vehicleInfo: "Honda Civic 2024", status: "pending", price: 35000, createdAt: "2026-07-12T00:00:00Z" },
];
