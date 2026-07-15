"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/shared/order-status-badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api/client";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AdminEntityConfig, AdminFieldDef } from "@/lib/admin/entity-configs";
import type { Brand, Category, Product, User, VehicleMake, ProductSpecification, VehicleCompatibility } from "@/types";
import { ProductSpecificationsEditor } from "@/components/admin/product-specifications-editor";
import { ProductVehicleFitEditor } from "@/components/admin/product-vehicle-fit-editor";
import { SearchableSelect } from "@/components/ui/searchable-select";
import toast from "react-hot-toast";

type Row = Record<string, unknown> & { id: string };
type ModalMode = "view" | "create" | "edit" | null;

interface AdminCrudPanelProps {
  config: AdminEntityConfig;
  /** Optional filter applied client-side after fetch */
  filterFn?: (row: Row) => boolean;
}

function getCellValue(row: Row, key: string, render?: string) {
  const val = row[key];
  if (val === undefined || val === null) return "—";
  if (render === "price") return formatPrice(Number(val));
  if (render === "date") return formatDate(String(val));
  if (render === "bool") return val ? "Yes" : "No";
  if (render === "badge") return String(val).replace(/_/g, " ");
  if (typeof val === "object") return JSON.stringify(val).slice(0, 40);
  return String(val);
}

function rowToForm(row: Row, fields: AdminFieldDef[]): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const f of fields) {
    const v = row[f.key];
    if (f.type === "checkbox") form[f.key] = Boolean(v);
    else if (f.type === "json") form[f.key] = typeof v === "object" ? JSON.stringify(v, null, 2) : v ?? "";
    else if (f.type === "specList") form[f.key] = Array.isArray(v) ? v : [];
    else if (f.type === "vehicleFitList") form[f.key] = Array.isArray(v) ? v : [];
    else if (f.key === "tags" && Array.isArray(v)) form[f.key] = v.join(", ");
    else form[f.key] = v ?? "";
  }
  // Product image helper
  if (row.images && Array.isArray(row.images) && row.images[0]) {
    form.imageUrl = (row.images[0] as { url: string }).url;
  }
  return form;
}

function emptyForm(fields: AdminFieldDef[]): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === "checkbox") form[f.key] = false;
    else if (f.type === "number") form[f.key] = 0;
    else if (f.type === "specList" || f.type === "vehicleFitList") form[f.key] = [];
    else form[f.key] = "";
  }
  return form;
}

