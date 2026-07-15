import { AdminCrudPanel } from "@/components/admin/admin-crud-panel";
import { getEntityConfig } from "@/lib/admin/entity-configs";

interface Props {
  entity: string;
  filterFn?: (row: Record<string, unknown> & { id: string }) => boolean;
}

export function AdminEntityPage({ entity, filterFn }: Props) {
  const config = getEntityConfig(entity);
  if (!config) {
    return <p className="text-red-500">Unknown admin entity: {entity}</p>;
  }
  return <AdminCrudPanel config={config} filterFn={filterFn} />;
}
