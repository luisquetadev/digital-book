import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: { chapters: { orderBy: { order: "asc" } } },
  });
  if (!book) {
    return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const book = await prisma.book.update({
    where: { id },
    data: {
      title: body.title,
      author: body.author,
      description: body.description,
      coverColor: body.coverColor,
    },
  });
  return NextResponse.json(book);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.book.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
