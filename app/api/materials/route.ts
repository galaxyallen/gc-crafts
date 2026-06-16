import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { requireAuth } from "@/lib/api-auth";

import { assertHttpImageUrl, handleRouteError } from "@/lib/api-errors";

import { sanitizeString } from "@/lib/utils";



export async function GET() {

  try {

    const materials = await prisma.material.findMany({

      orderBy: { sortOrder: "asc" },

    });

    return NextResponse.json(materials);

  } catch (err) {

    return handleRouteError(err);

  }

}



export async function POST(request: NextRequest) {

  const { error } = await requireAuth(request);

  if (error) return error;



  try {

    const body = await request.json();

    const maxOrder = await prisma.material.aggregate({ _max: { sortOrder: true } });



    if (!body.image?.trim()) {

      return NextResponse.json({ error: "Image is required" }, { status: 400 });

    }



    assertHttpImageUrl(body.image, "Material image");



    const material = await prisma.material.create({

      data: {

        name: sanitizeString(body.name, 200),

        subtitle: sanitizeString(body.subtitle, 200),

        image: body.image.trim(),

        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,

      },

    });



    return NextResponse.json(material, { status: 201 });

  } catch (err) {

    return handleRouteError(err);

  }

}

