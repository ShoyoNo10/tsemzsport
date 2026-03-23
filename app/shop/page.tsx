"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ShopFooter from "@/components/ShopFooter";
import ShopSearch from "@/components/ShopSearch";
import Header from "@/components/Header";

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
    <>
    <Header/>
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-28 pt-4 text-white">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* hero */}
        <div className="mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                Volleyball Shop
              </div>
            </div>
          </div>
        </div>

        {/* search */}
        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/10 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
          <ShopSearch value={search} onChange={setSearch} />
        </div>

        {/* categories */}
        <section
          id="categories"
          className="mb-8 rounded-[28px] border border-white/10 bg-white/10 text-left  backdrop-blur-xl p-4 text-white shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Ангилал</h2>
              <p className="mt-1 text-sm text-slate-500">
                Бараагаа ангиллаар нь хурдан олоорой
              </p>
            </div>

            {/* <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {categories.length}
            </div> */}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/shop/category/${category.slug}`}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-cyan-500 hover:bg-cyan-500 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        {/* products */}
        <section className="rounded-[28px] border border-white/10 bg-white/10 p-4 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Бүх бараа</h2>
              <p className="mt-1 text-sm text-slate-500">
                {search.trim()
                  ? `“${search}” хайлтаар ${filtered.length} бараа олдлоо`
                  : `${products.length} бараа байна`}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl">
                🔍
              </div>
              <p className="mt-4 text-lg font-bold text-slate-900">
                Бараа олдсонгүй
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Өөр түлхүүр үг ашиглаад дахин хайж үзээрэй.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <div
                  key={product._id}
                  className="group rounded-[24px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
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
    </>
  );
}