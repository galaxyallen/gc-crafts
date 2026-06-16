"use client";

import { useEffect, useState } from "react";
import { FactoryStat, PageContent } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GalleryEditor, type GalleryImage } from "@/components/admin/GalleryEditor";
import { parseJson } from "@/lib/utils";

export default function FactoryPage() {
  const [stats, setStats] = useState<FactoryStat[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [capabilities, setCapabilities] = useState<{ icon: string; title: string; desc: string }[]>([]);
  const [steps, setSteps] = useState<{ name: string; desc: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);
  const [savingCapabilities, setSavingCapabilities] = useState(false);
  const [savingSteps, setSavingSteps] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [statsRes, contentRes] = await Promise.all([
        fetch("/api/factory-stats"),
        fetch("/api/content"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());

      if (contentRes.ok) {
        const sections: PageContent[] = await contentRes.json();
        const gallerySection = sections.find((s) => s.section === "factory_gallery");
        const capsSection = sections.find((s) => s.section === "oem_capabilities");
        const processSection = sections.find((s) => s.section === "oem_process");

        if (gallerySection) {
          const meta = parseJson<{ images?: { url: string; alt: string }[] }>(gallerySection.metadata, {});
          setGallery(meta.images ?? []);
        }
        if (capsSection) {
          const meta = parseJson<{ cards?: { icon: string; title: string; desc: string }[] }>(capsSection.metadata, {});
          setCapabilities(meta.cards ?? []);
        }
        if (processSection) {
          const meta = parseJson<{ steps?: { name: string; desc: string }[] }>(processSection.metadata, {});
          setSteps(meta.steps ?? []);
        }
      }

      setLoading(false);
    }

    load();
  }, []);

  async function saveStats() {
    setSavingStats(true);
    setMessage(null);
    const res = await fetch("/api/factory-stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    setSavingStats(false);
    setMessage(res.ok ? "Stats saved" : "Failed to save stats");
  }

  async function saveSection(section: string, metadata: Record<string, unknown>, setter: (v: boolean) => void) {
    setter(true);
    setMessage(null);
    const res = await fetch(`/api/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metadata }),
    });
    setter(false);
    setMessage(res.ok ? "Saved" : "Save failed");
  }

  if (loading) {
    return (
      <>
        <Topbar title="Factory" />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-t3">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="Factory" />
      <div className="flex-1 space-y-6 p-6">
        {message && <p className="text-sm text-green-400">{message}</p>}

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Factory Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.map((stat, i) => (
              <div key={stat.key} className="grid gap-3 sm:grid-cols-3">
                <Input value={stat.label} disabled className="text-t3" />
                <Input
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...stats];
                    next[i] = { ...stat, value: e.target.value };
                    setStats(next);
                  }}
                />
                <Input value={stat.key} disabled className="text-t3" />
              </div>
            ))}
            <Button onClick={saveStats} disabled={savingStats} size="sm">
              {savingStats ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save stats
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <GalleryEditor images={gallery} onChange={setGallery} />
            <Button
              onClick={() => saveSection("factory_gallery", { images: gallery }, setSavingGallery)}
              disabled={savingGallery}
              size="sm"
            >
              {savingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save gallery
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {capabilities.map((card, i) => (
              <div key={i} className="space-y-2 rounded-sm border border-gold/5 p-3">
                <Input
                  placeholder="Icon"
                  value={card.icon}
                  onChange={(e) => {
                    const next = [...capabilities];
                    next[i] = { ...card, icon: e.target.value };
                    setCapabilities(next);
                  }}
                />
                <Input
                  placeholder="Title"
                  value={card.title}
                  onChange={(e) => {
                    const next = [...capabilities];
                    next[i] = { ...card, title: e.target.value };
                    setCapabilities(next);
                  }}
                />
                <Input
                  placeholder="Description"
                  value={card.desc}
                  onChange={(e) => {
                    const next = [...capabilities];
                    next[i] = { ...card, desc: e.target.value };
                    setCapabilities(next);
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCapabilities([...capabilities, { icon: "", title: "", desc: "" }])}
              >
                Add capability
              </Button>
              <Button
                onClick={() => saveSection("oem_capabilities", { cards: capabilities }, setSavingCapabilities)}
                disabled={savingCapabilities}
                size="sm"
              >
                {savingCapabilities ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save capabilities
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Process Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Step {i + 1} name</Label>
                  <Input
                    value={step.name}
                    onChange={(e) => {
                      const next = [...steps];
                      next[i] = { ...step, name: e.target.value };
                      setSteps(next);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Input
                    value={step.desc}
                    onChange={(e) => {
                      const next = [...steps];
                      next[i] = { ...step, desc: e.target.value };
                      setSteps(next);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSteps([...steps, { name: "", desc: "" }])}
              >
                Add step
              </Button>
              <Button
                onClick={() => saveSection("oem_process", { steps }, setSavingSteps)}
                disabled={savingSteps}
                size="sm"
              >
                {savingSteps ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save steps
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
