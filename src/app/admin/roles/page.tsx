import { AdminEntityPage } from "@/components/admin/admin-entity-page";
import { RolePermissionsEditor } from "@/components/admin/role-permissions-editor";

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <RolePermissionsEditor />
      <AdminEntityPage entity="users" />
    </div>
  );
}
