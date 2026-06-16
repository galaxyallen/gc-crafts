"use client";

import { useState } from "react";
import { PageContent } from "@prisma/client";
import { ChevronDown, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageField } from "@/components/admin/ImageField";
import { GalleryEditor } from "@/components/admin/GalleryEditor";
import { parseJson, cn } from "@/lib/utils";

interface SectionEditorProps {
  sections: PageContent[];
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Home — Hero",
  brand_quote: "Home — Brand Quote",
  trust_stats: "Home — Trust Stats",
  oem_intro: "OEM Page — Hero",
  oem_capabilities: "OEM — Capabilities",
  oem_process: "OEM — Process",
  factory_gallery: "OEM — Factory Gallery",
  capability_design: "Home — Capability / Design",
  capability_manufacture: "Home — Capability / Manufacture",
  capability_deliver: "Home — Capability / Deliver",
  page_contact: "Contact Page — Hero",
};

const SECTION_HINTS: Record<string, string> = {
  hero: "Homepage full-screen hero background",
  capability_design: "Shown in the Design card on homepage",
  capability_manufacture: "Shown in the Manufacture card on homepage",
  capability_deliver: "Shown in the Deliver card on homepage",
  oem_intro: "Optional background image for the OEM page hero",
  factory_gallery: "Factory workshop photos on the OEM page",
  page_contact: "Optional background image for the Contact page hero",
};

function SectionCard({
  section,
  defaultOpen = false,
}: {
  section: PageContent;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [title, setTitle] = useState(section.title ?? "");
  const [subtitle, setSubtitle] = useState(section.subtitle ?? "");
  const [body, setBody] = useState(section.body ?? "");
  const [image, setImage] = useState(section.image ?? "");
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    parseJson(section.metadata, {})
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/content/${section.section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, body, image, metadata }),
      });

      if (!res.ok) throw new Error("Failed to save section");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateMetadata(key: string, value: unknown) {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  }

  const label = SECTION_LABELS[section.section] ?? section.section;
  const hint = SECTION_HINTS[section.section];
  const hasImage =
    section.section === "hero" ||
    section.section.startsWith("capability_") ||
    section.section === "oem_intro" ||
    section.section === "page_contact";

  return (
    <Card className="bg-char-dd">
      <CardHeader className="cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown className="h-4 w-4 text-gold" />
            ) : (
              <ChevronRight className="h-4 w-4 text-t3" />
            )}
            <CardTitle className="text-base">{label}</CardTitle>
          </div>
          <span className="text-xs uppercase tracking-wider text-t3">{section.section}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="space-y-4 border-t border-gold/5 pt-4">
          {(section.section === "hero" ||
            section.section.startsWith("capability_") ||
            section.section === "oem_intro") && (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              {section.section === "hero" && (
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                </div>
              )}
            </>
          )}

          {(section.section === "hero" ||
            section.section === "brand_quote" ||
            section.section.startsWith("capability_") ||
            section.section === "oem_intro") && (
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
            </div>
          )}

          {hasImage && (
            <ImageField label="Image" hint={hint} value={image} onChange={setImage} />
          )}

          {section.section === "trust_stats" && (
            <StatsEditor
              stats={(metadata.stats as { value: string; label: string }[]) ?? []}
              onChange={(stats) => updateMetadata("stats", stats)}
            />
          )}

          {section.section === "oem_capabilities" && (
            <CardsEditor
              cards={(metadata.cards as { icon: string; title: string; desc: string }[]) ?? []}
              onChange={(cards) => updateMetadata("cards", cards)}
            />
          )}

          {section.section === "oem_process" && (
            <StepsEditor
              steps={(metadata.steps as { name: string; desc: string }[]) ?? []}
              onChange={(steps) => updateMetadata("steps", steps)}
            />
          )}

          {section.section === "factory_gallery" && (
            <GalleryEditor
              images={(metadata.images as { url: string; alt: string }[]) ?? []}
              onChange={(images) => updateMetadata("images", images)}
            />
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save section
            </Button>
            {saved && <span className="text-sm text-green-400">Saved</span>}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function StatsEditor({
  stats,
  onChange,
}: {
  stats: { value: string; label: string }[];
  onChange: (stats: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Stats</Label>
      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Value"
            value={stat.value}
            onChange={(e) => {
              const next = [...stats];
              next[i] = { ...stat, value: e.target.value };
              onChange(next);
            }}
          />
          <Input
            placeholder="Label"
            value={stat.label}
            onChange={(e) => {
              const next = [...stats];
              next[i] = { ...stat, label: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...stats, { value: "", label: "" }])}>
        Add stat
      </Button>
    </div>
  );
}

function CardsEditor({
  cards,
  onChange,
}: {
  cards: { icon: string; title: string; desc: string }[];
  onChange: (cards: { icon: string; title: string; desc: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Capability cards</Label>
      {cards.map((card, i) => (
        <div key={i} className={cn("space-y-2 rounded-sm border border-gold/5 p-3")}>
          <Input
            placeholder="Icon (Lucide name)"
            value={card.icon}
            onChange={(e) => {
              const next = [...cards];
              next[i] = { ...card, icon: e.target.value };
              onChange(next);
            }}
          />
          <Input
            placeholder="Title"
            value={card.title}
            onChange={(e) => {
              const next = [...cards];
              next[i] = { ...card, title: e.target.value };
              onChange(next);
            }}
          />
          <Textarea
            placeholder="Description"
            value={card.desc}
            onChange={(e) => {
              const next = [...cards];
              next[i] = { ...card, desc: e.target.value };
              onChange(next);
            }}
            rows={2}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...cards, { icon: "", title: "", desc: "" }])}
      >
        Add card
      </Button>
    </div>
  );
}

function StepsEditor({
  steps,
  onChange,
}: {
  steps: { name: string; desc: string }[];
  onChange: (steps: { name: string; desc: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Process steps</Label>
      {steps.map((step, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Name"
            value={step.name}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...step, name: e.target.value };
              onChange(next);
            }}
          />
          <Input
            placeholder="Description"
            value={step.desc}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...step, desc: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...steps, { name: "", desc: "" }])}>
        Add step
      </Button>
    </div>
  );
}

export function SectionEditor({ sections }: SectionEditorProps) {
  const order = [
    "hero",
    "capability_design",
    "capability_manufacture",
    "capability_deliver",
    "brand_quote",
    "trust_stats",
    "oem_intro",
    "factory_gallery",
    "oem_capabilities",
    "oem_process",
    "page_contact",
  ];

  const sorted = [...sections].sort((a, b) => {
    const ai = order.indexOf(a.section);
    const bi = order.indexOf(b.section);
    if (ai === -1 && bi === -1) return a.section.localeCompare(b.section);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-t3">
        Manage homepage, OEM, and Contact page images. Product page galleries are edited under Products.
      </p>
      {sorted.map((section, i) => (
        <SectionCard key={section.section} section={section} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
