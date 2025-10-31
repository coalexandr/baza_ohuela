"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [cats, setCats] = useState<{name: string, count?: number}[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [hydrated, setHydrated] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [brand, setBrand] = useState<string | 'all'>('all');

  // Initialize state from URL on first render
  // Hydrate state from URL and respond to URL changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'name';
    const p = parseInt(searchParams.get('page') || '1', 10);
    const ps = parseInt(searchParams.get('pageSize') || '30', 10);
    const disc = searchParams.get('discounted') === 'true';
    const br = searchParams.get('brand') || 'all';
    const np = Number.isFinite(p) && p > 0 ? p : 1;
    const nps = Number.isFinite(ps) && ps > 0 ? Math.min(ps, 100) : 30;
    let changed = false;
    if (searchTerm !== q) { setSearchTerm(q); changed = true; }
    if (selectedCategory !== cat) { setSelectedCategory(cat); changed = true; }
    if (sortBy !== sort) { setSortBy(sort); changed = true; }
    if (page !== np) { setPage(np); changed = true; }
    if (pageSize !== nps) { setPageSize(nps); changed = true; }
    if (discountOnly !== disc) { setDiscountOnly(disc); changed = true; }
    if (brand !== br) { setBrand(br as any); changed = true; }
    if (!hydrated) setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce search term to reduce API requests while typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/categories', { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        const items: string[] = d.items || []
        const out = items.map((name: string) => ({ name, count: d.counts?.[name] }))
        setCats(out)
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Keep URL in sync when filters change
  useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams();
    if (debouncedTerm) params.set('q', debouncedTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    if (page > 1) params.set('page', String(page));
    if (pageSize !== 30) params.set('pageSize', String(pageSize));
    if (discountOnly) params.set('discounted', 'true');
    if (brand !== 'all') params.set('brand', brand);
    const qs = params.toString();
    const target = qs ? `/products?${qs}` : '/products';
    const current = window.location.pathname + (window.location.search || '');
    if (current !== target) router.replace(target);
  }, [debouncedTerm, selectedCategory, sortBy, page, pageSize, router, hydrated]);

  // Fetch products when filters or pagination change
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (debouncedTerm) params.set('q', debouncedTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy) params.set('sort', sortBy);
    params.set('limit', String(pageSize));
    params.set('offset', String((page - 1) * pageSize));
    if (discountOnly) params.set('discounted', 'true');
    if (brand !== 'all') params.set('brand', brand);
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal, cache: 'no-store' as RequestCache })
      .then(r => r.json())
      .then(d => { setItems(d.items || []); setTotal(d.total || 0); })
      .catch(() => {});
    return () => controller.abort();
  }, [debouncedTerm, selectedCategory, sortBy, page, pageSize, brand]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Каталог товаров
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Фильтры
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Поиск по товарам
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setPage(1); setItems([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории{cats.length ? ` (${cats.reduce((a,b)=>a+(b.count||0),0)})` : ''}</SelectItem>
                  {cats.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}{typeof c.count==='number' ? ` (${c.count})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Название (А-Я)</SelectItem>
                  <SelectItem value="price-low">Цена (по возрастанию)</SelectItem>
                  <SelectItem value="price-high">Цена (по убыванию)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Найдено: {total} товаров
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">Ничего не найдено. Измените запрос или фильтры.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      {/* Discount filter */}
      <div className="mt-6 flex items-center justify-center">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={discountOnly} onChange={(e) => { setDiscountOnly(e.target.checked); setPage(1); setItems([]); }} />
          Только со скидкой
        </label>
      </div>
      {/* Page size + Show more + Pagination */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Показывать по:</span>
          {[30,60,90].map(sz => (
            <button
              key={sz}
              className={`px-3 py-1 rounded-md border text-sm ${pageSize===sz ? 'bg-blue-600 text-white border-blue-600' : ''}`}
              onClick={() => { setPageSize(sz); setPage(1); setItems([]); }}
            >
              {sz}
            </button>
          ))}
        </div>
        {page < totalPages && (
          <button
            className="px-4 py-2 rounded-md border text-sm bg-gray-50 hover:bg-gray-100"
            onClick={async () => {
              const nextPage = page + 1
              const params = new URLSearchParams();
              if (searchTerm) params.set('q', searchTerm);
              if (selectedCategory !== 'all') params.set('category', selectedCategory);
              if (sortBy) params.set('sort', sortBy);
              params.set('limit', String(pageSize));
              params.set('offset', String((nextPage - 1) * pageSize));
              try {
                const r = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' as RequestCache })
                const d = await r.json()
                setItems(prev => [...prev, ...(d.items || [])])
                setPage(nextPage)
              } catch {}
            }}
          >
            Показать ещё
          </button>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Назад
          </button>
          {Array.from({ length: Math.min(7, totalPages) }).map((_, idx) => {
            let label = String(idx + 1);
            let target = idx + 1;
            // If too many pages, show first, current neighbors, last
            if (totalPages > 7) {
              const pages = new Set<number>([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1].filter(n => n >= 1 && n <= totalPages));
              const sorted = Array.from(pages).sort((a,b)=>a-b);
              label = sorted[idx] ? String(sorted[idx]) : '';
              target = sorted[idx] || page;
              if (!label) return null;
            }
            return (
              <button
                key={label}
                className={`px-3 py-2 rounded-md border text-sm ${page === target ? 'bg-blue-600 text-white border-blue-600' : ''}`}
                onClick={() => setPage(target)}
              >
                {label}
              </button>
            );
          })}
          <button
            className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
