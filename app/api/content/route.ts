import { NextResponse } from "next/server";
export { dynamic } from "@/lib/api-dynamic";
import { prisma } from "@/lib/prisma";
import { handleRouteError } from "@/lib/api-errors";

export async function GET() {
  try {
    const sections = await prisma.pageContent.findMany();
    return NextResponse.json(sections);
  } catch (err) {
    return handleRouteError(err);
  }
}
