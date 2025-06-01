// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/articles - list all articles for the current user
export async function GET() {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  const articles = await prisma.article.findMany({
    // where: { authorId: user?.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(articles);


}

// POST /api/articles - create a new article
export async function POST(req: NextRequest) {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, keywords } = await req.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title,
      keywords: keywords || '',
      content: '',
      author: { connect: { id: user?.user.id } },
    },
  });

  return NextResponse.json(article, { status: 201 });
}