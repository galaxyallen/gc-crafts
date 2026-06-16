"use client";

import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface ImageFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageField({ label = "Image", value, onChange, hint }: ImageFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-t3">{hint}</p>}
      <ImageUploader value={value ? [value] : []} onChange={(urls) => onChange(urls[0] ?? "")} />
    </div>
  );
}
