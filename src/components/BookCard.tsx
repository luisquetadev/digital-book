"use client";

import Link from "next/link";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  description: string;
  coverColor: string;
  chaptersCount: number;
  updatedAt: string;
}

export default function BookCard({
  id,
  title,
  author,
  description,
  coverColor,
  chaptersCount,
  updatedAt,
}: BookCardProps) {
  return (
    <Link
      href={`/books/${id}`}
      className="group block rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        className="flex h-48 items-end rounded-t-xl p-6"
        style={{ backgroundColor: coverColor }}
      >
        <h3 className="text-xl font-bold text-white drop-shadow-md">
          {title}
        </h3>
      </div>
      <div className="p-5">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {author}
        </p>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-500">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
          <span>
            {chaptersCount} {chaptersCount === 1 ? "capítulo" : "capítulos"}
          </span>
          <span>
            {new Date(updatedAt).toLocaleDateString("pt-PT")}
          </span>
        </div>
      </div>
    </Link>
  );
}
