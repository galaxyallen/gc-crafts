import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function PUT(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const body: { id: number; sortOrder: number }[] = await request.json();

  await prisma.$transaction(
    body.map((item) =>
      prisma.material.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  return NextResponse.json({ success: true });
}
