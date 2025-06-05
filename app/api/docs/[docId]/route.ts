import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/docs/[docId]
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ docId: string }> }
): Promise<NextResponse> {
  const { docId } = await context.params; 

  if (!docId) {
    return NextResponse.json({ error: "Missing document ID" }, { status: 400 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: docId },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
