import { NextRequest, NextResponse } from "next/server";

export { dynamic } from "@/lib/api-dynamic";

import { prisma } from "@/lib/prisma";

import { requireAuth } from "@/lib/api-auth";

import { handleRouteError } from "@/lib/api-errors";

import { sanitizeString } from "@/lib/utils";
import { revalidatePublicSite } from "@/lib/revalidate-site";



export async function GET() {

  try {

    const stats = await prisma.factoryStat.findMany();

    return NextResponse.json(stats);

  } catch (err) {

    return handleRouteError(err);

  }

}



export async function PUT(request: NextRequest) {

  const { error } = await requireAuth(request);

  if (error) return error;



  try {

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

    revalidatePublicSite(["/", "/oem"]);

    return NextResponse.json({ success: true });

  } catch (err) {

    return handleRouteError(err);

  }

}

