import { NextRequest, NextResponse } from "next/server";
import type { InquiryStatus } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { handleRouteError } from "@/lib/api-errors";
import { sendInquiryNotification } from "@/lib/email";
import { parseJson, sanitizeString } from "@/lib/utils";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const status = request.nextUrl.searchParams.get("status") as InquiryStatus | null;

    const inquiries = await prisma.inquiry.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    if (!body.company || !body.name || !body.email) {
      return NextResponse.json({ error: "Company, name, and email are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const interests = Array.isArray(body.interests) ? body.interests : [];

    const inquiry = await prisma.inquiry.create({
      data: {
        company: sanitizeString(body.company, 200),
        name: sanitizeString(body.name, 200),
        email: sanitizeString(body.email, 200),
        whatsapp: body.whatsapp ? sanitizeString(body.whatsapp, 50) : null,
        role: body.role ? sanitizeString(body.role, 100) : null,
        interests: JSON.stringify(interests),
        quantity: body.quantity ? sanitizeString(body.quantity, 100) : null,
        timeline: body.timeline ? sanitizeString(body.timeline, 100) : null,
        message: body.message ? sanitizeString(body.message, 5000) : null,
      },
    });

    try {
      await sendInquiryNotification({
        company: inquiry.company,
        name: inquiry.name,
        email: inquiry.email,
        whatsapp: inquiry.whatsapp,
        role: inquiry.role,
        interests,
        quantity: inquiry.quantity,
        timeline: inquiry.timeline,
        message: inquiry.message,
      });
    } catch (e) {
      console.error("Failed to send email:", e);
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    return handleRouteError(err);
  }
}
