import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/admin/Topbar";
import { MaterialList } from "@/components/admin/MaterialList";

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Topbar title="Materials" />
      <div className="flex-1 p-6">
        <p className="mb-6 text-sm text-t2">
          Manage material swatches displayed on the site. Drag to reorder.
        </p>
        <MaterialList initialMaterials={materials} />
      </div>
    </>
  );
}
