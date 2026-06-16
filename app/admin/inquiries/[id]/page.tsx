"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inquiry } from "@prisma/client";
import type { InquiryStatus } from "@/lib/types";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseJson } from "@/lib/utils";

type PageProps = { params: { id: string } };

function statusVariant(status: InquiryStatus): "default" | "success" | "secondary" {
  switch (status) {
    case "NEW":
      return "default";
    case "REPLIED":
      return "success";
    case "CLOSED":
      return "secondary";
  }
}

export default function InquiryDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<InquiryStatus>("NEW");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInquiry() {
      const res = await fetch(`/api/inquiries/${params.id}`);
      if (res.ok) {
        const data: Inquiry = await res.json();
        setInquiry(data);
        setNotes(data.notes ?? "");
        setStatus(data.status as InquiryStatus);
      }
      setLoading(false);
    }

    fetchInquiry();
  }, [params.id]);

  async function handleSave() {
    if (!inquiry) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const updated = await res.json();
      setInquiry(updated);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Topbar title="Inquiry Detail" />
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-t3">Loading...</p>
        </div>
      </>
    );
  }

  if (!inquiry) {
    return (
      <>
        <Topbar title="Inquiry Detail" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
          <p className="text-sm text-t3">Inquiry not found.</p>
          <Button variant="outline" asChild>
            <Link href="/admin/inquiries">Back to inquiries</Link>
          </Button>
        </div>
      </>
    );
  }

  const interests = parseJson<string[]>(inquiry.interests, []);
  const mailtoSubject = encodeURIComponent(`Re: GC CRAFTS inquiry from ${inquiry.company}`);
  const mailtoBody = encodeURIComponent(
    `Hi ${inquiry.name},\n\nThank you for your inquiry.\n\n`
  );

  return (
    <>
      <Topbar title="Inquiry Detail" />
      <div className="flex-1 space-y-6 p-6">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4" />
            Back to inquiries
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-t1">{inquiry.company}</h2>
            <p className="text-sm text-t2">
              {inquiry.name} · {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
          <Badge variant={statusVariant(inquiry.status as InquiryStatus)}>{inquiry.status}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-char-dd">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-t3">Email: </span>
                <a href={`mailto:${inquiry.email}`} className="text-gold hover:underline">
                  {inquiry.email}
                </a>
              </div>
              {inquiry.whatsapp && (
                <div>
                  <span className="text-t3">WhatsApp: </span>
                  <span className="text-t1">{inquiry.whatsapp}</span>
                </div>
              )}
              {inquiry.role && (
                <div>
                  <span className="text-t3">Role: </span>
                  <span className="text-t1">{inquiry.role}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-char-dd">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-t3">Interests: </span>
                <span className="text-t1">{interests.join(", ") || "—"}</span>
              </div>
              {inquiry.quantity && (
                <div>
                  <span className="text-t3">Quantity: </span>
                  <span className="text-t1">{inquiry.quantity}</span>
                </div>
              )}
              {inquiry.timeline && (
                <div>
                  <span className="text-t3">Timeline: </span>
                  <span className="text-t1">{inquiry.timeline}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {inquiry.message && (
          <Card className="bg-char-dd">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-t2">{inquiry.message}</p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-char-dd">
          <CardHeader>
            <CardTitle>Manage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                className="flex h-9 w-full max-w-xs rounded-sm border border-gold/10 bg-char-d px-3 text-sm text-t1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <option value="NEW">New</option>
                <option value="REPLIED">Replied</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes..."
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${inquiry.email}?subject=${mailtoSubject}&body=${mailtoBody}`}>
                  <Mail className="h-4 w-4" />
                  Reply via email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
