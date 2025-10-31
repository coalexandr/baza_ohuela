"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Cat = { name: string; count?: number };

export default function CategoriesBar() {
  const [cats, setCats] = useState<Cat[]>([]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        const items: string[] = d.items || [];
        const out = items.map((name: string) => ({ name, count: d.counts?.[name] }))
        if (active) setCats(out);
      })
      .catch(() => {});
    return () => { active = false; controller.abort(); };
  }, []);

  if (!cats.length) return null;

  return (
    <div className="bg-white/80 backdrop-blur border-b">
      <div className="container mx-auto px-4 py-2 overflow-x-auto">
        <div className="flex gap-2 min-w-full">
          {cats.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border hover:bg-gray-50 text-sm"
            >
              {c.name}{typeof c.count === 'number' ? ` (${c.count})` : ''}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

