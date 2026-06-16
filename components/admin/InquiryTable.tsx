import Link from "next/link";
import { Inquiry } from "@prisma/client";
import type { InquiryStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { parseJson } from "@/lib/utils";

interface InquiryTableProps {
  inquiries: Inquiry[];
  showActions?: boolean;
}

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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function InquiryTable({ inquiries, showActions = true }: InquiryTableProps) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-lg border border-gold/5 bg-char-dd px-6 py-12 text-center text-sm text-t3">
        No inquiries found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gold/5 bg-char-dd">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/5 text-left text-xs uppercase tracking-wider text-t3">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Interests</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {showActions && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => {
              const interests = parseJson<string[]>(inquiry.interests, []);
              return (
                <tr key={inquiry.id} className="border-b border-gold/5 last:border-0 hover:bg-char-d/50">
                  <td className="whitespace-nowrap px-4 py-3 text-t2">{formatDate(inquiry.createdAt)}</td>
                  <td className="px-4 py-3 text-t1">{inquiry.company}</td>
                  <td className="px-4 py-3">
                    <div className="text-t1">{inquiry.name}</div>
                    <div className="text-xs text-t3">{inquiry.email}</div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-t2">
                    {interests.length > 0 ? interests.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(inquiry.status as InquiryStatus)}>{inquiry.status}</Badge>
                  </td>
                  {showActions && (
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="text-gold hover:text-gold-l hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
