import { getEntityConfig } from "@/lib/admin/entity-configs";
import { AdminCrudPanel } from "@/components/admin/admin-crud-panel";

export default function AdminPromotionsPage() {
  const config = getEntityConfig("coupons");
  if (!config) return null;
  return (
    <AdminCrudPanel
      config={{
        ...config,
        title: "Promotions",
        description: "Manage promotional discount codes and campaigns",
        addLabel: "Add Promotion",
      }}
    />
  );
}
