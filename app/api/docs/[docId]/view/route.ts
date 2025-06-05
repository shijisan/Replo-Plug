import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _: NextRequest,
  context: { params: Promise<{ docId: string }> }
): Promise<NextResponse> {
  const { docId } = await context.params;

  if (!docId) {
    return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
  }

  try {
    await prisma.article.update({
      where: { id: docId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ message: "View count incremented" }, { status: 200 });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
