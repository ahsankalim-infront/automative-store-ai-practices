import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Truck, RotateCcw, CreditCard, Headphones, Share2, Heart, Video, Play } from "lucide-react";
import { BrandLogo } from "@/components/brand/logo";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import { getCategories } from "@/lib/data/repositories";
import { formatPhoneDisplay, phoneTelHref, whatsappHref } from "@/lib/brand/config";

const footerLinks = {
  services: [
    { label: "Custom Poshish", href: "/services" },
    { label: "Seat Cover Fitting", href: "/services#installation" },
    { label: "Interior Upholstery", href: "/services" },
    { label: "Book a Service", href: "/services/book" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Store Locator", href: "/store-locator" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ],
  help: [
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Shipping Policy", href: "/shipping" },
  ],
};

const trustBadges = (city: string, country: string) => [
  { icon: Truck, label: "Nationwide Delivery", sub: `${city} & across ${country}` },
  { icon: RotateCcw, label: "Quality Guarantee", sub: "Premium poshish materials" },
  { icon: CreditCard, label: "Secure Payment", sub: "COD · Card · Transfer" },
  { icon: Headphones, label: "Expert Support", sub: "Call · WhatsApp · Email" },
];

export async function Footer() {
  const [brand, categories] = await Promise.all([getBrandConfig(), getCategories()]);
  const shopLinks = [
    ...categories.slice(0, 5).map((cat) => ({
      label: cat.name,
      href: `/products?category=${cat.slug}`,
    })),
    { label: "All Products", href: "/products" },
  ];
  const badges = trustBadges(brand.address.city, brand.address.country);

  return (
    <footer className="bg-secondary text-white mt-10 sm:mt-20">
      <div className="border-b border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {badges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <BrandLogo size="lg" textClassName="[&_p:first-child]:text-white" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-sm">
              {brand.description}
            </p>
            <div className="space-y-2.5 text-sm text-gray-400">
              {brand.contacts.map((person) => (
                <div key={person.name}>
                  <p className="text-white font-medium text-xs mb-0.5">{person.name}</p>
                  {person.phones.map((phone) => (
                    <a
                      key={phone}
                      href={phoneTelHref(phone)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {formatPhoneDisplay(phone)}
                    </a>
                  ))}
                </div>
              ))}
              <a href={`mailto:${brand.email}`} className="flex items-center gap-2 hover:text-primary transition-colors pt-1">
                <Mail className="h-4 w-4 shrink-0" /> {brand.email}
              </a>
              <span className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug break-words">{brand.address.full}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              {[
                { icon: Share2, href: "#", label: "Facebook" },
                { icon: Heart, href: "#", label: "Instagram" },
                { icon: Play, href: "#", label: "YouTube" },
                { icon: MessageCircle, href: whatsappHref(brand.whatsapp), label: "WhatsApp" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-10 w-10 sm:h-8 sm:w-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Shop", links: shopLinks },
            { title: "Services", links: footerLinks.services },
            { title: "Company", links: footerLinks.company },
            { title: "Help", links: footerLinks.help },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1 group">
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-base font-bold text-white mb-1">Subscribe for offers & new arrivals</h4>
              <p className="text-sm text-gray-400">Poshish deals, seat cover launches, and seasonal promotions.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:max-w-md lg:max-w-sm lg:ml-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p className="text-center">{brand.address.city} · {brand.businessHours}</p>
        </div>
      </div>
    </footer>
  );
}
