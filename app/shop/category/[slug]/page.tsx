"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ShopFooter from "@/components/ShopFooter";

export default function CategoryProductsPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/public/products?category=${params.slug}`);
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params.slug]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-28 pt-4 text-white">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* header */}
        <div className="mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
              >
                <span>←</span>
                <span>Буцах</span>
              </Link>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Ангиллын бараа
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                Сонгосон ангилалд хамаарах бүх бараа энд харагдана.
              </p>
            </div>

            {/* <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition duration-200 hover:scale-[1.02]"
            >
              Сагс
            </Link> */}
          </div>
        </div>

        {/* content */}
        <section className="rounded-[28px] border border-white/10 bg-white/95 p-4 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Барааны жагсаалт</h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Уншиж байна..."
                  : `${products.length} бараа олдлоо`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm"
                >
                  <div className="aspect-square animate-pulse rounded-[18px] bg-slate-200" />
                  <div className="space-y-2 p-2">
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="h-5 w-1/2 animate-pulse rounded bg-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl">
                📦
              </div>
              <p className="mt-4 text-lg font-bold text-slate-900">
                Бараа олдсонгүй
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Энэ ангилалд одоогоор бараа нэмэгдээгүй байна.
              </p>

              <Link
                href="/shop"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Дэлгүүр рүү буцах
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>

      <ShopFooter />
    </main>
  );
}