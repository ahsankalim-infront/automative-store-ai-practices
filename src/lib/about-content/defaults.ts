import type { AboutSectionConfig, AboutTeamMember, AboutMilestone } from "@/types";

export const DEFAULT_ABOUT_JOURNEY_SECTION: AboutSectionConfig = {
  id: "about-journey-section-1",
  eyebrow: "Our Journey",
  title: "Our Journey",
  subtitle: "Growing with trust — premium poshish and seat covers in Lahore.",
  isEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ABOUT_LEADERSHIP_SECTION: AboutSectionConfig = {
  id: "about-leadership-section-1",
  eyebrow: "The People",
  title: "Meet Our Leadership",
  subtitle:
    "A dedicated team focused on poshish quality, customer care, and expert vehicle interior work.",
  isEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_ABOUT_TEAM: AboutTeamMember[] = [
  {
    id: "team-1",
    name: "Shahzad Ahmed",
    role: "Founder & Director",
    bio: "Poshish & upholstery specialist",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "team-2",
    name: "Muhammad Azaan",
    role: "Operations Manager",
    bio: "Customer orders & fittings",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
    sortOrder: 1,
    isActive: true,
  },
];

export const DEFAULT_ABOUT_MILESTONES: AboutMilestone[] = [
  {
    id: "milestone-1",
    year: "2014",
    title: "Founded in Lahore",
    description:
      "Shahzad Poshish House began as a specialist car poshish and seat cover workshop on Abbot Road, Lahore.",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "milestone-2",
    year: "2017",
    title: "Moeen Center Office",
    description:
      "Moved to Office # 15, 2nd Floor, Moeen Center — a dedicated space for consultations, fittings, and customer service.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "milestone-3",
    year: "2020",
    title: "Online Catalog",
    description:
      "Launched our product catalog online so customers can browse seat covers, poshish materials, and place orders from home.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "milestone-4",
    year: "2024",
    title: "Expanded Range",
    description:
      "Added interior accessories, custom upholstery options, and professional fitting services under one roof.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "milestone-5",
    year: "2026",
    title: "Growing with Trust",
    description:
      "Serving thousands of customers across Lahore and Pakistan with premium poshish, honest pricing, and expert fitting.",
    sortOrder: 4,
    isActive: true,
  },
];
