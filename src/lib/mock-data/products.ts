import type { Product } from "@/types";

// Free-to-use Unsplash images matched to product categories
const img = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const products: Product[] = [
  // ─── LED & Lighting ──────────────────────────────────────────────────────────
  {
    id: "p-001", slug: "maximus-sirius-led-h4-85w",
    name: "Maximus Sirius LED Ultra Bright Headlights H4 - 85W",
    sku: "MXS-LED-H4-85W", brand: "Maximus", brandSlug: "maximus",
    category: "LED & Lighting", categorySlug: "led-lighting",
    images: [
      { id: "i1", url: img("1558981806-ec527fa84c39"), alt: "LED H4 Headlight", isPrimary: true },
      { id: "i2", url: img("1604999974288-6e3329448cc1"), alt: "LED Headlight side view", isPrimary: false },
      { id: "i3", url: img("1519681393784-d120267933ba"), alt: "LED installed on car", isPrimary: false },
    ],
    price: 15000, originalPrice: 18000, discount: 17,
    stock: 45, inStock: true, rating: 4.7, reviewCount: 23,
    description: "Maximus Sirius series ultra-bright LED headlights deliver 8500 lumens per pair. Compatible with projector and reflector housings. CANBUS compatible with anti-flicker design. Easy plug-and-play installation for most vehicles.",
    shortDescription: "85W ultra-bright LED headlight pair, H4 base, 8500 lumens, CANBUS compatible",
    specifications: [
      { label: "Wattage", value: "85W" }, { label: "Lumens", value: "8500 lm/pair" },
      { label: "Color Temp", value: "6500K White" }, { label: "Base", value: "H4" },
      { label: "Cooling", value: "Turbo Fan + Heatsink" }, { label: "Warranty", value: "1 Year" },
      { label: "CANBUS", value: "Compatible" }, { label: "IP Rating", value: "IP67 Waterproof" },
    ],
    vehicleCompatibility: [
      { brand: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2026 },
      { brand: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2022 },
      { brand: "Suzuki", model: "Swift", yearFrom: 2010, yearTo: 2024 },
      { brand: "Hyundai", model: "Elantra", yearFrom: 2013, yearTo: 2022 },
    ],
    installationAvailable: true, installationPrice: 1500,
    warranty: "1 Year Manufacturer Warranty",
    tags: ["led", "headlight", "h4", "maximus", "lighting"],
    isFeatured: true, isNew: false, isBestSeller: true, isFlashSale: false,
    createdAt: "2024-01-15T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "p-002", slug: "maximus-intense-led-h4-30w",
    name: "Maximus Intense LED Headlight Bulb H4 - 30W Fanless",
    sku: "MXI-LED-H4-30W", brand: "Maximus", brandSlug: "maximus",
    category: "LED & Lighting", categorySlug: "led-lighting",
    images: [
      { id: "i1", url: img("1580273916550-e323be2ae537"), alt: "LED H4 30W bulb", isPrimary: true },
      { id: "i2", url: img("1558981359-219d6364c9c8"), alt: "LED light installed", isPrimary: false },
    ],
    price: 5000, originalPrice: 6500, discount: 23,
    stock: 78, inStock: true, rating: 4.5, reviewCount: 18,
    description: "Entry-level Intense series LED bulb. Compact fanless design means zero noise. Plug and play installation with no modification required.",
    shortDescription: "30W compact fanless LED headlight, H4 base, silent, plug & play",
    specifications: [
      { label: "Wattage", value: "30W" }, { label: "Lumens", value: "4500 lm/pair" },
      { label: "Color Temp", value: "6000K" }, { label: "Base", value: "H4" },
      { label: "Design", value: "Fanless / Silent" },
    ],
    installationAvailable: true, installationPrice: 1000,
    tags: ["led", "headlight", "h4", "fanless"],
    isFeatured: false, isNew: false, isBestSeller: true, isFlashSale: true,
    flashSaleEnds: "2026-07-20T23:59:59Z",
    createdAt: "2024-03-10T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },

  // ─── Car Mats ────────────────────────────────────────────────────────────────
  {
    id: "p-003", slug: "toyota-corolla-5d-floor-mats",
    name: "Toyota Corolla 5D Luxury Floor Mats - Black",
    sku: "MAT-COR-5D-BLK", brand: "Maximus", brandSlug: "maximus",
    category: "Car Mats", categorySlug: "car-mats",
    images: [
      { id: "i1", url: img("1449965408869-eefa2d9f0f88"), alt: "5D floor mats black", isPrimary: true },
      { id: "i2", url: img("1507136566006-cfc505b114fc"), alt: "Car interior with mats", isPrimary: false },
    ],
    price: 8500, originalPrice: 10000, discount: 15,
    stock: 32, inStock: true, rating: 4.8, reviewCount: 45,
    description: "Custom-fit 5D floor mats for Toyota Corolla. High-wall design for maximum spill protection. Odorless TPE rubber, waterproof, and easy to clean. Anti-slip base with pegs.",
    shortDescription: "Custom fit 5D mats for Toyota Corolla, waterproof, anti-slip, 5-piece set",
    specifications: [
      { label: "Material", value: "5D Foam + XPE Leather" }, { label: "Pieces", value: "5 Piece Set" },
      { label: "Color", value: "Black" }, { label: "Fit", value: "Custom Fit" },
      { label: "Waterproof", value: "Yes" }, { label: "Anti-Slip", value: "Yes" },
    ],
    vehicleCompatibility: [
      { brand: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2026 },
    ],
    installationAvailable: false,
    tags: ["mats", "toyota", "corolla", "interior"],
    isFeatured: true, isNew: false, isBestSeller: true, isFlashSale: false,
    createdAt: "2024-02-20T00:00:00Z", updatedAt: "2026-05-15T00:00:00Z",
  },

  // ─── Interior ────────────────────────────────────────────────────────────────
  {
    id: "p-004", slug: "universal-seat-covers-black-red",
    name: "Universal Seat Covers - Premium PU Leather Black/Red",
    sku: "SC-UNI-BLKRED", brand: "Maximus", brandSlug: "maximus",
    category: "Interior", categorySlug: "interior",
    images: [
      { id: "i1", url: img("1503376780353-7e6692767b70"), alt: "Premium seat covers black red", isPrimary: true },
      { id: "i2", url: img("1558618666-fcd25c85cd64"), alt: "Car seat interior", isPrimary: false },
    ],
    price: 12000, originalPrice: 15000, discount: 20,
    stock: 28, inStock: true, rating: 4.6, reviewCount: 67,
    description: "Premium PU leather seat covers with red contrast stitching. Airbag compatible split design. Easy installation with elastic hooks and back pocket.",
    shortDescription: "Premium PU leather seat covers, black with red stitching, airbag compatible, 9 pcs",
    specifications: [
      { label: "Material", value: "PU Leather" }, { label: "Pieces", value: "9 Piece Set" },
      { label: "Airbag Compatible", value: "Yes" }, { label: "Fit", value: "Universal" },
      { label: "Back Pockets", value: "Yes" },
    ],
    installationAvailable: true, installationPrice: 2000,
    tags: ["seat cover", "interior", "leather"],
    isFeatured: true, isNew: false, isBestSeller: false, isFlashSale: false,
    createdAt: "2024-04-05T00:00:00Z", updatedAt: "2026-06-20T00:00:00Z",
  },

  // ─── Car Care ────────────────────────────────────────────────────────────────
  {
    id: "p-005", slug: "maximus-polishing-compound-200g",
    name: "Maximus Polishing Compound 200g - Scratch Remover",
    sku: "MXP-POLISH-200G", brand: "Maximus", brandSlug: "maximus",
    category: "Car Care", categorySlug: "car-care",
    images: [
      { id: "i1", url: img("1607860108855-64acf2078ed9"), alt: "Polishing compound", isPrimary: true },
      { id: "i2", url: img("1596838132731-3301c3fd4317"), alt: "Car polishing", isPrimary: false },
    ],
    price: 350, stock: 250, inStock: true, rating: 4.4, reviewCount: 89,
    description: "Professional-grade polishing compound that removes light scratches, swirl marks, and oxidation. Safe for all paint types including clear coat.",
    shortDescription: "200g scratch remover polishing compound for all paint types",
    specifications: [
      { label: "Weight", value: "200g" }, { label: "Type", value: "Cut & Polish" },
      { label: "Application", value: "Hand or Machine" }, { label: "Safe For", value: "All Paint Types" },
    ],
    installationAvailable: false,
    tags: ["polish", "scratch remover", "car care"],
    isFeatured: false, isNew: false, isBestSeller: true, isFlashSale: true,
    flashSaleEnds: "2026-07-20T23:59:59Z",
    createdAt: "2023-08-10T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "p-006", slug: "maximus-microfiber-cloth-mfc1",
    name: "Maximus Professional Microfiber Cloth MFC-1 60x30CM 230GSM",
    sku: "MXP-MFC1-60X30", brand: "Maximus", brandSlug: "maximus",
    category: "Car Care", categorySlug: "car-care",
    images: [
      { id: "i1", url: img("1558618047-3d306a4ff9b2"), alt: "Microfiber detailing cloth", isPrimary: true },
      { id: "i2", url: img("1541899481282-d53bffe3c35d"), alt: "Car cleaning cloth", isPrimary: false },
    ],
    price: 400, stock: 500, inStock: true, rating: 4.8, reviewCount: 156,
    description: "Professional grade 230 GSM microfiber cloth. Ultra-soft, lint-free, and machine washable. The go-to choice for professional detailers across Pakistan.",
    shortDescription: "Pro-grade 230GSM microfiber detailing cloth, 60x30cm, multi-color pack",
    specifications: [
      { label: "Size", value: "60x30cm" }, { label: "GSM", value: "230 GSM" },
      { label: "Pack", value: "1 Piece" }, { label: "Washable", value: "Yes, machine washable" },
    ],
    variants: [
      { id: "v1", name: "Color", value: "Yellow", stock: 200, sku: "MXP-MFC1-YLW" },
      { id: "v2", name: "Color", value: "Grey", stock: 150, sku: "MXP-MFC1-GRY" },
      { id: "v3", name: "Color", value: "Blue", stock: 150, sku: "MXP-MFC1-BLU" },
    ],
    installationAvailable: false,
    tags: ["microfiber", "detailing", "car care"],
    isFeatured: false, isNew: false, isBestSeller: true, isFlashSale: false,
    createdAt: "2023-05-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },

  // ─── Gadgets ─────────────────────────────────────────────────────────────────
  {
    id: "p-007", slug: "android-panel-9inch-toyota-corolla",
    name: "Android Panel 9\" Full HD - Toyota Corolla 2014-2024",
    sku: "AND-9-COR-14-24", brand: "Maximus", brandSlug: "maximus",
    category: "Gadgets", categorySlug: "gadgets",
    images: [
      { id: "i1", url: img("1502877338535-766f1f6deb61"), alt: "Android multimedia panel", isPrimary: true },
      { id: "i2", url: img("1542362567-b07e54358753"), alt: "Car infotainment screen", isPrimary: false },
      { id: "i3", url: img("1491895200222-0fc4a4c35e18"), alt: "Android panel installed", isPrimary: false },
    ],
    price: 38000, originalPrice: 45000, discount: 16,
    stock: 15, inStock: true, rating: 4.5, reviewCount: 32,
    description: "9-inch Full HD IPS Android panel for Toyota Corolla. 4GB RAM + 64GB ROM. Built-in GPS navigation, Bluetooth 5.0, WiFi, 4G SIM slot. Reverse camera input included. Steering wheel control compatible.",
    shortDescription: "9\" HD Android panel for Toyota Corolla, 4GB RAM 64GB ROM, GPS WiFi BT 4G",
    specifications: [
      { label: "Screen Size", value: "9 inches" }, { label: "Resolution", value: "1280x720 HD IPS" },
      { label: "RAM/ROM", value: "4GB / 64GB" }, { label: "OS", value: "Android 12" },
      { label: "GPS", value: "Built-in" }, { label: "Bluetooth", value: "5.0" },
      { label: "WiFi", value: "2.4G + 5G" }, { label: "4G SIM", value: "Compatible" },
    ],
    vehicleCompatibility: [
      { brand: "Toyota", model: "Corolla", yearFrom: 2014, yearTo: 2024 },
    ],
    installationAvailable: true, installationPrice: 3000,
    warranty: "1 Year",
    tags: ["android panel", "multimedia", "toyota", "corolla"],
    isFeatured: true, isNew: true, isBestSeller: false, isFlashSale: false,
    createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "p-008", slug: "dash-cam-4k-front-rear",
    name: "Dash Camera 4K Front + 1080P Rear - Dual Channel Night Vision",
    sku: "DCM-4K-DUAL", brand: "Maximus", brandSlug: "maximus",
    category: "Gadgets", categorySlug: "gadgets",
    images: [
      { id: "i1", url: img("1547899563-86b3b7a9e485"), alt: "Dash camera 4K", isPrimary: true },
      { id: "i2", url: img("1555215695-3004980ad54d"), alt: "Dash cam installed", isPrimary: false },
    ],
    price: 8500, originalPrice: 10000, discount: 15,
    stock: 40, inStock: true, rating: 4.3, reviewCount: 28,
    description: "4K front camera with 1080P rear. Superior night vision, parking mode with G-sensor, loop recording. 3-inch IPS display with touch controls.",
    shortDescription: "4K+1080P dual dash cam, night vision, parking mode, G-sensor, 3\" IPS",
    specifications: [
      { label: "Front Res", value: "4K 3840x2160" }, { label: "Rear Res", value: "1080P FHD" },
      { label: "Display", value: "3-inch IPS Touch" }, { label: "Night Vision", value: "Starlight" },
      { label: "G-Sensor", value: "Yes" }, { label: "Parking Mode", value: "Yes" },
    ],
    installationAvailable: true, installationPrice: 1500,
    tags: ["dash cam", "camera", "security"],
    isFeatured: false, isNew: true, isBestSeller: false, isFlashSale: true,
    flashSaleEnds: "2026-07-20T23:59:59Z",
    createdAt: "2026-04-10T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },

  // ─── PPF ─────────────────────────────────────────────────────────────────────
  {
    id: "p-009", slug: "maximus-rhino-skin-ppf-tpu",
    name: "Maximus Rhino Skin PPF Transparent TPU - 4 x 120 Inches",
    sku: "MXP-PPF-TPU-120", brand: "Maximus", brandSlug: "maximus",
    category: "Paint Protection Film", categorySlug: "paint-protection-film",
    images: [
      { id: "i1", url: img("1619767886558-6fe7a3507b2d"), alt: "PPF paint protection film", isPrimary: true },
      { id: "i2", url: img("1541038880942-4c8b74b2b6fb"), alt: "PPF applied on car hood", isPrimary: false },
    ],
    price: 2500, originalPrice: 3000, discount: 17,
    stock: 120, inStock: true, rating: 4.6, reviewCount: 41,
    description: "Premium TPU self-healing paint protection film. Resistant to UV yellowing, stone chips, and minor impacts. Professional-grade optical clarity.",
    shortDescription: "TPU self-healing PPF, 4×120 inches, UV resistant, professional grade",
    specifications: [
      { label: "Material", value: "TPU" }, { label: "Size", value: "4 × 120 inches" },
      { label: "Self-Healing", value: "Yes, thermally activated" }, { label: "UV Resistant", value: "Yes" },
      { label: "Thickness", value: "8 mil" },
    ],
    installationAvailable: true, installationPrice: 5000,
    tags: ["ppf", "tpu", "paint protection"],
    isFeatured: true, isNew: false, isBestSeller: false, isFlashSale: false,
    createdAt: "2024-06-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },

  // ─── Exterior / Fog Lamps ─────────────────────────────────────────────────────
  {
    id: "p-010", slug: "honda-civic-fog-lamp-dlaa",
    name: "Honda Civic Front Fog Lamps DLAA - 2016-2021",
    sku: "DLAA-FOG-CIV-16", brand: "DLAA", brandSlug: "dlaa",
    category: "Exterior", categorySlug: "exterior",
    images: [
      { id: "i1", url: img("1544636331-9849c66b2a09"), alt: "Honda Civic fog lamps", isPrimary: true },
      { id: "i2", url: img("1549317661-cf369843efab"), alt: "Fog lamp close up", isPrimary: false },
    ],
    price: 11000, originalPrice: 13500, discount: 19,
    stock: 22, inStock: true, rating: 4.4, reviewCount: 19,
    description: "OEM-style fog lamps for Honda Civic. Chrome ring bezel with integrated LED DRL strip. Direct plug-and-play wiring harness included.",
    shortDescription: "Honda Civic OEM-style fog lamps with LED DRL, chrome bezel, 2016-2021",
    specifications: [
      { label: "Fitment", value: "Honda Civic 2016-2021" }, { label: "Type", value: "LED DRL + Halogen" },
      { label: "Bezel", value: "Chrome" }, { label: "Wiring", value: "Plug & Play" },
    ],
    vehicleCompatibility: [
      { brand: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2021 },
    ],
    installationAvailable: true, installationPrice: 2500,
    tags: ["fog lamp", "honda", "civic", "exterior"],
    isFeatured: false, isNew: false, isBestSeller: false, isFlashSale: false,
    createdAt: "2024-05-20T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
  },

  // ─── Horn ────────────────────────────────────────────────────────────────────
  {
    id: "p-011", slug: "maximus-bmw-sports-horn",
    name: "Maximus BMW Sports Horn - 3500Hz Dual Tone 118dB",
    sku: "MXH-BMW-SPORT", brand: "Maximus", brandSlug: "maximus",
    category: "Utilities", categorySlug: "utilities",
    images: [
      { id: "i1", url: img("1610978960485-2e0e12de39a3"), alt: "BMW sports horn", isPrimary: true },
    ],
    price: 3500, stock: 85, inStock: true, rating: 4.6, reviewCount: 21,
    description: "BMW-style dual-tone sports horn. 3500Hz frequency, 118dB output. Universal fit with direct relay connection. Stainless steel housing, weather resistant.",
    shortDescription: "BMW-style dual tone sports horn, 118dB, 3500Hz, universal fit",
    specifications: [
      { label: "Frequency", value: "3500Hz" }, { label: "Sound Level", value: "118dB" },
      { label: "Voltage", value: "12V DC" }, { label: "Fit", value: "Universal" },
      { label: "Housing", value: "Stainless Steel" },
    ],
    installationAvailable: true, installationPrice: 500,
    tags: ["horn", "sports", "bmw", "utilities"],
    isFeatured: false, isNew: false, isBestSeller: true, isFlashSale: false,
    createdAt: "2023-11-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },

  // ─── Wheels ───────────────────────────────────────────────────────────────────
  {
    id: "p-012", slug: "toyota-corolla-oem-alloy-rim-16",
    name: "Toyota Corolla OEM Alloy Rim 16\" - 2016-2022 (Set of 4)",
    sku: "RIM-COR-16-OEM", brand: "Maximus", brandSlug: "maximus",
    category: "Wheels", categorySlug: "wheels",
    images: [
      { id: "i1", url: img("1603584173870-7a274a4ea6db"), alt: "Alloy rim 16 inch", isPrimary: true },
      { id: "i2", url: img("1558981403-b6bb3f3bb15a"), alt: "Car alloy wheel close up", isPrimary: false },
    ],
    price: 130000, stock: 8, inStock: true, rating: 4.7, reviewCount: 12,
    description: "OEM-style alloy rims for Toyota Corolla. 16-inch diameter, 5x114.3 PCD. Set of 4 rims including center caps and all hardware.",
    shortDescription: "16\" OEM alloy rim set of 4 for Toyota Corolla 2016-2022, 5×114.3 PCD",
    specifications: [
      { label: "Size", value: "16 inches" }, { label: "PCD", value: "5×114.3" },
      { label: "Offset", value: "ET45" }, { label: "Width", value: "6.5J" },
      { label: "Quantity", value: "Set of 4" },
    ],
    vehicleCompatibility: [
      { brand: "Toyota", model: "Corolla", yearFrom: 2016, yearTo: 2022 },
    ],
    installationAvailable: true, installationPrice: 8000,
    tags: ["alloy rim", "wheels", "toyota"],
    isFeatured: true, isNew: false, isBestSeller: false, isFlashSale: false,
    createdAt: "2024-01-10T00:00:00Z", updatedAt: "2026-04-01T00:00:00Z",
  },

  // ─── New Arrivals ─────────────────────────────────────────────────────────────
  {
    id: "p-013", slug: "toyota-revo-dashboard-carpet",
    name: "Toyota Hilux Revo GR Dashboard Carpet Velvet Mat - 2022-2025",
    sku: "DBC-REVO-VLV-22", brand: "Maximus", brandSlug: "maximus",
    category: "Interior", categorySlug: "interior",
    images: [
      { id: "i1", url: img("1545579642-a03437e21ab9"), alt: "Dashboard velvet carpet", isPrimary: true },
    ],
    price: 1500, stock: 60, inStock: true, rating: 4.5, reviewCount: 8,
    description: "Premium velvet dashboard carpet for Toyota Hilux Revo GR. Protects dashboard from heat, UV, and scratches. Anti-slip rubber base with custom cutouts.",
    shortDescription: "Velvet dashboard carpet for Toyota Revo GR 2022-2025, anti-slip base",
    specifications: [
      { label: "Material", value: "Velvet" }, { label: "Color", value: "Black" },
      { label: "Base", value: "Anti-slip Rubber" }, { label: "Fit", value: "Custom Fit" },
    ],
    vehicleCompatibility: [
      { brand: "Toyota", model: "Hilux Revo", yearFrom: 2022, yearTo: 2025 },
    ],
    installationAvailable: false,
    tags: ["dashboard", "carpet", "toyota", "interior"],
    isFeatured: false, isNew: true, isBestSeller: false, isFlashSale: false,
    createdAt: "2026-06-15T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "p-014", slug: "kia-sorento-key-cover-tpu",
    name: "KIA Sorento TPU Key Cover 4 Buttons Black Golden - 2025-2026",
    sku: "KC-SOR-TPU-25", brand: "Maximus", brandSlug: "maximus",
    category: "Key Accessories", categorySlug: "security",
    images: [
      { id: "i1", url: img("1594736797933-d0501ba2fe65"), alt: "KIA key cover TPU", isPrimary: true },
    ],
    price: 800, stock: 150, inStock: true, rating: 4.6, reviewCount: 5,
    description: "TPU soft silicone key cover for KIA Sorento 4-button smart key. Protects against drops, scratches, and dust. Easy push-fit installation.",
    shortDescription: "TPU key cover for KIA Sorento 2025-2026, 4-button, black gold edition",
    specifications: [
      { label: "Material", value: "TPU Soft Silicone" }, { label: "Buttons", value: "4" },
      { label: "Color", value: "Black Golden" }, { label: "Fit", value: "KIA Sorento 2025-2026" },
    ],
    vehicleCompatibility: [
      { brand: "KIA", model: "Sorento", yearFrom: 2025, yearTo: 2026 },
    ],
    installationAvailable: false,
    tags: ["key cover", "kia", "sorento"],
    isFeatured: false, isNew: true, isBestSeller: false, isFlashSale: false,
    createdAt: "2026-07-01T00:00:00Z", updatedAt: "2026-07-13T00:00:00Z",
  },
  {
    id: "p-015", slug: "maximus-coolant-green-1l",
    name: "Maximus ICY Cool Long Life Coolant Green 25% - 1L",
    sku: "MXC-COOL-GRN-1L", brand: "Maximus", brandSlug: "maximus",
    category: "Car Care", categorySlug: "car-care",
    images: [
      { id: "i1", url: img("1600585154340-be6161a56a0c"), alt: "Engine coolant 1L green", isPrimary: true },
    ],
    price: 350, stock: 300, inStock: true, rating: 4.4, reviewCount: 34,
    description: "Long-life engine coolant with anti-corrosion and anti-freeze formula. Green MEG base. Compatible with all petrol, diesel, and hybrid engines.",
    shortDescription: "1L long-life engine coolant, green MEG base, anti-corrosion formula",
    specifications: [
      { label: "Volume", value: "1 Liter" }, { label: "Type", value: "Ethylene Glycol MEG" },
      { label: "Color", value: "Green" }, { label: "Mix Ratio", value: "25% Concentrate" },
    ],
    installationAvailable: false,
    tags: ["coolant", "engine", "car care"],
    isFeatured: false, isNew: false, isBestSeller: true, isFlashSale: false,
    createdAt: "2023-09-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "p-016", slug: "honda-civic-body-kit-2022",
    name: "Honda Civic Front Rear Lip Body Kit - 2022-2025",
    sku: "BK-CIV-22-25", brand: "Maximus", brandSlug: "maximus",
    category: "Modifications", categorySlug: "modifications",
    images: [
      { id: "i1", url: img("1494976388531-d1058494cdd8"), alt: "Honda Civic body kit", isPrimary: true },
      { id: "i2", url: img("1517524008697-84bbe3c3fd98"), alt: "Car front lip spoiler", isPrimary: false },
    ],
    price: 35000, originalPrice: 42000, discount: 17,
    stock: 5, inStock: true, rating: 4.5, reviewCount: 7,
    description: "Complete front and rear lip spoiler body kit for Honda Civic 2022-2025. Lightweight ABS material with OEM-style precision fitment. Ready for paint.",
    shortDescription: "Front+rear lip body kit for Honda Civic 2022-2025, ABS, unpainted",
    specifications: [
      { label: "Material", value: "ABS Plastic" }, { label: "Pieces", value: "2 (Front + Rear Lip)" },
      { label: "Finish", value: "Unpainted – ready for paint" }, { label: "Fitment", value: "Honda Civic 2022-2025" },
    ],
    vehicleCompatibility: [
      { brand: "Honda", model: "Civic", yearFrom: 2022, yearTo: 2025 },
    ],
    installationAvailable: true, installationPrice: 5000,
    tags: ["body kit", "honda", "civic", "modification"],
    isFeatured: true, isNew: false, isBestSeller: false, isFlashSale: false,
    createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z",
  },
];

export const featuredProducts = products.filter(p => p.isFeatured);
export const flashSaleProducts = products.filter(p => p.isFlashSale);
export const bestSellers = products.filter(p => p.isBestSeller);
export const newArrivals = products.filter(p => p.isNew);
export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductsByCategory = (categorySlug: string) => products.filter(p => p.categorySlug === categorySlug);
