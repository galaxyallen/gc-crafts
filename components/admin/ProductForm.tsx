"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import type { ProductCategory } from "@/lib/types";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify, parseJson } from "@/lib/utils";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "DISPLAYS", label: "Displays" },
  { value: "TRAYS", label: "Trays" },
  { value: "BUSTS", label: "Busts" },
  { value: "WATCHES", label: "Watches" },
];

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugManual, setSlugManual] = useState(isEdit);
  const [category, setCategory] = useState<ProductCategory>((product?.category as ProductCategory) ?? "DISPLAYS");
  const [description, setDescription] = useState(product?.description ?? "");
  const [materials, setMaterials] = useState(product?.materials ?? "");
  const [moq, setMoq] = useState(product?.moq ?? "");
  const [features, setFeatures] = useState<string[]>(parseJson(product?.features, [""]));
  const [images, setImages] = useState<string[]>(parseJson(product?.images, []));
  const [published, setPublished] = useState(product?.published ?? false);
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(product?.seoDesc ?? "");
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  function updateFeature(index: number, value: string) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  }

  function addFeature() {
    setFeatures((prev) => [...prev, ""]);
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name,
      slug,
      category,
      description,
      materials,
      moq,
      features: features.filter((f) => f.trim()),
      images,
      published,
      seoTitle: seoTitle || null,
      seoDesc: seoDesc || null,
      sortOrder,
    };

    try {
      const url = isEdit ? `/api/products/${product.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-char-dd">
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="flex h-9 w-full rounded-sm border border-gold/10 bg-char-d px-3 text-sm text-t1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="materials">Materials</Label>
              <Input id="materials" value={materials} onChange={(e) => setMaterials(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moq">MOQ</Label>
              <Input id="moq" value={moq} onChange={(e) => setMoq(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-char-dd">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={features.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4" />
            Add feature
          </Button>
        </CardContent>
      </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-t3">
              First image is used as the page hero and homepage product card. Drag order in the grid — first uploaded
              appears first.
            </p>
            <ImageUploader value={images} onChange={setImages} />
          </CardContent>
        </Card>

      <Card className="bg-char-dd">
        <CardHeader>
          <CardTitle>SEO & Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">SEO Description</Label>
            <Textarea id="seoDesc" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 rounded border-gold/20 bg-char-d accent-gold"
            />
            <span className="text-sm text-t1">Published</span>
          </label>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
        </div>

        {isEdit && (
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete product
          </Button>
        )}
      </div>
    </form>
  );
}
