import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
   const { term } = await req.json();
   const fetchedDocs = await prisma.article.findMany({
      where: {
         OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { keywords: { contains: term, mode: 'insensitive' } },
         ],
      },
      take: 10,
      orderBy: {
         createdAt: 'desc'
      }
   });

   return NextResponse.json(fetchedDocs);

};