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
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const fetchBook = useCallback(async () => {
    try {
      const res = await fetch(`/api/books/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data);
        if (!activeChapterId && data.chapters.length > 0) {
          setActiveChapterId(data.chapters[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [id, activeChapterId]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  async function handleSaveBook() {
    if (!book) return;
    setSaving(true);
    try {
      await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          description: book.description,
          coverColor: book.coverColor,
        }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleAddChapter() {
    if (!newChapterTitle.trim()) return;
    const res = await fetch(`/api/books/${id}/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newChapterTitle }),
    });
    if (res.ok) {
      const chapter = await res.json();
      setBook((prev) =>
        prev
          ? { ...prev, chapters: [...prev.chapters, chapter] }
          : null
      );
      setActiveChapterId(chapter.id);
      setNewChapterTitle("");
    }
  }

  async function handleSaveChapter(chapter: Chapter) {
    await fetch(`/api/books/${id}/chapters/${chapter.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: chapter.title,
        content: chapter.content,
        order: chapter.order,
      }),
    });
  }

  async function handleDeleteChapter(chapterId: string) {
    if (!confirm("Eliminar este capítulo?")) return;
    await fetch(`/api/books/${id}/chapters/${chapterId}`, {
      method: "DELETE",
    });
    setBook((prev) => {
      if (!prev) return null;
      const chapters = prev.chapters.filter((c) => c.id !== chapterId);
      return { ...prev, chapters };
    });
    if (activeChapterId === chapterId) {
      setActiveChapterId(book?.chapters[0]?.id ?? null);
    }
  }

  function updateChapterLocally(chapterId: string, updates: Partial<Chapter>) {
    setBook((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((c) =>
          c.id === chapterId ? { ...c, ...updates } : c
        ),
      };
    });
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
          Voltar
        </Link>
      </div>
    );
  }

  const activeChapter = book.chapters.find((c) => c.id === activeChapterId);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="flex w-80 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <Link
            href={`/books/${id}`}
            className="mb-3 inline-block text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            ← Voltar ao livro
          </Link>
          <input
            type="text"
            value={book.title}
            onChange={(e) =>
              setBook((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
            className="mb-2 w-full rounded border border-zinc-300 px-3 py-2 text-sm font-bold focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            type="text"
            value={book.author}
            onChange={(e) =>
              setBook((prev) =>
                prev ? { ...prev, author: e.target.value } : null
              )
            }
            className="mb-2 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="Autor"
          />
          <textarea
            value={book.description}
            onChange={(e) =>
              setBook((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
            rows={2}
            className="mb-2 w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            placeholder="Descrição"
          />
          <div className="mb-3 flex gap-1.5">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  setBook((prev) =>
                    prev ? { ...prev, coverColor: color } : null
                  )
                }
                className={`h-6 w-6 rounded-full border-2 ${
                  book.coverColor === color
                    ? "border-zinc-900 dark:border-white"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            onClick={handleSaveBook}
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "A guardar..." : "Guardar Detalhes"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Capítulos
          </h3>
          <div className="space-y-1">
            {book.chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  activeChapterId === chapter.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="truncate">
                  {chapter.order}. {chapter.title}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddChapter();
              }}
              placeholder="Título do capítulo"
              className="flex-1 rounded border border-zinc-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              onClick={handleAddChapter}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>
        </div>
      </aside>

      {/* Editor */}
      <main className="flex flex-1 flex-col">
        {activeChapter ? (
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <input
                type="text"
                value={activeChapter.title}
                onChange={(e) =>
                  updateChapterLocally(activeChapter.id, {
                    title: e.target.value,
                  })
                }
                className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm font-semibold focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              />
              <button
                onClick={() => handleSaveChapter(activeChapter)}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Guardar
              </button>
              <button
                onClick={() => handleDeleteChapter(activeChapter.id)}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40"
              >
                Eliminar
              </button>
            </div>
            <textarea
              value={activeChapter.content}
              onChange={(e) =>
                updateChapterLocally(activeChapter.id, {
                  content: e.target.value,
                })
              }
              className="flex-1 resize-none px-8 py-6 text-base leading-relaxed focus:outline-none dark:bg-zinc-950"
              placeholder="Escreva o conteúdo do capítulo aqui..."
            />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-zinc-400">
            <div className="text-center">
              <div className="mb-3 text-4xl">✍️</div>
              <p>Seleccione ou crie um capítulo para começar a escrever.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
