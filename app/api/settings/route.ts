import { NextRequest, NextResponse } from "next/server";

export { dynamic } from "@/lib/api-dynamic";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import { requireAuth } from "@/lib/api-auth";

import { handleRouteError } from "@/lib/api-errors";

import { sanitizeString } from "@/lib/utils";
import { revalidatePublicSite } from "@/lib/revalidate-site";



export async function GET() {

  try {

    const settings = await prisma.setting.findMany();

    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    return NextResponse.json(map);

  } catch (err) {

    return handleRouteError(err);

  }

}



export async function PUT(request: NextRequest) {

  const { session, error } = await requireAuth(request);

  if (error) return error;



  try {

    const body = await request.json();



    if (body.passwordChange) {

      const { currentPassword, newPassword, confirmPassword } = body.passwordChange;

      if (newPassword !== confirmPassword) {

        return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });

      }



      const admin = await prisma.admin.findUnique({

        where: { email: session!.user.email! },

      });



      if (!admin) {

        return NextResponse.json({ error: "Admin not found" }, { status: 404 });

      }



      const valid = await bcrypt.compare(currentPassword, admin.password);

      if (!valid) {

        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

      }



      const hashed = await bcrypt.hash(newPassword, 12);

      await prisma.admin.update({

        where: { id: admin.id },

        data: { password: hashed },

      });



      return NextResponse.json({ success: true });

    }



    const settings = body.settings as Record<string, string>;

    if (settings) {

      await prisma.$transaction(

        Object.entries(settings).map(([key, value]) =>

          prisma.setting.upsert({

            where: { key },

            update: { value: sanitizeString(value, 500) },

            create: { key, value: sanitizeString(value, 500) },

          })

        )

      );
    }

    revalidatePublicSite(["/", "/contact"]);

    return NextResponse.json({ success: true });

  } catch (err) {

    return handleRouteError(err);

  }

}

