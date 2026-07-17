import {
  getAboutJourneySection,
  getAboutLeadershipSection,
} from "./config";
import {
  getAboutTeamMembers,
  getAboutMilestones,
} from "@/lib/data/repositories";
import type { AboutPageContent } from "@/types";

export async function getAboutPageContent(): Promise<AboutPageContent> {
  const [journeySection, leadershipSection, team, milestones] = await Promise.all([
    getAboutJourneySection(),
    getAboutLeadershipSection(),
    getAboutTeamMembers(),
    getAboutMilestones(),
  ]);

  return { journeySection, leadershipSection, team, milestones };
}

export {
  getAboutJourneySection,
  getAboutLeadershipSection,
  updateAboutJourneySection,
  updateAboutLeadershipSection,
} from "./config";

export {
  DEFAULT_ABOUT_JOURNEY_SECTION,
  DEFAULT_ABOUT_LEADERSHIP_SECTION,
  DEFAULT_ABOUT_TEAM,
  DEFAULT_ABOUT_MILESTONES,
} from "./defaults";
