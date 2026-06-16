import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { parseJson } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Date", "Company", "Name", "Email", "WhatsApp", "Role", "Interests", "Qty", "Timeline", "Message", "Status"];
  const rows = inquiries.map((i) => [
    i.createdAt.toISOString(),
    i.company,
    i.name,
    i.email,
    i.whatsapp ?? "",
    i.role ?? "",
    parseJson<string[]>(i.interests, []).join("; "),
    i.quantity ?? "",
    i.timeline ?? "",
    (i.message ?? "").replace(/"/g, '""'),
    i.status,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const date = new Date().toISOString().split("T")[0];

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=inquiries-${date}.csv`,
    },
  });
}
