"use client";

import { useEffect, useState } from "react";
import { Save, Users, Milestone } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminCrudPanel } from "@/components/admin/admin-crud-panel";
import { getEntityConfig } from "@/lib/admin/entity-configs";
import { api } from "@/lib/api/client";
import type { AboutSectionConfig } from "@/types";

function SectionHeaderForm({
  title,
  section,
  loading,
  saving,
  onChange,
  onSave,
}: {
  title: string;
  section: AboutSectionConfig | null;
  loading: boolean;
  saving: boolean;
  onChange: (section: AboutSectionConfig) => void;
  onSave: () => void;
}) {
  if (loading || !section) {
    return <p className="text-sm text-gray-500">Loading section settings...</p>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-gray-500 mb-1.5 block">Show on About page</span>
        <input
          type="checkbox"
          checked={section.isEnabled}
          onChange={(e) => onChange({ ...section, isEnabled: e.target.checked })}
          className="h-4 w-4 rounded border-border text-primary"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 mb-1.5 block">Eyebrow Label</span>
        <input
          value={section.eyebrow}
          onChange={(e) => onChange({ ...section, eyebrow: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
          placeholder="The People"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-gray-500 mb-1.5 block">Section Title</span>
        <input
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
          placeholder="Meet Our Leadership"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-gray-500 mb-1.5 block">Subtitle / Description</span>
        <textarea
          rows={2}
          value={section.subtitle}
          onChange={(e) => onChange({ ...section, subtitle: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-card"
        />
      </label>
      <div className="sm:col-span-2">
        <Button onClick={onSave} loading={saving} leftIcon={<Save className="h-4 w-4" />}>
          Save {title} Header
        </Button>
      </div>
    </div>
  );
}

export function AdminAboutContentPage() {
  const teamConfig = getEntityConfig("aboutTeam");
  const milestonesConfig = getEntityConfig("aboutMilestones");

  const [journeySection, setJourneySection] = useState<AboutSectionConfig | null>(null);
  const [leadershipSection, setLeadershipSection] = useState<AboutSectionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingJourney, setSavingJourney] = useState(false);
  const [savingLeadership, setSavingLeadership] = useState(false);

  useEffect(() => {
    Promise.all([
      api.adminGetAboutJourneySection(),
      api.adminGetAboutLeadershipSection(),
    ]).then(([journeyRes, leadershipRes]) => {
      if (journeyRes.success && journeyRes.data) {
        setJourneySection(journeyRes.data as AboutSectionConfig);
      }
      if (leadershipRes.success && leadershipRes.data) {
        setLeadershipSection(leadershipRes.data as AboutSectionConfig);
      }
      setLoading(false);
    });
  }, []);

  const handleSaveJourney = async () => {
    if (!journeySection) return;
    setSavingJourney(true);
    const res = await api.adminUpdateAboutJourneySection(journeySection);
    if (res.success) toast.success("Journey section saved");
    else toast.error(res.error || "Save failed");
    setSavingJourney(false);
  };

  const handleSaveLeadership = async () => {
    if (!leadershipSection) return;
    setSavingLeadership(true);
    const res = await api.adminUpdateAboutLeadershipSection(leadershipSection);
    if (res.success) toast.success("Leadership section saved");
    else toast.error(res.error || "Save failed");
    setSavingLeadership(false);
  };

  if (!teamConfig || !milestonesConfig) {
    return <p className="text-red-500">About content config missing</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          About Page Content
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the Our Journey timeline and Meet Our Leadership team on the About page.
        </p>
      </div>

      <Card padding="md">
        <h2 className="font-bold text-foreground mb-1 flex items-center gap-2">
          <Milestone className="h-4 w-4 text-primary" />
          Our Journey — Section Header
        </h2>
        <p className="text-xs text-gray-500 mb-4">Eyebrow, title, and subtitle above the timeline.</p>
        <SectionHeaderForm
          title="Journey"
          section={journeySection}
          loading={loading}
          saving={savingJourney}
          onChange={setJourneySection}
          onSave={handleSaveJourney}
        />
      </Card>

      <AdminCrudPanel config={milestonesConfig} />

      <Card padding="md">
        <h2 className="font-bold text-foreground mb-1 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Meet Our Leadership — Section Header
        </h2>
        <p className="text-xs text-gray-500 mb-4">Eyebrow, title, and subtitle above the team grid.</p>
        <SectionHeaderForm
          title="Leadership"
          section={leadershipSection}
          loading={loading}
          saving={savingLeadership}
          onChange={setLeadershipSection}
          onSave={handleSaveLeadership}
        />
      </Card>

      <AdminCrudPanel config={teamConfig} />
    </div>
  );
}
