"use client";

import { useState, useEffect } from "react";
import { Save, Search, Globe, FileText, Map, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { SEO_PAGE_LABELS } from "@/lib/seo/defaults";
import type { SeoConfig, SeoGlobalSettings, SeoPageEntry, SeoPageKey } from "@/lib/seo/types";
import toast from "react-hot-toast";

type Tab = "global" | "pages" | "sitemap";

const PAGE_KEYS = Object.keys(SEO_PAGE_LABELS) as SeoPageKey[];

export function AdminSeoPage() {
  const [tab, setTab] = useState<Tab>("global");
  const [config, setConfig] = useState<SeoConfig | null>(null);
  const [activePage, setActivePage] = useState<SeoPageKey>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.adminGetSeo().then((res) => {
      if (res.success && res.data) setConfig(res.data as SeoConfig);
      setLoading(false);
    });
  }, []);

  const inputClass =
    "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  const updateGlobal = (key: keyof SeoGlobalSettings, value: string | boolean | string[]) => {
    if (!config) return;
    setConfig({ ...config, global: { ...config.global, [key]: value } });
  };

  const updatePage = (key: SeoPageKey, field: keyof SeoPageEntry, value: string | boolean | number | string[]) => {
    if (!config) return;
    setConfig({
      ...config,
      pages: {
        ...config.pages,
        [key]: { ...config.pages[key], [field]: value },
      },
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    const res = await api.adminUpdateSeo({
      global: config.global,
      pages: config.pages,
    });
    if (res.success) toast.success("SEO settings saved");
    else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  if (loading || !config) {
    return <p className="text-gray-500">Loading SEO settings...</p>;
  }

  const page = config.pages[activePage];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            SEO Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage meta titles, descriptions, Open Graph, robots and sitemap for all pages
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} leftIcon={<Save className="h-4 w-4" />}>
          Save SEO Settings
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {([
          ["global", "Global SEO", Globe],
          ["pages", "Page SEO", FileText],
          ["sitemap", "Sitemap & Robots", Map],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === id ? "bg-primary text-white" : "bg-surface text-gray-500 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "global" && (
        <Card padding="md">
          <h2 className="font-bold text-foreground mb-4">Global SEO Defaults</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <SeoField label="Site Name" value={config.global.siteName} onChange={(v) => updateGlobal("siteName", v)} />
            <SeoField label="Default Site Title" value={config.global.siteTitle} onChange={(v) => updateGlobal("siteTitle", v)} />
            <SeoField label="Title Template" value={config.global.titleTemplate} onChange={(v) => updateGlobal("titleTemplate", v)} hint="Use %s for page title" />
            <SeoField label="Locale" value={config.global.locale} onChange={(v) => updateGlobal("locale", v)} />
            <div className="sm:col-span-2">
              <SeoField label="Default Meta Description" value={config.global.defaultDescription} onChange={(v) => updateGlobal("defaultDescription", v)} multiline />
            </div>
            <div className="sm:col-span-2">
              <SeoField
                label="Default Keywords (comma-separated)"
                value={config.global.defaultKeywords.join(", ")}
                onChange={(v) => updateGlobal("defaultKeywords", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
            <SeoField label="Default OG Image URL" value={config.global.defaultOgImage} onChange={(v) => updateGlobal("defaultOgImage", v)} />
            <SeoField label="Twitter Handle" value={config.global.twitterHandle} onChange={(v) => updateGlobal("twitterHandle", v)} />
            <SeoField label="Google Site Verification" value={config.global.googleSiteVerification} onChange={(v) => updateGlobal("googleSiteVerification", v)} />
            <SeoField label="Bing Site Verification" value={config.global.bingSiteVerification} onChange={(v) => updateGlobal("bingSiteVerification", v)} />
            <SeoField label="Organization Name" value={config.global.organizationName} onChange={(v) => updateGlobal("organizationName", v)} />
            <SeoField label="Organization Logo URL" value={config.global.organizationLogo} onChange={(v) => updateGlobal("organizationLogo", v)} />
            <label className="sm:col-span-2 flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.global.robotsAllow}
                onChange={(e) => updateGlobal("robotsAllow", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-sm font-medium text-foreground">Allow search engines to index the site</span>
            </label>
            <div className="sm:col-span-2">
              <SeoField label="Extra robots.txt rules (optional)" value={config.global.robotsExtra} onChange={(v) => updateGlobal("robotsExtra", v)} multiline />
            </div>
          </div>
        </Card>
      )}

      {tab === "pages" && (
        <div className="grid lg:grid-cols-[240px_1fr] gap-4">
          <Card padding="sm" className="h-fit">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-2">Pages</p>
            <div className="space-y-0.5 max-h-[480px] overflow-y-auto">
              {PAGE_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePage === key ? "bg-primary text-white font-semibold" : "hover:bg-surface text-foreground"
                  }`}
                >
                  {SEO_PAGE_LABELS[key]}
                  {config.pages[key]?.noindex && <span className="ml-1 text-[10px] opacity-70">(noindex)</span>}
                </button>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <h2 className="font-bold text-foreground mb-1">{SEO_PAGE_LABELS[activePage]}</h2>
            <p className="text-xs text-gray-500 mb-4">Path: {page.path}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <SeoField label="Meta Title" value={page.title} onChange={(v) => updatePage(activePage, "title", v)} />
              <SeoField label="Canonical URL (optional)" value={page.canonical} onChange={(v) => updatePage(activePage, "canonical", v)} />
              <div className="sm:col-span-2">
                <SeoField label="Meta Description" value={page.description} onChange={(v) => updatePage(activePage, "description", v)} multiline />
              </div>
              <div className="sm:col-span-2">
                <SeoField
                  label="Keywords (comma-separated)"
                  value={page.keywords.join(", ")}
                  onChange={(v) => updatePage(activePage, "keywords", v.split(",").map((s) => s.trim()).filter(Boolean))}
                />
              </div>
              <SeoField label="OG Image URL" value={page.ogImage} onChange={(v) => updatePage(activePage, "ogImage", v)} />
              <SeoField label="Sitemap Priority (0–1)" value={String(page.priority)} onChange={(v) => updatePage(activePage, "priority", parseFloat(v) || 0.5)} />
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Change Frequency</label>
                <select
                  value={page.changefreq}
                  onChange={(e) => updatePage(activePage, "changefreq", e.target.value)}
                  className={inputClass}
                >
                  {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-6">
                <input type="checkbox" checked={page.noindex} onChange={(e) => updatePage(activePage, "noindex", e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm">Noindex (hide from search engines)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer pt-6">
                <input type="checkbox" checked={page.sitemap} onChange={(e) => updatePage(activePage, "sitemap", e.target.checked)} className="h-4 w-4 rounded" />
                <span className="text-sm">Include in XML sitemap</span>
              </label>
            </div>
          </Card>
        </div>
      )}

      {tab === "sitemap" && (
        <Card padding="md">
          <div className="flex items-start gap-3 mb-4">
            <RefreshCw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-foreground">Sitemap & Robots</h2>
              <p className="text-sm text-gray-500 mt-1">
                Generated automatically from SEO settings and your product/blog catalog.
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li><span className="font-semibold">Sitemap: </span><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/sitemap.xml</a></li>
            <li><span className="font-semibold">Robots: </span><a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">/robots.txt</a></li>
            <li className="text-gray-500 pt-2">Per-product SEO: edit Meta Title / Description in Admin → Products.</li>
          </ul>
        </Card>
      )}
    </div>
  );
}

function SeoField({
  label, value, onChange, multiline, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string;
}) {
  const cls = "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
