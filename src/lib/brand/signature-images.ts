/** Curated Unsplash photos that match each signature product line */

const u = (id: string, w = 900, h = 700) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`;

export const SIGNATURE_IMAGES = {
  /** Quilted premium leather car seats — custom seat covers */
  seatCovers: u("1760161339261-56487b766a17", 900, 700),
  /** Car fully covered in protective sheet — outdoor top cover */
  topCover: u("1542317048-7a6ce1a438c8", 900, 700),
  /** Multiple vehicles with fitted covers — premium top cover line */
  topCoverPremium: u("1546411649-b27262a68b4e", 900, 700),
  /** Close-up of textured rubber car floor mat */
  floorMatting: u("1761846786526-706cf7015afb", 900, 700),
} as const;

/** Smaller crops for promo cards */
export const SIGNATURE_IMAGES_PROMO = {
  seatCovers: u("1760161339261-56487b766a17", 600, 400),
  topCover: u("1542317048-7a6ce1a438c8", 600, 400),
  floorMatting: u("1761846786526-706cf7015afb", 600, 400),
} as const;

/** Square crops for hero / product panels */
export const SIGNATURE_IMAGES_HERO = {
  seatCovers: u("1760161339261-56487b766a17", 600, 600),
  topCover: u("1542317048-7a6ce1a438c8", 600, 600),
  floorMatting: u("1761846786526-706cf7015afb", 600, 600),
  topCoverPremium: u("1546411649-b27262a68b4e", 600, 600),
} as const;

/** Category grid thumbnails */
export const SIGNATURE_IMAGES_CATEGORY = {
  seatCovers: u("1760161339261-56487b766a17", 300, 200),
  topCover: u("1542317048-7a6ce1a438c8", 300, 200),
  floorMatting: u("1761846786526-706cf7015afb", 300, 200),
} as const;

/** Product listing primary images */
export const SIGNATURE_IMAGES_PRODUCT = {
  seatCovers: u("1760161339261-56487b766a17", 600, 600),
  seatCoversAlt: u("1605437241278-c806d14a4d9", 600, 600),
  topCover: u("1542317048-7a6ce1a438c8", 600, 600),
  topCoverAlt: u("1759822601895-0448963d699f", 600, 600),
  topCoverPremium: u("1546411649-b27262a68b4e", 600, 600),
  floorMatting: u("1761846786526-706cf7015afb", 600, 600),
  floorMattingAlt: u("1605437241278-c806d14a4d9", 600, 600),
} as const;
