import { NextRequest, NextResponse } from "next/server";

export { dynamic } from "@/lib/api-dynamic";

import type { InquiryStatus } from "@/lib/types";

import { prisma } from "@/lib/prisma";

import { requireAuth } from "@/lib/api-auth";

import { handleRouteError } from "@/lib/api-errors";

import { sanitizeString } from "@/lib/utils";



type RouteParams = { params: { id: string } };



export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth(request);

  if (error) return error;



  try {

    const id = parseInt(params.id, 10);

    if (isNaN(id)) {

      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    }



    const inquiry = await prisma.inquiry.findUnique({ where: { id } });

    if (!inquiry) {

      return NextResponse.json({ error: "Not found" }, { status: 404 });

    }



    return NextResponse.json(inquiry);

  } catch (err) {

    return handleRouteError(err);

  }

}



export async function PUT(request: NextRequest, { params }: RouteParams) {

  const { error } = await requireAuth(request);

  if (error) return error;



  try {

    const id = parseInt(params.id, 10);

    if (isNaN(id)) {

      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    }



    const body = await request.json();



    const inquiry = await prisma.inquiry.update({

      where: { id },

      data: {

        ...(body.status && { status: body.status as InquiryStatus }),

        ...(body.notes !== undefined && { notes: body.notes ? sanitizeString(body.notes, 5000) : null }),

      },

    });



    return NextResponse.json(inquiry);

  } catch (err) {

    return handleRouteError(err);

  }

}

