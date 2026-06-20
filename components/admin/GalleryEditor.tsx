"use client";

import Image from "next/image";
import { isUnoptimizedImage } from "@/lib/image-utils";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";

export interface GalleryImage {
  url: string;
  alt: string;
}

interface GalleryEditorProps {
  label?: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export function GalleryEditor({ label = "Gallery images", images, onChange }: GalleryEditorProps) {
  function update(index: number, patch: Partial<GalleryImage>) {
    const next = [...images];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function addFromUpload(urls: string[]) {
    onChange([...images, ...urls.map((url) => ({ url, alt: "" }))]);
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {images.map((img, i) => (
        <div key={`${img.url}-${i}`} className="space-y-3 rounded-sm border border-gold/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-xs uppercase tracking-wider text-t3">Image {i + 1}</span>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>

          {img.url && (
            <div className="relative aspect-video max-w-md overflow-hidden rounded-sm border border-gold/10 bg-char-d">
              <Image
                src={img.url}
                alt={img.alt || `Gallery ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={isUnoptimizedImage(img.url)}
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input
                placeholder="Image URL"
                value={img.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Alt text</Label>
              <Input
                placeholder="Description for accessibility"
                value={img.alt}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
            </div>
          </div>

          {!img.url && (
            <ImageUploader
              value={[]}
              onChange={(urls) => urls[0] && update(i, { url: urls[0] })}
            />
          )}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...images, { url: "", alt: "" }])}>
          <Plus className="h-4 w-4" />
          Add slot
        </Button>
      </div>

      <div className="rounded-sm border border-dashed border-gold/15 p-4">
        <p className="mb-3 text-xs text-t3">Upload one or more images to append to the gallery</p>
        <ImageUploader value={[]} onChange={addFromUpload} />
      </div>
    </div>
  );
}
