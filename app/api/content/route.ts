import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.pageContent.findMany();
  return NextResponse.json(sections);
}
