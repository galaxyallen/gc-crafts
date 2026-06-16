import { NextRequest, NextResponse } from "next/server";
import type { InquiryStatus } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeString } from "@/lib/utils";

type RouteParams = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const id = parseInt(params.id, 10);
  const inquiry = await prisma.inquiry.findUnique({ where: { id } });
  if (!inquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(inquiry);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const id = parseInt(params.id, 10);
  const body = await request.json();

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status as InquiryStatus }),
      ...(body.notes !== undefined && { notes: body.notes ? sanitizeString(body.notes, 5000) : null }),
    },
  });

  return NextResponse.json(inquiry);
}
