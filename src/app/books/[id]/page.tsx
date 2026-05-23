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
  description: string;
  coverColor: string;
  chapters: Chapter[];
  updatedAt: string;
}

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!confirm("Tem a certeza que deseja eliminar este livro?")) return;
    setDeleting(true);
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Livro não encontrado</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div
        className="px-6 py-12"
        style={{ backgroundColor: book.coverColor }}
      >
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-white/80 hover:text-white"
          >
            ← Voltar
          </Link>
          <h1 className="text-4xl font-bold text-white drop-shadow-md">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-white/80">{book.author}</p>
          {book.description && (
            <p className="mt-3 max-w-2xl text-white/70">{book.description}</p>
          )}
          <div className="mt-6 flex gap-3">
            <Link
              href={`/books/${id}/edit`}
              className="rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
            >
              ✏️ Editar
            </Link>
            {book.chapters.length > 0 && (
              <>
                <Link
                  href={`/books/${id}/read`}
                  className="rounded-lg bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/30"
                >
                  📖 Ler
                </Link>
                <a
                  href={`/api/books/${id}/pdf`}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
                >
                  📄 Exportar PDF
                </a>
              </>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-500/80 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? "A eliminar..." : "🗑️ Eliminar"}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="mb-6 text-xl font-bold">
          Capítulos ({book.chapters.length})
        </h2>
        {book.chapters.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
            <p className="text-zinc-500">Nenhum capítulo ainda.</p>
            <Link
              href={`/books/${id}/edit`}
              className="mt-3 inline-block text-blue-600 hover:underline"
            >
              Adicionar capítulos →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {book.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {chapter.order}. {chapter.title}
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {chapter.content.length} caracteres
                  </span>
                </div>
                {chapter.content && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                    {chapter.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
