"use client";

import { motion } from "framer-motion";
import type { PolicySection } from "@/lib/help/content";

export function PolicySections({ sections }: { sections: PolicySection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section, i) => (
        <motion.section
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          className="bg-card rounded-2xl border border-border p-6 sm:p-8 scroll-mt-28"
        >
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-black">
              {i + 1}
            </span>
            {section.title}
          </h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 space-y-1.5">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {section.note && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mt-2">
                <p className="text-sm font-semibold text-primary">Please note</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{section.note}</p>
              </div>
            )}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
