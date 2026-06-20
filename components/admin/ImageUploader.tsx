"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isUnoptimizedImage } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  className?: string;
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError(null);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Upload failed");
        }

        const data = await res.json();
        newUrls.push(data.url);
      }

      onChange([...value, ...newUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-sm border border-gold/10 bg-char-d"
          >
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              fill
              className="object-cover"
              unoptimized={isUnoptimizedImage(url)}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-1 top-1 rounded-sm bg-char-ddd/90 p-1 text-t2 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-gold/20 bg-char-d text-t3 transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span className="text-xs">Upload</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length === 0 && (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading..." : "Add images"}
        </Button>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
