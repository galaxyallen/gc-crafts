"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@prisma/client";
import type { ProductCategory } from "@/lib/types";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: ProductCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DISPLAYS", label: "Displays" },
  { value: "TRAYS", label: "Trays" },
  { value: "BUSTS", label: "Busts" },
  { value: "WATCHES", label: "Watches" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const url =
        category === "ALL" ? "/api/products" : `/api/products?category=${category}`;
      const res = await fetch(url);
      if (res.ok) {
        setProducts(await res.json());
      }
      setLoading(false);
    }

    fetchProducts();
  }, [category]);

  return (
    <>
      <Topbar title="Products" />
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 rounded-sm border border-gold/10 bg-char-d p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                  category === cat.value
                    ? "bg-gold/10 text-gold"
                    : "text-t3 hover:text-t1"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" />
              New product
            </Link>
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-t3">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-gold/5 bg-char-dd px-6 py-12 text-center text-sm text-t3">
            No products found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gold/5 bg-char-dd">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/5 text-left text-xs uppercase tracking-wider text-t3">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gold/5 last:border-0 hover:bg-char-d/50">
                    <td className="px-4 py-3 text-t1">{product.name}</td>
                    <td className="px-4 py-3 text-t2">{product.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant={product.published ? "success" : "secondary"}>
                        {product.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-t2">{product.sortOrder}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-gold hover:text-gold-l hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
