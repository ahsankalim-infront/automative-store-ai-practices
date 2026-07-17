import type { BrandConfig } from "./types";
import type { StoreSettings } from "@/lib/data/repositories";

export const DEFAULT_BRAND: BrandConfig = {
  name: "Shahzad Poshish House",
  shortName: "SPH",
  tagline: "Premium car poshish & upholstery",
  description:
    "Shahzad Poshish House offers premium car poshish, seat covers, interior upholstery and automotive accessories in Lahore.",
  email: "shahzadahmed6626@gmail.com",
  address: {
    full: "Office # 15, 2nd Floor, Moeen Center, 20 Abbot Road, Lahore",
    city: "Lahore",
    province: "Punjab",
    country: "Pakistan",
  },
  contacts: [
    {
      name: "Shahzad Ahmed",
      phones: ["03224123414", "033014140440"],
    },
    {
      name: "Muhammad Azaan",
      phones: ["03259422044"],
    },
  ],
  primaryPhone: "03224123414",
  whatsapp: "923224123414",
  orderPrefix: "SHP",
  businessHours: "Monday – Saturday: 10:00 AM – 8:00 PM",
  announcementText: "Premium poshish & seat covers",
};

/** @deprecated Use getBrandConfig() or useBrand() for runtime values */
export const BRAND = DEFAULT_BRAND;

export function storeSettingsToBrand(settings: StoreSettings): BrandConfig {
  const contacts =
    settings.contactPersons?.length > 0
      ? settings.contactPersons
      : DEFAULT_BRAND.contacts;

  return {
    name: settings.storeName || DEFAULT_BRAND.name,
    shortName: settings.shortName || DEFAULT_BRAND.shortName,
    tagline: settings.tagline || DEFAULT_BRAND.tagline,
    description: settings.description || DEFAULT_BRAND.description,
    email: settings.supportEmail || DEFAULT_BRAND.email,
    address: {
      full: settings.address || DEFAULT_BRAND.address.full,
      city: settings.addressCity || DEFAULT_BRAND.address.city,
      province: settings.addressProvince || DEFAULT_BRAND.address.province,
      country: settings.addressCountry || DEFAULT_BRAND.address.country,
    },
    contacts,
    primaryPhone: settings.supportPhone || DEFAULT_BRAND.primaryPhone,
    whatsapp: settings.whatsapp || DEFAULT_BRAND.whatsapp,
    orderPrefix: settings.orderPrefix || DEFAULT_BRAND.orderPrefix,
    businessHours: settings.businessHours || DEFAULT_BRAND.businessHours,
    announcementText: settings.announcementText || DEFAULT_BRAND.announcementText,
  };
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return phone;
}

export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("92") ? `tel:+${digits}` : `tel:+92${digits.replace(/^0/, "")}`;
}

export function whatsappHref(phone = DEFAULT_BRAND.whatsapp): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
