import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/admin/Topbar";
import { ProductForm } from "@/components/admin/ProductForm";

type PageProps = { params: { id: string } };

export default async function EditProductPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <Topbar title="Edit Product" />
      <div className="flex-1 p-6">
        <ProductForm product={product} />
      </div>
    </>
  );
}
