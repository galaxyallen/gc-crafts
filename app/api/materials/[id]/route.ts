import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeString } from "@/lib/utils";

type RouteParams = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const id = parseInt(params.id, 10);
  const body = await request.json();

  const material = await prisma.material.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: sanitizeString(body.name, 200) }),
      ...(body.subtitle !== undefined && { subtitle: sanitizeString(body.subtitle, 200) }),
      ...(body.image !== undefined && { image: sanitizeString(body.image, 2048) }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json(material);
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const id = parseInt(params.id, 10);
  await prisma.material.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