export function AdminCrudPanel({ config, filterFn }: AdminCrudPanelProps) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [brandOptions, setBrandOptions] = useState<Brand[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);

  const needsBrands = useMemo(
    () => config.fields.some((f) => f.optionsSource === "brands"),
    [config.fields]
  );
  const needsCategories = useMemo(
    () => config.fields.some((f) => f.optionsSource === "categories"),
    [config.fields]
  );
  const needsProducts = useMemo(
    () => config.fields.some((f) => f.optionsSource === "products"),
    [config.fields]
  );
  const needsUsers = useMemo(
    () => config.fields.some((f) => f.optionsSource === "users"),
    [config.fields]
  );
  const needsVehicles = useMemo(
    () => config.fields.some((f) => f.type === "vehicleFitList"),
    [config.fields]
  );

  const canCreate = config.canCreate !== false;
  const canEdit = config.canEdit !== false;
  const canDelete = config.canDelete !== false;
  const canView = config.canView !== false;

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.adminList(config.resource);
    if (res.success && res.data) setRows(res.data as Row[]);
    else toast.error(res.error || "Failed to load data");
    setLoading(false);
  }, [config.resource]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!needsBrands && !needsCategories && !needsProducts && !needsUsers && !needsVehicles) return;
    (async () => {
      if (needsBrands) {
        const res = await api.brands();
        if (res.success && res.data) setBrandOptions(res.data);
      }
      if (needsCategories) {
        const res = await api.categories();
        if (res.success && res.data) setCategoryOptions(res.data);
      }
      if (needsProducts) {
        const res = await api.products();
        if (res.success && res.data) setProductOptions(res.data);
      }
      if (needsUsers) {
        const res = await api.adminCustomers();
        if (res.success && res.data) setUserOptions(res.data);
      }
      if (needsVehicles) {
        const res = await api.vehicles();
        if (res.success && res.data) setVehicleMakes(res.data);
      }
    })();
  }, [needsBrands, needsCategories, needsProducts, needsUsers, needsVehicles]);

  const filtered = useMemo(() => {
    let list = filterFn ? rows.filter(filterFn) : rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      const keys = config.searchKeys ?? config.columns.map((c) => c.key);
      list = list.filter((row) =>
        keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }
    return list;
  }, [rows, search, config, filterFn]);

  const openCreate = () => {
    setForm(emptyForm(config.fields));
    setSelected(null);
    setModal("create");
  };

  const openEdit = (row: Row) => {
    setSelected(row);
    setForm(rowToForm(row, config.fields));
    setModal("edit");
  };

  const openView = (row: Row) => {
    setSelected(row);
    setForm(rowToForm(row, config.fields));
    setModal("view");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal === "create") {
        const res = await api.adminCreate(config.resource, form);
        if (res.success) {
          toast.success("Created successfully");
          closeModal();
          load();
        } else toast.error(res.error || "Create failed");
      } else if (modal === "edit" && selected) {
        const res = await api.adminUpdate(config.resource, selected.id, form);
        if (res.success) {
          toast.success("Updated successfully");
          closeModal();
          load();
        } else toast.error(res.error || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: Row) => {
    if (!confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()}?`)) return;
    const res = await api.adminDelete(config.resource, row.id);
    if (res.success) {
      toast.success("Deleted");
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } else toast.error(res.error || "Delete failed");
  };

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionsSourceChange = (field: AdminFieldDef, value: string) => {
    if (field.optionsSource === "brands") {
      const brand = brandOptions.find((b) => b.slug === value);
      setForm((prev) => ({
        ...prev,
        brand: brand?.name ?? "",
        brandSlug: brand?.slug ?? "",
      }));
      return;
    }
    if (field.optionsSource === "categories") {
      const category = categoryOptions.find((c) => c.slug === value);
      setForm((prev) => ({
        ...prev,
        category: category?.name ?? "",
        categorySlug: category?.slug ?? "",
      }));
      return;
    }
    if (field.optionsSource === "products") {
      setForm((prev) => ({ ...prev, productId: value }));
      return;
    }
    if (field.optionsSource === "users") {
      const user = userOptions.find((u) => u.id === value);
      setForm((prev) => ({
        ...prev,
        userId: value,
        ...(field.linkedKey ? { [field.linkedKey]: user?.name ?? "" } : {}),
      }));
    }
  };

  const getOptionsSourceValue = (field: AdminFieldDef) => {
    if (field.slugKey) {
      const slug = form[field.slugKey];
      if (slug) return String(slug);
      if (field.optionsSource === "brands") {
        const match = brandOptions.find((b) => b.name === form[field.key]);
        return match?.slug ?? "";
      }
      if (field.optionsSource === "categories") {
        const match = categoryOptions.find((c) => c.name === form[field.key]);
        return match?.slug ?? "";
      }
    }
    return String(form[field.key] ?? "");
  };

  useEffect(() => {
    if (modal === null) return;
    setForm((prev) => {
      let changed = false;
      const next = { ...prev };
      if (needsBrands && brandOptions.length && prev.brand && !prev.brandSlug) {
        const match = brandOptions.find((b) => b.name === prev.brand);
        if (match) {
          next.brand = match.name;
          next.brandSlug = match.slug;
          changed = true;
        }
      }
      if (needsCategories && categoryOptions.length && prev.category && !prev.categorySlug) {
        const match = categoryOptions.find((c) => c.name === prev.category);
        if (match) {
          next.category = match.name;
          next.categorySlug = match.slug;
          changed = true;
        }
      }
      if (needsUsers && userOptions.length && prev.userId && !prev.userName) {
        const match = userOptions.find((u) => u.id === prev.userId);
        if (match) {
          next.userName = match.name;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [modal, needsBrands, needsCategories, needsUsers, brandOptions, categoryOptions, userOptions]);

  const renderField = (field: AdminFieldDef, readOnly: boolean) => {
    const val = form[field.key];
    const base = "w-full px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary";
    const isReadOnly = readOnly || field.readOnly;
    const ro = isReadOnly ? "opacity-70 cursor-not-allowed bg-surface" : "";

    if (field.type === "specList") {
      return (
        <ProductSpecificationsEditor
          value={(val as ProductSpecification[]) ?? []}
          onChange={(next) => setField(field.key, next)}
          readOnly={readOnly}
        />
      );
    }
    if (field.type === "vehicleFitList") {
      return (
        <ProductVehicleFitEditor
          value={(val as VehicleCompatibility[]) ?? []}
          onChange={(next) => setField(field.key, next)}
          vehicleMakes={vehicleMakes}
          readOnly={readOnly}
        />
      );
    }
    if (field.type === "textarea" || field.type === "json") {
      return (
        <textarea
          value={String(val ?? "")}
          onChange={(e) => setField(field.key, e.target.value)}
          readOnly={readOnly}
          rows={field.type === "json" ? 5 : 3}
          placeholder={field.placeholder}
          className={`${base} ${ro} font-mono text-xs`}
        />
      );
    }
    if (field.type === "select") {
      const sourceOptions =
        field.optionsSource === "brands"
          ? brandOptions.map((b) => ({ value: b.slug, label: b.name }))
          : field.optionsSource === "categories"
            ? categoryOptions.map((c) => ({ value: c.slug, label: c.name }))
            : field.optionsSource === "products"
              ? productOptions.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` }))
              : field.optionsSource === "users"
                ? userOptions.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }))
                : field.options ?? [];

      const currentValue = field.optionsSource
        ? getOptionsSourceValue(field)
        : String(val ?? "");

      if (field.searchable && field.optionsSource) {
        return (
          <SearchableSelect
            options={sourceOptions}
            value={currentValue}
            onChange={(next) => handleOptionsSourceChange(field, next)}
            placeholder={`Search ${field.label.toLowerCase()}...`}
            disabled={readOnly}
            emptyMessage={`No ${field.label.toLowerCase()} found`}
          />
        );
      }

      return (
        <select
          value={currentValue}
          onChange={(e) => {
            if (field.optionsSource) handleOptionsSourceChange(field, e.target.value);
            else setField(field.key, e.target.value);
          }}
          disabled={readOnly}
          className={`${base} ${ro}`}
        >
          <option value="">Select...</option>
          {sourceOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }
    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(val)}
            onChange={(e) => setField(field.key, e.target.checked)}
            disabled={readOnly}
            className="h-4 w-4 rounded border-border text-primary"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{field.label}</span>
        </label>
      );
    }
    return (
      <input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : "text"}
        value={String(val ?? "")}
        onChange={(e) => setField(field.key, field.type === "number" ? e.target.value : e.target.value)}
        readOnly={isReadOnly}
        placeholder={field.placeholder}
        className={`${base} ${ro}`}
      />
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-start sm:items-center justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-foreground truncate">{config.title}</h1>
          {config.description && <p className="text-sm text-gray-500">{config.description}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length} records</p>
        </div>
        {canCreate && (
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            {config.addLabel || "Add New"}
          </Button>
        )}
      </div>

      <Card padding="none">
        <div className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${config.title.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto -mx-px">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-surface">
                <tr>
                  {config.columns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-12 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                ) : filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-surface transition-colors">
                    {config.columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-foreground max-w-xs truncate">
                        {col.render === "orderStatus" ? (
                          <OrderStatusBadge status={String(row[col.key] ?? "")} />
                        ) : col.render === "badge" ? (
                          <Badge variant="default">{getCellValue(row, col.key, col.render)}</Badge>
                        ) : col.render === "bool" ? (
                          <Badge variant={row[col.key] ? "success" : "default"}>{getCellValue(row, col.key, col.render)}</Badge>
                        ) : (
                          getCellValue(row, col.key, col.render)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {canView && (
                          <button onClick={() => openView(row)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-primary" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {canEdit && (
                          <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-blue-500" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => handleDelete(row)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-red-500" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={modal !== null} onOpenChange={(o) => !o && closeModal()}>
        <DialogContent className={config.fields.some((f) => f.type === "specList" || f.type === "vehicleFitList") ? "sm:max-w-3xl" : "sm:max-w-2xl"}>
          <DialogHeader>
            <DialogTitle>
              {modal === "view" && "View Details"}
              {modal === "create" && `Add ${config.title.slice(0, -1)}`}
              {modal === "edit" && `Edit ${config.title.slice(0, -1)}`}
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {config.fields.map((field) => (
                <div key={field.key} className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
                  {field.type !== "checkbox" && modal !== "view" && (
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      {field.label}{field.required && " *"}
                    </label>
                  )}
                  {modal === "view" ? (
                    field.type === "specList" ? (
                      <ProductSpecificationsEditor
                        value={(form[field.key] as ProductSpecification[]) ?? []}
                        onChange={() => {}}
                        readOnly
                      />
                    ) : field.type === "vehicleFitList" ? (
                      <ProductVehicleFitEditor
                        value={(form[field.key] as VehicleCompatibility[]) ?? []}
                        onChange={() => {}}
                        vehicleMakes={vehicleMakes}
                        readOnly
                      />
                    ) : (
                    <div className={cn(
                      "text-sm text-foreground py-2 px-3 bg-surface rounded-lg break-words",
                      field.type === "textarea" && "whitespace-pre-wrap min-h-[5rem]"
                    )}>
                      {field.type === "checkbox"
                        ? (form[field.key] ? "Yes" : "No")
                        : field.key === "createdAt"
                          ? formatDate(String(form[field.key] ?? ""))
                          : String(form[field.key] ?? "—")}
                    </div>
                    )
                  ) : (
                    renderField(field, false)
                  )}
                </div>
              ))}
            </div>

            {modal === "view" && selected && Array.isArray(selected.items) && (selected.items as { productName: string; quantity: number; price: number }[]).length > 0 ? (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Order Items</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(selected.items as { productName: string; quantity: number; price: number }[]).map((item, i) => (
                    <div key={i} className="flex flex-col xs:flex-row xs:justify-between gap-0.5 text-sm px-3 py-2 bg-surface rounded-lg">
                      <span className="min-w-0 truncate">{item.productName} × {item.quantity}</span>
                      <span className="font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {modal === "view" && selected?.shippingAddress ? (
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Shipping Address</p>
                <pre className="text-xs bg-surface rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(selected.shippingAddress, null, 2)}
                </pre>
              </div>
            ) : null}
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost" leftIcon={<X className="h-4 w-4" />} onClick={closeModal} className="w-full sm:w-auto">
              {modal === "view" ? "Close" : "Cancel"}
            </Button>
            {modal !== "view" && (
              <Button loading={saving} leftIcon={<Save className="h-4 w-4" />} onClick={handleSave} className="w-full sm:w-auto">
                {modal === "create" ? "Create" : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
