import { prisma } from "@/lib/db/prisma";
import { logger } from "@/lib/logger";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await prisma.messages.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error receiving HELP message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
