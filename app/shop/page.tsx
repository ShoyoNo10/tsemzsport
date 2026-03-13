"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ShopFooter from "@/components/ShopFooter";
import ShopSearch from "@/components/ShopSearch";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/public/products"),
        fetch("/api/public/categories"),
      ]);

      const productsData = (await productsResponse.json()) as Product[];
      const categoriesData = (await categoriesResponse.json()) as Category[];

      setProducts(productsData);
      setCategories(categoriesData);
    };

    void load();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return products;
    }

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
  }, [products, search]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-28 pt-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-5 rounded-[28px] bg-black px-5 py-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                Shop
              </p>
              <h1 className="text-2xl font-black sm:text-3xl">Дэлгүүр</h1>
              <p className="mt-2 text-sm text-white/70">
                Өөрт хэрэгтэй бараагаа хурдан хайж, ангиллаар нь сонгоорой.
              </p>
            </div>

            <Link
              href="/cart"
              className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              Сагс
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <ShopSearch value={search} onChange={setSearch} />
        </div>

        <section
          id="categories"
          className="mb-8 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ангилал</h2>
              <p className="text-sm text-gray-500">
                Бараагаа ангиллаар нь хурдан олоорой
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {categories.length}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/shop/category/${category.slug}`}
                className="whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-black hover:bg-black hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Бүх бараа</h2>
              <p className="text-sm text-gray-500">
                {search.trim()
                  ? `“${search}” хайлтаар ${filtered.length} бараа олдлоо`
                  : `${products.length} бараа байна`}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-900">
                Бараа олдсонгүй
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Өөр түлхүүр үг ашиглаад дахин хайж үзээрэй.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <div
                  key={product._id}
                  className="rounded-[22px] border border-gray-100 bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ShopFooter />
    </main>
  );
}