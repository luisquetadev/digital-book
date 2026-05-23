import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const books = await prisma.book.findMany({
    include: { chapters: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const body = await request.json();
  const book = await prisma.book.create({
    data: {
      title: body.title,
      author: body.author,
      description: body.description ?? "",
      coverColor: body.coverColor ?? "#3b82f6",
    },
  });
  return NextResponse.json(book, { status: 201 });
}
