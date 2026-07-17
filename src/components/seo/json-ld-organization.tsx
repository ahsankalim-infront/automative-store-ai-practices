import { getSeoConfig } from "@/lib/seo/config";
import { absUrl } from "@/lib/seo/metadata";
import { getBrandConfig } from "@/lib/brand/get-brand-config";

export async function JsonLdOrganization() {
  const [config, brand] = await Promise.all([getSeoConfig(), getBrandConfig()]);
  const g = config.global;

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: g.organizationName || g.siteName,
    description: g.defaultDescription,
    url: absUrl("/"),
    telephone: brand.primaryPhone,
    email: brand.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.full,
      addressLocality: brand.address.city,
      addressRegion: brand.address.province,
      addressCountry: brand.address.country,
    },
    ...(g.organizationLogo ? { logo: absUrl(g.organizationLogo) } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
