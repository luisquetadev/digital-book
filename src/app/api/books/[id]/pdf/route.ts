import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

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
    return NextResponse.json(
      { error: "Livro não encontrado" },
      { status: 404 }
    );
  }

  const chunks: Buffer[] = [];

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    info: {
      Title: book.title,
      Author: book.author,
    },
  });

  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const pdfReady = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // Cover page
  doc.moveDown(8);
  doc.fontSize(32).font("Helvetica-Bold").text(book.title, { align: "center" });
  doc.moveDown(1);
  doc.fontSize(18).font("Helvetica").text(book.author, { align: "center" });

  if (book.description) {
    doc.moveDown(2);
    doc
      .fontSize(12)
      .font("Helvetica-Oblique")
      .text(book.description, { align: "center" });
  }

  // Table of contents
  if (book.chapters.length > 0) {
    doc.addPage();
    doc.fontSize(24).font("Helvetica-Bold").text("Índice", { align: "center" });
    doc.moveDown(2);

    for (const chapter of book.chapters) {
      doc
        .fontSize(14)
        .font("Helvetica")
        .text(`${chapter.order}. ${chapter.title}`, {
          align: "left",
        });
      doc.moveDown(0.5);
    }
  }

  // Chapters
  for (const chapter of book.chapters) {
    doc.addPage();
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(`Capítulo ${chapter.order}: ${chapter.title}`);
    doc.moveDown(1);

    const paragraphs = chapter.content.split("\n");
    for (const paragraph of paragraphs) {
      if (paragraph.trim()) {
        doc.fontSize(12).font("Helvetica").text(paragraph.trim(), {
          align: "justify",
          lineGap: 4,
        });
        doc.moveDown(0.5);
      }
    }
  }

  doc.end();

  const pdfBuffer = await pdfReady;

  const safeTitle = book.title.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
    },
  });
}
