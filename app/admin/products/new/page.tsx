import { Topbar } from "@/components/admin/Topbar";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <Topbar title="New Product" />
      <div className="flex-1 p-6">
        <ProductForm />
      </div>
    </>
  );
}
