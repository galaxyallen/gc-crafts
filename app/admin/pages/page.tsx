import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/admin/Topbar";
import { SectionEditor } from "@/components/admin/SectionEditor";

export default async function PagesEditorPage() {
  const sections = await prisma.pageContent.findMany();

  return (
    <>
      <Topbar title="Page Content" />
      <div className="flex-1 p-6">
        <p className="mb-6 text-sm text-t2">
          Upload and edit images for the homepage, OEM page, and Contact page. Product galleries are managed under
          Products; material texture photos under Materials.
        </p>
        <SectionEditor sections={sections} />
      </div>
    </>
  );
}
