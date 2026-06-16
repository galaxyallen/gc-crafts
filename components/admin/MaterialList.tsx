"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { isDataUrl } from "@/lib/image-utils";
import { GripVertical, Pencil, Plus, Trash2, X, Loader2 } from "lucide-react";
import { Material } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { readApiError } from "@/lib/client-api";

interface MaterialListProps {
  initialMaterials: Material[];
}

interface MaterialFormData {
  name: string;
  subtitle: string;
  image: string;
}

const emptyForm: MaterialFormData = {
  name: "",
  subtitle: "",
  image: "",
};

function SortableMaterialRow({
  material,
  onEdit,
  onDelete,
}: {
  material: Material;
  onEdit: (m: Material) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: material.id,
  } as Parameters<typeof useSortable>[0]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-sm border border-gold/5 bg-char-d px-3 py-3"
    >
      <button type="button" className="cursor-grab text-t3 hover:text-t1" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-gold/10 bg-char-dd">
        {material.image ? (
          <Image
            src={material.image}
            alt={material.name}
            fill
            className="object-cover"
            unoptimized={isDataUrl(material.image)}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-t1">{material.name}</p>
        <p className="truncate text-xs text-t3">{material.subtitle}</p>
      </div>

      <div className="flex gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(material)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(material.id)}>
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </div>
    </div>
  );
}

export function MaterialList({ initialMaterials }: MaterialListProps) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MaterialFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(material: Material) {
    setEditingId(material.id);
    setForm({
      name: material.name,
      subtitle: material.subtitle,
      image: material.image,
    });
    setDialogOpen(true);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = materials.findIndex((m) => m.id === active.id);
    const newIndex = materials.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(materials, oldIndex, newIndex).map((m, i) => ({ ...m, sortOrder: i + 1 }));

    setMaterials(reordered);

    await fetch("/api/materials/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reordered.map((m) => ({ id: m.id, sortOrder: m.sortOrder }))),
    });
  }

  async function handleSave() {
    if (!form.image.trim()) {
      setError("Please upload a material image");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/materials/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await readApiError(res, "Failed to update material"));
        const updated = await res.json();
        setMaterials((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      } else {
        const res = await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(await readApiError(res, "Failed to create material"));
        const created = await res.json();
        setMaterials((prev) => [...prev, created]);
      }
      setDialogOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this material?")) return;

    const res = await fetch(`/api/materials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    }
  }

  return (
    <Card className="bg-char-dd">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Materials</CardTitle>
          <p className="mt-1 text-xs text-t3">Upload texture photos shown in the homepage Materials scroll</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add material
        </Button>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={materials.map((m) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {materials.map((material) => (
                <SortableMaterialRow
                  key={material.id}
                  material={material}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {materials.length === 0 && (
          <p className="py-8 text-center text-sm text-t3">No materials yet. Add your first one.</p>
        )}
      </CardContent>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-gold/10 bg-char-dd p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium text-t1">
                {editingId ? "Edit material" : "Add material"}
              </Dialog.Title>
              <Dialog.Close className="text-t3 hover:text-t1">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mat-name">Name</Label>
                <Input id="mat-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mat-subtitle">Subtitle</Label>
                <Input
                  id="mat-subtitle"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <ImageField
                label="Material photo"
                hint="Shown as a texture swatch on the homepage"
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.Close>
                <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.image.trim()}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Card>
  );
}
