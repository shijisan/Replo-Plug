import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const topArticles = await prisma.article.findMany({
      orderBy: { views: 'desc' },
      take: 10,
    });

    return NextResponse.json(topArticles);
  } catch (error) {
    console.error("Error fetching top articles:", error);
    return NextResponse.json({ error: "Failed to fetch top articles" }, { status: 500 });
  }
}