"use client";

import { AdminCrudPanel } from "@/components/admin/admin-crud-panel";
import { getEntityConfig } from "@/lib/admin/entity-configs";

export default function AdminInventoryPage() {
  const base = getEntityConfig("products");
  if (!base) return null;

  return (
    <AdminCrudPanel
      config={{
        ...base,
        title: "Inventory",
        description: "Products with low stock — click Edit to update quantities",
        addLabel: "Add Product",
        canCreate: false,
        fields: base.fields.filter((f) =>
          ["name", "sku", "stock", "inStock", "price", "category"].includes(f.key)
        ),
      }}
      filterFn={(row) => Number(row.stock) < 20}
    />
  );
}
