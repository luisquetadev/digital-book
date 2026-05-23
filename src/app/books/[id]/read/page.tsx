"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  chapters: Chapter[];
}

export default function ReadBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const fetchBook = useCallback(async () => {
    try {
      const res = await fetch(`/api/books/${id}`);
      if (res.ok) {
        setBook(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!book || book.chapters.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Sem conteúdo para ler</h1>
        <Link href={`/books/${id}`} className="mt-4 text-blue-600 hover:underline">
          Voltar ao livro
        </Link>
      </div>
    );
  }

  const chapter = book.chapters[currentChapterIndex];
  const hasPrev = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < book.chapters.length - 1;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 border-b border-amber-200 bg-amber-50/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link
            href={`/books/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            ← {book.title}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {currentChapterIndex + 1} / {book.chapters.length}
            </span>
            <a
              href={`/api/books/${id}/pdf`}
              className="rounded bg-zinc-200 px-3 py-1 text-xs font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              PDF
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-2 text-sm font-medium text-amber-700 dark:text-amber-500">
          Capítulo {chapter.order}
        </div>
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
          {chapter.title}
        </h1>
        <div className="prose prose-lg max-w-none text-zinc-800 dark:text-zinc-300">
          {chapter.content.split("\n").map((paragraph, i) =>
            paragraph.trim() ? (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ) : (
              <br key={i} />
            )
          )}
        </div>
      </main>

      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <button
          onClick={() => {
            setCurrentChapterIndex((i) => i - 1);
            window.scrollTo(0, 0);
          }}
          disabled={!hasPrev}
          className="rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-300 disabled:opacity-30 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          ← Anterior
        </button>

        <select
          value={currentChapterIndex}
          onChange={(e) => {
            setCurrentChapterIndex(Number(e.target.value));
            window.scrollTo(0, 0);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {book.chapters.map((ch, i) => (
            <option key={ch.id} value={i}>
              {ch.order}. {ch.title}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setCurrentChapterIndex((i) => i + 1);
            window.scrollTo(0, 0);
          }}
          disabled={!hasNext}
          className="rounded-lg bg-zinc-200 px-5 py-2.5 text-sm font-medium transition hover:bg-zinc-300 disabled:opacity-30 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          Seguinte →
        </button>
      </div>
    </div>
  );
}
