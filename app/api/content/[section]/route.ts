import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeString } from "@/lib/utils";

type RouteParams = { params: { section: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const content = await prisma.pageContent.findUnique({
    where: { section: params.section },
  });

  if (!content) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(content);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const body = await request.json();

  const content = await prisma.pageContent.upsert({
    where: { section: params.section },
    update: {
      ...(body.title !== undefined && { title: body.title ? sanitizeString(body.title, 500) : null }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle ? sanitizeString(body.subtitle, 500) : null }),
      ...(body.body !== undefined && { body: body.body ? sanitizeString(body.body, 10000) : null }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.metadata !== undefined && { metadata: typeof body.metadata === "string" ? body.metadata : JSON.stringify(body.metadata) }),
    },
    create: {
      section: params.section,
      title: body.title ? sanitizeString(body.title, 500) : null,
      subtitle: body.subtitle ? sanitizeString(body.subtitle, 500) : null,
      body: body.body ? sanitizeString(body.body, 10000) : null,
      image: body.image ?? null,
      metadata: body.metadata ? (typeof body.metadata === "string" ? body.metadata : JSON.stringify(body.metadata)) : null,
    },
  });

  return NextResponse.json(content);
}
