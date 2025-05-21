import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, rating, feedback } = await req.json();
    if (!name || !email || !rating || !feedback) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await prisma.feedback.create({
      data: {
        name,
        email,
        rating,
        feedback,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error receiving FEEDBACK:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
