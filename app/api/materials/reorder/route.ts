import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { handleRouteError } from "@/lib/api-errors";

export async function PUT(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body: { id: number; sortOrder: number }[] = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Invalid reorder payload" }, { status: 400 });
    }

    await prisma.$transaction(
      body.map((item) =>
        prisma.material.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
