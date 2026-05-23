"use client";

import { useEffect, useState, useCallback } from "react";
import BookCard from "@/components/BookCard";
import CreateBookModal from "@/components/CreateBookModal";

interface Chapter {
  id: string;
  title: string;
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

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              📚 Livro Digital
            </h1>
            <p className="text-sm text-zinc-500">
              Crie, edite e exporte os seus livros em PDF
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Novo Livro
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-6xl">📖</div>
            <h2 className="text-xl font-semibold">Nenhum livro ainda</h2>
            <p className="mt-2 text-zinc-500">
              Comece por criar o seu primeiro livro digital.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Criar Primeiro Livro
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                description={book.description}
                coverColor={book.coverColor}
                chaptersCount={book.chapters.length}
                updatedAt={book.updatedAt}
              />
            ))}
          </div>
        )}
      </main>

      <CreateBookModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchBooks}
      />
    </div>
  );
}
