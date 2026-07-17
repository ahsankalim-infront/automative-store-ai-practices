export interface BrandContact {
  name: string;
  phones: string[];
}

export interface BrandAddress {
  full: string;
  city: string;
  province: string;
  country: string;
}

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  email: string;
  address: BrandAddress;
  contacts: BrandContact[];
  primaryPhone: string;
  whatsapp: string;
  orderPrefix: string;
  businessHours: string;
  announcementText: string;
}

export interface StoreContactPerson {
  name: string;
  phones: string[];
}
