export type { BrandConfig, BrandContact, BrandAddress, StoreContactPerson } from "./types";
export {
  DEFAULT_BRAND,
  storeSettingsToBrand,
  formatPhoneDisplay,
  phoneTelHref,
  whatsappHref,
} from "./config";
export { getBrandConfig, revalidateStoreSettings } from "./get-brand-config";
export { BrandProvider, useBrand } from "./brand-context";
