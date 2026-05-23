import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapters = await prisma.chapter.findMany({
    where: { bookId: id },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(chapters);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const lastChapter = await prisma.chapter.findFirst({
    where: { bookId: id },
    orderBy: { order: "desc" },
  });

  const chapter = await prisma.chapter.create({
    data: {
      title: body.title,
      content: body.content ?? "",
      order: body.order ?? (lastChapter ? lastChapter.order + 1 : 1),
      bookId: id,
    },
  });
  return NextResponse.json(chapter, { status: 201 });
}
