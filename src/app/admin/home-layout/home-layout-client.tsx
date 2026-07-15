"use client";

import { useState, useEffect } from "react";
import { Save, LayoutTemplate, Smartphone, Monitor, ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import {
  DEFAULT_HOME_LAYOUT,
  HOME_SECTION_LABELS,
} from "@/lib/home-layout/defaults";
import type { HomeLayoutConfig, HomeSectionConfig } from "@/lib/home-layout/types";
import toast from "react-hot-toast";

type ViewportKey = "desktop" | "mobile";

function SectionListEditor({
  title,
  icon: Icon,
  sections,
  onChange,
  onReset,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: HomeSectionConfig[];
  onChange: (next: HomeSectionConfig[]) => void;
  onReset: () => void;
}) {
  const move = (index: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggle = (index: number) => {
    const next = sections.map((s, i) =>
      i === index ? { ...s, enabled: !s.enabled } : s
    );
    onChange(next);
  };

  return (
    <Card padding="md" className="min-w-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-bold text-foreground flex items-center gap-2 text-sm sm:text-base">
          <Icon className="h-5 w-5 text-primary shrink-0" />
          {title}
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-primary font-semibold hover:underline shrink-0"
        >
          Reset default
        </button>
      </div>
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-xl border transition-colors ${
              section.enabled
                ? "border-border bg-surface/50"
                : "border-border/60 bg-gray-50 dark:bg-gray-900/40 opacity-60"
            }`}
          >
            <span className="text-xs font-bold text-gray-400 w-5 shrink-0 text-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {HOME_SECTION_LABELS[section.id]}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{section.id}</p>
            </div>
            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={section.enabled}
                onChange={() => toggle(index)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-[10px] text-gray-500 hidden sm:inline">Show</span>
            </label>
            <div className="flex flex-col shrink-0">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-surface disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={index === sections.length - 1}
                onClick={() => move(index, 1)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-surface disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AdminHomeLayoutPage() {
  const [config, setConfig] = useState<HomeLayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.adminGetHomeLayout().then((res) => {
      if (res.success && res.data) setConfig(res.data as HomeLayoutConfig);
      setLoading(false);
    });
  }, []);

  const updateViewport = (viewport: ViewportKey, sections: HomeSectionConfig[]) => {
    if (!config) return;
    setConfig({ ...config, [viewport]: sections });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const res = await api.adminUpdateHomeLayout({
      desktop: config.desktop,
      mobile: config.mobile,
    });
    if (res.success) toast.success("Homepage layout saved");
    else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  if (loading || !config) {
    return <p className="text-gray-500">Loading homepage layout...</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-primary" />
            Homepage Layout
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Control section order separately for mobile and desktop. Mobile default: banner → Top
            Products → Shop by Category → Best Sellers.
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} leftIcon={<Save className="h-4 w-4" />}>
          Save Layout
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionListEditor
          title="Mobile order (< lg)"
          icon={Smartphone}
          sections={config.mobile}
          onChange={(next) => updateViewport("mobile", next)}
          onReset={() => updateViewport("mobile", [...DEFAULT_HOME_LAYOUT.mobile])}
        />
        <SectionListEditor
          title="Desktop order (≥ lg)"
          icon={Monitor}
          sections={config.desktop}
          onChange={(next) => updateViewport("desktop", next)}
          onReset={() => updateViewport("desktop", [...DEFAULT_HOME_LAYOUT.desktop])}
        />
      </div>

      <Card padding="md" className="bg-primary/5 border-primary/20">
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary" />
          Tips
        </p>
        <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5">
          <li>Uncheck &quot;Show&quot; to hide a section without removing it from the list.</li>
          <li>Changes apply to the storefront within about a minute (cached).</li>
          <li>Hero banner should stay first on both layouts for best UX.</li>
        </ul>
      </Card>
    </div>
  );
}
