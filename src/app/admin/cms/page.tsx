"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import toast from "react-hot-toast";

interface CmsPage {
  slug: string;
  title: string;
  content: string;
}

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.adminGetSettings().then((res) => {
      if (res.success && res.data?.cmsPages) {
        setPages(res.data.cmsPages as CmsPage[]);
      }
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const saveAll = async (updated: CmsPage[]) => {
    setSaving(true);
    const res = await api.adminUpdateSettings({ cmsPages: updated });
    if (res.success) {
      setPages(updated);
      toast.success("CMS pages saved");
      setEditing(null);
    } else toast.error(res.error || "Save failed");
    setSaving(false);
  };

  const handleAdd = () => {
    setEditing({ slug: "", title: "", content: "" });
  };

  const handleSavePage = () => {
    if (!editing?.slug || !editing.title) return toast.error("Slug and title required");
    const exists = pages.findIndex((p) => p.slug === editing.slug);
    const updated = exists >= 0
      ? pages.map((p, i) => (i === exists ? editing : p))
      : [...pages, editing];
    saveAll(updated);
  };

  const handleDelete = (slug: string) => {
    if (!confirm("Delete this page?")) return;
    saveAll(pages.filter((p) => p.slug !== slug));
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-foreground">CMS Pages</h1>
          <p className="text-sm text-gray-500">Manage static content pages</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleAdd}>Add Page</Button>
      </div>

      {editing && (
        <Card padding="md">
          <h3 className="font-bold mb-4">{pages.some((p) => p.slug === editing.slug) ? "Edit Page" : "New Page"}</h3>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Slug</label>
                <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputClass} placeholder="privacy-policy" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Content (HTML/Markdown)</label>
              <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10} className={`${inputClass} font-mono text-xs`} />
            </div>
            <div className="flex gap-2">
              <Button loading={saving} leftIcon={<Save className="h-4 w-4" />} onClick={handleSavePage}>Save Page</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      <Card padding="none">
        <div className="divide-y divide-border">
          {pages.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm">No CMS pages yet</p>
          ) : pages.map((page) => (
            <div key={page.slug} className="flex items-center justify-between px-4 py-3 hover:bg-surface">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="font-semibold text-sm text-foreground">{page.title}</p>
                  <p className="text-xs text-gray-400">/{page.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(page)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(page.slug)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
