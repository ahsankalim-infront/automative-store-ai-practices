import { getSeoConfig } from "@/lib/seo/config";
import { absUrl } from "@/lib/seo/metadata";
import { BRAND } from "@/lib/brand/config";

export async function JsonLdOrganization() {
  const config = await getSeoConfig();
  const g = config.global;

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: g.organizationName || g.siteName,
    description: g.defaultDescription,
    url: absUrl("/"),
    telephone: BRAND.primaryPhone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.address.full,
      addressLocality: BRAND.address.city,
      addressRegion: BRAND.address.province,
      addressCountry: BRAND.address.country,
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
