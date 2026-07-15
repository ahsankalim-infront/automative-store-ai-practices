"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const reviews = [
  { id: 1, name: "Ahmed Khan", city: "Lahore", rating: 5, text: "Ordered Android panel for my Corolla. Fitted perfectly and the quality is excellent. Installation team was very professional. Highly recommended!", product: "Android Panel Toyota Corolla", initials: "AK", color: "bg-red-500" },
  { id: 2, name: "Sara Malik", city: "Karachi", rating: 5, text: "Got PPF done on my Civic from the Karachi branch. Absolutely stunning work. The dustfree studio makes a huge difference. Worth every rupee!", product: "PPF Service - Honda Civic", initials: "SM", color: "bg-blue-500" },
  { id: 3, name: "Usman Raza", city: "Islamabad", rating: 5, text: "Seat covers are premium quality. Stitching is perfect and the leather feels genuine. Delivered within 2 days. Will definitely order again.", product: "Premium PU Leather Seat Covers", initials: "UR", color: "bg-emerald-500" },
  { id: 4, name: "Fatima Ahmed", city: "Faisalabad", rating: 5, text: "The LED headlights are insanely bright. No flicker, no canbus errors. Installation guide was very helpful. Night driving is now a totally different experience.", product: "Maximus Sirius LED H4 85W", initials: "FA", color: "bg-purple-500" },
  { id: 5, name: "Ali Hassan", city: "Multan", rating: 5, text: "Ceramic coating done on my Fortuner. Car looks brand new. The hydrophobic effect is real — water literally beads off. Service team was super knowledgeable.", product: "Ceramic Coating Service", initials: "AH", color: "bg-orange-500" },
  { id: 6, name: "Zainab Mirza", city: "Lahore", rating: 5, text: "5D floor mats for Toyota Prado. Custom fit, thick, and luxury finish. Better than what dealers offer. Great packaging and fast delivery!", product: "Toyota Prado 5D Floor Mats", initials: "ZM", color: "bg-pink-500" },
];

export function CustomerReviews() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Testimonials"
          title="What Our Customers Say"
          subtitle="Trusted by 20,000+ satisfied customers across Pakistan"
          centered
          className="text-center"
        />

        {/* Trust Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {[
            { value: "4.7/5", label: "Average Rating" },
            { value: "20,000+", label: "Verified Reviews" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "18+", label: "Cities Served" },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-primary">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-gray-100 dark:text-gray-800" />
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-full ${review.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {review.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.city}</p>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">&ldquo;{review.text}&rdquo;</p>
              <div className="text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-full inline-block">
                {review.product}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
