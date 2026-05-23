import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const { chapterId } = await params;
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
  });
  if (!chapter) {
    return NextResponse.json(
      { error: "Capítulo não encontrado" },
      { status: 404 }
    );
  }
  return NextResponse.json(chapter);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const { chapterId } = await params;
  const body = await request.json();
  const chapter = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      title: body.title,
      content: body.content,
      order: body.order,
    },
  });
  return NextResponse.json(chapter);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  const { chapterId } = await params;
  await prisma.chapter.delete({ where: { id: chapterId } });
  return NextResponse.json({ success: true });
}
