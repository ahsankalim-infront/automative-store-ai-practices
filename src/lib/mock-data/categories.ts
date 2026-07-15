import type { Category } from "@/types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=300&h=200&q=80`;

export const categories: Category[] = [
  { id: "cat-1", slug: "led-lighting", name: "LED & Lighting", icon: "Lightbulb", productCount: 245, sortOrder: 1, image: img("1558981806-ec527fa84c39") },
  { id: "cat-2", slug: "exterior", name: "Exterior", icon: "Car", productCount: 312, sortOrder: 2, image: img("1494976388531-d1058494cdd8") },
  { id: "cat-3", slug: "interior", name: "Interior", icon: "Armchair", productCount: 289, sortOrder: 3, image: img("1503376780353-7e6692767b70") },
  { id: "cat-4", slug: "car-care", name: "Car Care", icon: "Sparkles", productCount: 198, sortOrder: 4, image: img("1607860108855-64acf2078ed9") },
  { id: "cat-5", slug: "modifications", name: "Modifications", icon: "Wrench", productCount: 167, sortOrder: 5, image: img("1517524008697-84bbe3c3fd98") },
  { id: "cat-6", slug: "gadgets", name: "Gadgets", icon: "Smartphone", productCount: 203, sortOrder: 6, image: img("1542362567-b07e54358753") },
  { id: "cat-7", slug: "paint-protection-film", name: "PPF", icon: "Shield", productCount: 78, sortOrder: 7, image: img("1619767886558-6fe7a3507b2d") },
  { id: "cat-8", slug: "performance", name: "Performance", icon: "Zap", productCount: 94, sortOrder: 8, image: img("1580273916550-e323be2ae537") },
  { id: "cat-9", slug: "utilities", name: "Utilities", icon: "Package", productCount: 145, sortOrder: 9, image: img("1610978960485-2e0e12de39a3") },
  { id: "cat-10", slug: "wheels", name: "Wheels & Rims", icon: "Circle", productCount: 89, sortOrder: 10, image: img("1603584173870-7a274a4ea6db") },
  { id: "cat-11", slug: "perfumes", name: "Perfumes", icon: "Wind", productCount: 67, sortOrder: 11, image: img("1541038880942-4c8b74b2b6fb") },
  { id: "cat-12", slug: "car-mats", name: "Car Mats", icon: "LayoutGrid", productCount: 112, sortOrder: 12, image: img("1449965408869-eefa2d9f0f88") },
  { id: "cat-13", slug: "music-stereo", name: "Music & Stereo", icon: "Music", productCount: 88, sortOrder: 13, image: img("1502877338535-766f1f6deb61") },
  { id: "cat-14", slug: "security", name: "Security", icon: "Lock", productCount: 56, sortOrder: 14, image: img("1544636331-9849c66b2a09") },
  { id: "cat-15", slug: "bike-accessories", name: "Bike Accessories", icon: "Bike", productCount: 73, sortOrder: 15, image: img("1558618047-3d306a4ff9b2") },
  { id: "cat-16", slug: "spare-parts", name: "Spare Parts", icon: "Settings", productCount: 134, sortOrder: 16, image: img("1596838132731-3301c3fd4317") },
];

export const featuredCategories = categories.slice(0, 8);
