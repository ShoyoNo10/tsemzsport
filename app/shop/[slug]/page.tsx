"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import QuantitySelector from "@/components/QuantitySelector";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch(`/api/public/products/${params.slug}`);

      if (!response.ok) {
        setProduct(null);
        return;
      }

      const data = (await response.json()) as Product;
      setProduct(data);
    };

    void load();
  }, [params.slug]);

  if (!product) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 sm:py-8">
        <div className="absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-[-120px] top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-10 w-28 rounded-full bg-white/10" />
            <div className="h-10 w-24 rounded-full bg-white/10" />
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="grid md:grid-cols-2">
              <div className="aspect-square bg-white/10" />
              <div className="space-y-4 p-5 sm:p-8">
                <div className="h-4 w-28 rounded bg-white/10" />
                <div className="h-10 w-3/4 rounded bg-white/10" />
                <div className="h-8 w-40 rounded bg-white/10" />
                <div className="h-28 w-full rounded-2xl bg-white/10" />
                <div className="h-24 w-full rounded-2xl bg-white/10" />
                <div className="h-16 w-full rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-4 text-white sm:px-6 sm:py-6">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* top buttons */}
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            <span>←</span>
            <span>Буцах</span>
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg transition duration-200 hover:scale-[1.02]"
          >
            Сагс
          </Link>
        </div>

        {/* main card */}
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="grid md:grid-cols-2">
            {/* image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden bg-slate-900/40 md:h-full">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              <div className="absolute left-4 top-4">
                <span className="rounded-full border border-white/15 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {product.categoryName}
                </span>
              </div>
            </div>

            {/* content */}
            <div className="flex flex-col p-5 sm:p-6 md:p-8">
              <div className="mb-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
                  Product Detail
                </p>

                <h1 className="text-2xl font-black leading-tight text-white sm:text-4xl">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <p className="text-3xl font-black text-white sm:text-4xl">
                    ₮{product.price.toLocaleString()}
                  </p>

                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur">
                    Үлдэгдэл: {product.stock} ш
                  </div>
                </div>
              </div>

              <div className="mb-5 rounded-[24px] border border-white/10 bg-white/10 p-4 text-slate-200 backdrop-blur sm:mb-6 sm:p-5">
                <p className="text-sm leading-7 text-slate-200">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
                  <p className="mb-3 text-sm font-semibold text-white">
                    Тоо ширхэг сонгох
                  </p>

                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={Math.max(product.stock, 1)}
                  />
                </div>

                <div className="rounded-[24px] border border-cyan-400/20 bg-gradient-to-r from-cyan-500 to-blue-600 p-3 shadow-[0_20px_40px_rgba(14,165,233,0.22)]">
                  <AddToCartButton product={product} quantity={quantity} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* extra info */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-slate-200 backdrop-blur">
            <p className="text-sm font-bold text-white">Хурдан хүргэлт</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Захиалга баталгаажсаны дараа барааг шуурхай боловсруулна.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-slate-200 backdrop-blur">
            <p className="text-sm font-bold text-white">Найдвартай захиалга</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Сагсанд нэмээд захиалгаа хялбараар үүсгэх боломжтой.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 text-slate-200 backdrop-blur">
            <p className="text-sm font-bold text-white">Чанартай бүтээгдэхүүн</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Сургалт болон спортод тохирсон хэрэгцээт бараанууд.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}