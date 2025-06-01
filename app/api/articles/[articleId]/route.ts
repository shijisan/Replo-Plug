// app/api/articles/[articleId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';


// GET /api/articles/:articleId
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ articleId: string }> }
) {
  const params = await context.params;
  const user = await auth();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const article = await prisma.article.findUnique({
    where: { id: params.articleId },
  });

  if (!article || article.authorId !== user.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(article);
}

// PATCH /api/articles/:articleId - update content
export async function PATCH(
  req: NextRequest,
  { params }: { params: { articleId: string } }
) {
  const user = await auth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { articleId } = params;
  const { content } = await req.json();
  if (content == null || typeof content !== 'string') {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  const existing = await prisma.article.findUnique({
    where: { id: articleId },
  });
  if (!existing || existing.authorId !== user?.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.article.update({
    where: { id: articleId },
    data: { content },
  });

  return NextResponse.json(updated);
}

// DELETE /api/articles/:articleId - optional
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const resolvedParams = await params;
  const user = await auth();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { articleId } = resolvedParams;
  const existing = await prisma.article.findUnique({
    where: { id: articleId },
  });
  
  if (!existing || existing.authorId !== user?.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.article.delete({ where: { id: articleId } });
  return NextResponse.json({ success: true });
}