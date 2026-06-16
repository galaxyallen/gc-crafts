import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { assertHttpImageUrl, handleRouteError } from "@/lib/api-errors";
import { sanitizeString } from "@/lib/utils";

type RouteParams = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body.image) assertHttpImageUrl(body.image, "Material image");

    const material = await prisma.material.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: sanitizeString(body.name, 200) }),
        ...(body.subtitle !== undefined && { subtitle: sanitizeString(body.subtitle, 200) }),
        ...(body.image !== undefined && { image: body.image.trim() }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });

    return NextResponse.json(material);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
