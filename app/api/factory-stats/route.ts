import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeString } from "@/lib/utils";

export async function GET() {
  const stats = await prisma.factoryStat.findMany();
  return NextResponse.json(stats);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body: { key: string; value: string; label: string }[] = await request.json();

  await prisma.$transaction(
    body.map((stat) =>
      prisma.factoryStat.upsert({
        where: { key: stat.key },
        update: { value: sanitizeString(stat.value, 100), label: sanitizeString(stat.label, 200) },
        create: { key: stat.key, value: sanitizeString(stat.value, 100), label: sanitizeString(stat.label, 200) },
      })
    )
  );

  return NextResponse.json({ success: true });
}
