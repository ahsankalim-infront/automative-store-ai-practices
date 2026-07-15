export const BRAND = {
  name: "Shahzad Poshish House",
  shortName: "SPH",
  tagline: "Premium car poshish, seat covers & upholstery",
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
  /** Primary phone for header / quick links */
  primaryPhone: "03224123414",
  whatsapp: "923224123414",
  orderPrefix: "SHP",
  businessHours: "Monday – Saturday: 10:00 AM – 8:00 PM",
} as const;

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

export function whatsappHref(phone = BRAND.whatsapp): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
