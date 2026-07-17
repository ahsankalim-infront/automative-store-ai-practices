"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ChevronRight, ArrowUp, Shield, Phone, Mail } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useBrand } from "@/lib/brand/brand-context";
import { formatPhoneDisplay, phoneTelHref } from "@/lib/brand/config";

const sections = [
  { id: "acceptance",      title: "1. Acceptance of Terms" },
  { id: "eligibility",     title: "2. Eligibility" },
  { id: "account",         title: "3. Account Registration" },
  { id: "products",        title: "4. Products & Pricing" },
  { id: "orders",          title: "5. Orders & Payment" },
  { id: "shipping",        title: "6. Shipping & Delivery" },
  { id: "returns",         title: "7. Returns & Refunds" },
  { id: "warranty",        title: "8. Warranty Policy" },
  { id: "installation",    title: "9. Installation Services" },
  { id: "privacy",         title: "10. Privacy & Data" },
  { id: "ip",              title: "11. Intellectual Property" },
  { id: "liability",       title: "12. Limitation of Liability" },
  { id: "governing",       title: "13. Governing Law" },
  { id: "changes",         title: "14. Changes to Terms" },
  { id: "contact",         title: "15. Contact Us" },
];

export default function TermsPage() {
  const brand = useBrand();
  const [activeSection, setActiveSection] = useState("acceptance");
  const [showTop, setShowTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-secondary via-gray-900 to-secondary border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-12 sm:py-16">
          <Breadcrumb items={[{ label: "Terms & Conditions" }]} className="mb-6 [&_*]:text-gray-400 [&_a:hover]:text-white" />
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Terms & Conditions</h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl">
                Please read these terms carefully before using Shahzad Poshish House's website or services.
                By accessing our platform, you agree to be bound by these terms.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                <span>Last updated: <strong className="text-gray-300">July 13, 2026</strong></span>
                <span>Effective: <strong className="text-gray-300">January 1, 2024</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="flex gap-8 items-start">

          {/* ── Sidebar TOC ── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-border">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contents</p>
              </div>
              <nav className="p-2 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {sections.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all group ${
                      activeSection === s.id
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-secondary dark:hover:text-white"
                    }`}
                  >
                    <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${activeSection === s.id ? "text-primary" : "opacity-0 group-hover:opacity-100"}`} />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Need Help?
              </p>
              <p className="text-xs text-gray-500 mb-3">Have questions about our terms?</p>
              <Link href="/contact" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                Contact our team <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div ref={contentRef} className="flex-1 min-w-0 space-y-10">

            {/* Quick nav for mobile */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2 pb-2 w-max">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    className="shrink-0 px-3 py-1.5 rounded-full text-xs border border-border bg-card text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors whitespace-nowrap">
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                id: "acceptance", title: "1. Acceptance of Terms",
                content: (
                  <>
                    <p>By accessing or using the Shahzad Poshish House website (<strong>our website</strong>), mobile application, or any related services (collectively, the "Platform"), you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.</p>
                    <p>If you do not agree to these terms, please do not use our Platform. These terms apply to all visitors, users, and customers who access or use our services.</p>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-4">
                      <p className="text-sm font-semibold text-primary">Important Note</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">These Terms constitute a legally binding agreement between you and Shahzad Poshish House. Please read them carefully.</p>
                    </div>
                  </>
                ),
              },
              {
                id: "eligibility", title: "2. Eligibility",
                content: (
                  <>
                    <p>To use our Platform, you must be at least <strong>18 years of age</strong> or the legal age of majority in your jurisdiction. By using our services, you represent and warrant that:</p>
                    <ul>
                      <li>You are at least 18 years of age</li>
                      <li>You have the legal capacity to enter into a binding agreement</li>
                      <li>You are not barred from receiving services under applicable law</li>
                      <li>You will use the Platform in accordance with these Terms</li>
                    </ul>
                    <p>We reserve the right to terminate accounts or refuse service to anyone we believe is in violation of our policies.</p>
                  </>
                ),
              },
              {
                id: "account", title: "3. Account Registration",
                content: (
                  <>
                    <p>When you create an account on Shahzad Poshish House, you agree to provide accurate, current, and complete information. You are responsible for:</p>
                    <ul>
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying us immediately of any unauthorized use of your account</li>
                      <li>Ensuring your contact information remains up to date</li>
                    </ul>
                    <p>Shahzad Poshish House reserves the right to terminate accounts that violate our terms, contain false information, or are found to be involved in fraudulent activity.</p>
                  </>
                ),
              },
              {
                id: "products", title: "4. Products & Pricing",
                content: (
                  <>
                    <p>All prices displayed on Shahzad Poshish House are in <strong>Pakistani Rupees (PKR)</strong> and are inclusive of applicable taxes unless stated otherwise. We reserve the right to:</p>
                    <ul>
                      <li>Modify prices at any time without prior notice</li>
                      <li>Discontinue or modify products at our discretion</li>
                      <li>Limit quantities available for purchase</li>
                      <li>Refuse or cancel orders if pricing errors occur</li>
                    </ul>
                    <p>Product images are for illustrative purposes only. Actual product color, packaging, and dimensions may vary slightly from what is displayed online. We make every effort to display product colors and images accurately, however we cannot guarantee your monitor's display will be accurate.</p>
                    <p>We strive to ensure all product descriptions are accurate. However, we do not warrant that descriptions, images, specifications, pricing, or other content is error-free, complete, or current.</p>
                  </>
                ),
              },
              {
                id: "orders", title: "5. Orders & Payment",
                content: (
                  <>
                    <p>When you place an order, you are making an offer to purchase the selected products. Order acceptance and completion of a contract between you and Shahzad Poshish House will only occur when we dispatch the product(s) to you.</p>
                    <p><strong>Payment Methods accepted:</strong></p>
                    <ul>
                      <li><strong>Cash on Delivery (COD)</strong> — Available in major cities across Pakistan</li>
                      <li><strong>Credit / Debit Card</strong> — Visa, Mastercard, and other major cards</li>
                      <li><strong>Bank Transfer</strong> — Direct bank transfer to our designated account</li>
                      <li><strong>Digital Wallets</strong> — JazzCash, EasyPaisa, and other approved wallets</li>
                    </ul>
                    <p>Shahzad Poshish House reserves the right to cancel any order for any reason, including but not limited to product unavailability, pricing errors, or suspected fraudulent activity. You will be notified and a full refund will be processed if your order is cancelled.</p>
                  </>
                ),
              },
              {
                id: "shipping", title: "6. Shipping & Delivery",
                content: (
                  <>
                    <p>We offer nationwide delivery across Pakistan. Delivery timelines are estimates and are subject to change based on:</p>
                    <ul>
                      <li>Product availability and stock status</li>
                      <li>Delivery location (city vs. remote areas)</li>
                      <li>Courier partner capacity and public holidays</li>
                    </ul>
                    <p><strong>Standard delivery timelines:</strong></p>
                    <ul>
                      <li>Major cities (Lahore, Karachi, Islamabad): 1–3 business days</li>
                      <li>Other cities: 3–5 business days</li>
                      <li>Remote areas: 5–10 business days</li>
                    </ul>
                    <p><strong>Free shipping</strong> is offered on all orders above <strong>Rs. 1,500</strong>. For orders below this threshold, a standard shipping fee of Rs. 250 applies. Risk of loss and title for products passes to you upon delivery.</p>
                    <p>Shahzad Poshish House is not responsible for delays caused by courier services, natural disasters, or other circumstances beyond our control.</p>
                  </>
                ),
              },
              {
                id: "returns", title: "7. Returns & Refunds",
                content: (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
                      <p className="text-sm font-bold text-green-700 dark:text-green-400">7-Day Return Policy</p>
                      <p className="text-sm text-green-600 dark:text-green-500 mt-1">We accept returns within 7 days of delivery for eligible products.</p>
                    </div>
                    <p>To be eligible for a return, items must be:</p>
                    <ul>
                      <li>Unused and in original condition</li>
                      <li>In original packaging with all accessories and tags</li>
                      <li>Returned within 7 days of the delivery date</li>
                      <li>Accompanied by proof of purchase (order number or receipt)</li>
                    </ul>
                    <p><strong>Non-returnable items include:</strong></p>
                    <ul>
                      <li>Products that have been installed or used</li>
                      <li>Customized or personalized items</li>
                      <li>Consumables (lubricants, cleaning products) once opened</li>
                      <li>Electrical items once used or installed</li>
                      <li>Items damaged due to misuse or improper installation</li>
                    </ul>
                    <p>Refunds will be processed within <strong>5–7 business days</strong> after we receive and inspect the returned item. Refunds will be credited to the original payment method used.</p>
                  </>
                ),
              },
              {
                id: "warranty", title: "8. Warranty Policy",
                content: (
                  <>
                    <p>Products sold on Shahzad Poshish House may come with a manufacturer's warranty. Warranty terms vary by brand and product category:</p>
                    <ul>
                      <li><strong>Maximus branded products</strong>: 1-year limited warranty</li>
                      <li><strong>Third-party brands</strong>: As per manufacturer's warranty</li>
                      <li><strong>PPF / Ceramic Coating services</strong>: As specified in the service agreement</li>
                      <li><strong>Installation services</strong>: 30-day workmanship warranty</li>
                    </ul>
                    <p>Warranty does not cover damage caused by improper installation (if self-installed), misuse, accidents, or modifications not authorized by Shahzad Poshish House. Warranty claims must be submitted with proof of purchase and relevant documentation.</p>
                  </>
                ),
              },
              {
                id: "installation", title: "9. Installation Services",
                content: (
                  <>
                    <p>Shahzad Poshish House offers professional installation services for compatible products through our network of certified technicians and service centers. By booking an installation service, you agree to:</p>
                    <ul>
                      <li>Provide the vehicle for inspection at the agreed time and location</li>
                      <li>Ensure the vehicle is in a roadworthy condition</li>
                      <li>Not hold Shahzad Poshish House liable for pre-existing vehicle issues discovered during installation</li>
                      <li>Follow post-installation care instructions provided by our technicians</li>
                    </ul>
                    <p>Shahzad Poshish House reserves the right to decline installation if the vehicle is found to be unsuitable or if safety concerns are identified. Installation times are estimates and may vary.</p>
                    <p>A <strong>30-day workmanship warranty</strong> covers all installation services. This does not extend to the product itself, which carries its own manufacturer warranty.</p>
                  </>
                ),
              },
              {
                id: "privacy", title: "10. Privacy & Data",
                content: (
                  <>
                    <p>Your use of Shahzad Poshish House's Platform is also governed by our <strong>Privacy Policy</strong>, which is incorporated into these Terms by reference. By using our Platform, you consent to:</p>
                    <ul>
                      <li>Collection and processing of personal data as described in our Privacy Policy</li>
                      <li>Use of cookies and tracking technologies to improve your experience</li>
                      <li>Receipt of transactional and promotional communications (you may opt out of marketing)</li>
                      <li>Sharing of data with our logistics and payment partners as necessary to fulfill orders</li>
                    </ul>
                    <p>We are committed to protecting your personal information and comply with all applicable data protection regulations in Pakistan. We do not sell your personal data to third parties.</p>
                  </>
                ),
              },
              {
                id: "ip", title: "11. Intellectual Property",
                content: (
                  <>
                    <p>All content on the Shahzad Poshish House Platform — including but not limited to text, graphics, logos, images, product descriptions, icons, and software — is the exclusive property of Shahzad Poshish House or its content suppliers and is protected by applicable intellectual property laws.</p>
                    <p>You may not:</p>
                    <ul>
                      <li>Reproduce, duplicate, copy, or exploit any content for commercial purposes without our written consent</li>
                      <li>Use our trademarks or branding without prior written permission</li>
                      <li>Scrape or data-mine our Platform using automated tools</li>
                      <li>Reverse engineer any software or technology used on our Platform</li>
                    </ul>
                  </>
                ),
              },
              {
                id: "liability", title: "12. Limitation of Liability",
                content: (
                  <>
                    <p>To the fullest extent permitted by applicable law, Shahzad Poshish House shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:</p>
                    <ul>
                      <li>Loss of profits or revenue</li>
                      <li>Loss of data or business information</li>
                      <li>Damage to your vehicle not directly caused by our proven negligence</li>
                      <li>Service interruptions or Platform downtime</li>
                    </ul>
                    <p>In no event shall our total liability to you exceed the amount paid by you for the specific product or service giving rise to the claim. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above limitations may not apply to you.</p>
                  </>
                ),
              },
              {
                id: "governing", title: "13. Governing Law",
                content: (
                  <>
                    <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of <strong>Pakistan</strong>, without regard to its conflict of law provisions.</p>
                    <p>Any disputes arising from or relating to these Terms or your use of Shahzad Poshish House's Platform shall be subject to the exclusive jurisdiction of the courts located in <strong>Lahore, Punjab, Pakistan</strong>.</p>
                    <p>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.</p>
                  </>
                ),
              },
              {
                id: "changes", title: "14. Changes to Terms",
                content: (
                  <>
                    <p>Shahzad Poshish House reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our Platform. We will notify you of significant changes via:</p>
                    <ul>
                      <li>A notice on our homepage</li>
                      <li>An email to your registered email address</li>
                      <li>An in-app notification if you use our mobile app</li>
                    </ul>
                    <p>Your continued use of the Platform after any changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically. The "Last Updated" date at the top of this page indicates when these Terms were last revised.</p>
                  </>
                ),
              },
              {
                id: "contact", title: "15. Contact Us",
                content: (
                  <>
                    <p>If you have any questions, concerns, or complaints regarding these Terms and Conditions, please contact us through any of the following channels:</p>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      {[
                        { icon: Phone, label: "Phone / WhatsApp", value: formatPhoneDisplay(brand.primaryPhone), href: phoneTelHref(brand.primaryPhone) },
                        { icon: Mail, label: "Email", value: brand.email, href: `mailto:${brand.email}` },
                      ].map(({ icon: Icon, label, value, href }) => (
                        <a key={label} href={href} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-border hover:border-primary/40 transition-colors group">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">{label}</p>
                            <p className="text-sm font-semibold text-foreground">{value}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">Our customer service team is available {brand.businessHours || "Monday to Saturday, 10:00 AM – 8:00 PM PKT"}.</p>
                  </>
                ),
              },
            ].map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="bg-card rounded-2xl border border-border p-6 sm:p-8 scroll-mt-28"
              >
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary text-xs font-black">{i + 1}</span>
                  </span>
                  {section.title.replace(/^\d+\.\s/, "")}
                </h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-3
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-gray-600 dark:[&_li]:text-gray-300
                  [&_strong]:text-secondary dark:[&_strong]:text-white [&_p]:text-gray-600 dark:[&_p]:text-gray-300">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full bg-primary shadow-xl flex items-center justify-center text-white hover:bg-primary-dark transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
}
