"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@prisma/client";
import type { InquiryStatus } from "@/lib/types";
import { Download } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { InquiryTable } from "@/components/admin/InquiryTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUSES: { value: InquiryStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "REPLIED", label: "Replied" },
  { value: "CLOSED", label: "Closed" },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [status, setStatus] = useState<InquiryStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      setLoading(true);
      const url =
        status === "ALL" ? "/api/inquiries" : `/api/inquiries?status=${status}`;
      const res = await fetch(url);
      if (res.ok) {
        setInquiries(await res.json());
      }
      setLoading(false);
    }

    fetchInquiries();
  }, [status]);

  return (
    <>
      <Topbar title="Inquiries" />
      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 rounded-sm border border-gold/10 bg-char-d p-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider transition-colors",
                  status === s.value ? "bg-gold/10 text-gold" : "text-t3 hover:text-t1"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" asChild>
            <a href="/api/inquiries/export">
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-t3">Loading inquiries...</p>
        ) : (
          <InquiryTable inquiries={inquiries} />
        )}
      </div>
    </>
  );
}
