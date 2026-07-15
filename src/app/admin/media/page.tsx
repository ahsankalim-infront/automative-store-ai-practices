"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppImage as Image } from "@/components/ui/app-image";
import {
  Upload, Trash2, Copy, Check, Search, FileText, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { formatDate, formatFileSize } from "@/lib/utils";
import type { UploadedFile } from "@/types";
import toast from "react-hot-toast";

const IMAGE_SIZE_PRESETS = [
  {
    width: 300,
    label: "Thumbnail",
    size: "300px wide",
    bestFor: "Product thumbnails, cart items, order line items",
  },
  {
    width: 400,
    label: "Logo",
    size: "400×400px",
    bestFor: "Brand logos, category icons, store badges",
    maxHeight: 400,
  },
  {
    width: 800,
    label: "Medium",
    size: "800px wide",
    bestFor: "Product main images, service photos, blog inline images",
  },
  {
    width: 1200,
    label: "Large",
    size: "1200px wide",
    bestFor: "Featured products, blog cover images, CMS hero blocks",
  },
  {
    width: 1920,
    label: "Banner",
    size: "1920px wide",
    bestFor: "Homepage banners, promo sliders, full-width marketing",
  },
] as const;

function isImage(mimeType: string) {
  return mimeType.startsWith("image/");
}

export default function AdminMediaPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resize, setResize] = useState(true);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [maxHeight, setMaxHeight] = useState<number | "">("");
  const [quality, setQuality] = useState(85);
  const [activePresetWidth, setActivePresetWidth] = useState<number | null>(1200);

  const applyPreset = (preset: (typeof IMAGE_SIZE_PRESETS)[number]) => {
    setMaxWidth(preset.width);
    setMaxHeight("maxHeight" in preset && preset.maxHeight ? preset.maxHeight : "");
    setActivePresetWidth(preset.width);
  };

  const selectedPreset = IMAGE_SIZE_PRESETS.find((p) => p.width === activePresetWidth) ?? null;

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const res = await api.adminListFiles();
    if (res.success && res.data) setFiles(res.data);
    else toast.error(res.error || "Failed to load files");
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) =>
        f.originalName.toLowerCase().includes(q) ||
        f.filename.toLowerCase().includes(q) ||
        f.url.toLowerCase().includes(q)
    );
  }, [files, search]);

  const handleFilePick = (file: File | null) => {
    setSelectedFile(file);
    if (file && file.type.startsWith("image/") && !resize) {
      setResize(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("resize", String(resize && selectedFile.type.startsWith("image/")));
    if (maxWidth) formData.append("maxWidth", String(maxWidth));
    if (maxHeight) formData.append("maxHeight", String(maxHeight));
    formData.append("quality", String(quality));

    setUploading(true);
    const res = await api.adminUploadFile(formData);
    setUploading(false);

    if (res.success && res.data) {
      toast.success("File uploaded");
      setFiles((prev) => [res.data!, ...prev]);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      toast.error(res.error || "Upload failed");
    }
  };

  const copyUrl = async (file: UploadedFile) => {
    const fullUrl = `${window.location.origin}${file.url}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(file.id);
    toast.success("URL copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm(`Delete "${file.originalName}"? This cannot be undone.`)) return;

    setDeletingId(file.id);
    const res = await api.adminDeleteFile(file.id);
    setDeletingId(null);

    if (res.success) {
      toast.success("File deleted");
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  const canResizeSelected = selectedFile?.type.startsWith("image/") &&
    !selectedFile.type.includes("svg") &&
    selectedFile.type !== "image/gif";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Media Library</h1>
          <p className="text-sm text-gray-500">
            Upload files to <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">public/uploads</code> and copy URLs for products, banners, and CMS.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={loadFiles}>
          Refresh
        </Button>
      </div>

      <Card padding="md">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">Upload File</p>
            <p className="text-xs text-gray-500">JPG, PNG, WebP, GIF, SVG, PDF — max 10 MB</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFilePick(file);
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
                className="hidden"
                onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
              />
              {previewUrl && selectedFile?.type.startsWith("image/") ? (
                <div className="relative h-40 w-full max-w-xs mx-auto mb-3">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              ) : (
                <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              )}
              <p className="text-sm font-medium text-foreground">
                {selectedFile ? selectedFile.name : "Drop a file here or click to browse"}
              </p>
              {selectedFile && (
                <p className="text-xs text-gray-400 mt-1">{formatFileSize(selectedFile.size)}</p>
              )}
            </div>

            {canResizeSelected && (
              <div className="space-y-4 rounded-2xl border border-border p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resize}
                    onChange={(e) => setResize(e.target.checked)}
                    className="rounded border-border"
                  />
                  Resize image on upload (outputs WebP)
                </label>

                {resize && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Recommended sizes
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {IMAGE_SIZE_PRESETS.map((preset) => {
                          const selected = activePresetWidth === preset.width;
                          return (
                            <button
                              key={preset.width}
                              type="button"
                              onClick={() => applyPreset(preset)}
                              className={`text-left rounded-xl border p-3 transition-colors ${
                                selected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                  : "border-border hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className={`text-sm font-bold ${selected ? "text-primary" : "text-foreground"}`}>
                                  {preset.label}
                                </span>
                                <span className="text-[10px] font-medium text-gray-400 shrink-0 mt-0.5">
                                  {preset.size}
                                </span>
                              </div>
                              <p className="text-[11px] leading-snug text-gray-500">
                                <span className="font-medium text-gray-600 dark:text-gray-400">Best for: </span>
                                {preset.bestFor}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedPreset && (
                      <p className="text-xs rounded-xl bg-primary/5 border border-primary/20 text-primary px-3 py-2">
                        <span className="font-semibold">{selectedPreset.label}</span> — {selectedPreset.bestFor}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Max width (px)</label>
                        <input
                          type="number"
                          min={50}
                          max={4000}
                          value={maxWidth}
                          onChange={(e) => {
                            setMaxWidth(Number(e.target.value) || 1200);
                            setActivePresetWidth(null);
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Max height (px)</label>
                        <input
                          type="number"
                          min={50}
                          max={4000}
                          placeholder="Auto"
                          value={maxHeight}
                          onChange={(e) => {
                            setMaxHeight(e.target.value ? Number(e.target.value) : "");
                            setActivePresetWidth(null);
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Quality: {quality}%
                      </label>
                      <input
                        type="range"
                        min={40}
                        max={100}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={handleUpload}
              loading={uploading}
              disabled={!selectedFile}
              leftIcon={<Upload className="h-4 w-4" />}
              fullWidth
            >
              Upload
            </Button>
          </div>

          <div className="rounded-2xl bg-surface p-4 text-sm text-muted-foreground space-y-3">
            <p className="font-semibold text-foreground">How it works</p>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed">
              <li>Files are saved under <strong>public/uploads/</strong> in your project.</li>
              <li>Each upload gets a public URL like <code>/uploads/product-abc123.webp</code>.</li>
              <li>Use the copy button to paste URLs into product images, banners, or blog posts.</li>
              <li>Enable resize to compress images and set max dimensions before saving.</li>
              <li>Resized images are converted to WebP for smaller file sizes.</li>
            </ul>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs font-semibold text-foreground mb-2">Size guide</p>
              <dl className="space-y-2 text-xs">
                {IMAGE_SIZE_PRESETS.map((preset) => (
                  <div key={preset.width}>
                    <dt className="font-medium text-foreground">
                      {preset.label} <span className="text-gray-400 font-normal">({preset.size})</span>
                    </dt>
                    <dd className="text-gray-500 mt-0.5">{preset.bestFor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="font-bold text-foreground">Uploaded Files</p>
            <p className="text-xs text-gray-500">{files.length} file{files.length !== 1 ? "s" : ""} in library</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 py-12 text-center">Loading files...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 py-12 text-center">
            {files.length === 0 ? "No files uploaded yet." : "No files match your search."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((file) => (
              <div
                key={file.id}
                className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {isImage(file.mimeType) ? (
                    <Image
                      src={file.url}
                      alt={file.originalName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <FileText className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm font-semibold text-foreground truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{file.url}</p>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    {file.width && file.height && (
                      <span>{file.width}×{file.height}</span>
                    )}
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex-1"
                      leftIcon={
                        copiedId === file.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )
                      }
                      onClick={() => copyUrl(file)}
                    >
                      Copy URL
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      loading={deletingId === file.id}
                      leftIcon={<Trash2 className="h-3 w-3" />}
                      onClick={() => handleDelete(file)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
