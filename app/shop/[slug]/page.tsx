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
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="overflow-hidden rounded-3xl bg-gray-200">
              <div className="aspect-square w-full" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-3/4 rounded bg-gray-200" />
              <div className="h-7 w-32 rounded bg-gray-200" />
              <div className="h-20 w-full rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:text-black"
          >
            <span>←</span>
            <span>Буцах</span>
          </Link>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Сагс
          </Link>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="grid md:grid-cols-2">
            <div className="relative bg-gray-50">
              <div className="aspect-square w-full overflow-hidden md:h-full">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
                  {product.categoryName}
                </span>
              </div>
            </div>

            <div className="flex flex-col p-4 sm:p-6 md:p-8">
              <div className="mb-4 space-y-3 sm:mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Product Detail
                </p>

                <h1 className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
                  {product.name}
                </h1>

                <div className="flex items-end justify-between gap-3">
                  <p className="text-2xl font-black text-black sm:text-3xl">
                    ₮{product.price.toLocaleString()}
                  </p>

                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    Үлдэгдэл: {product.stock} ш
                  </div>
                </div>
              </div>

              <div className="mb-5 rounded-2xl bg-gray-50 p-4 sm:mb-6">
                <p className="text-sm leading-6 text-gray-700">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Тоо ширхэг сонгох
                  </p>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    max={Math.max(product.stock, 1)}
                  />
                </div>

                <div className="rounded-2xl bg-black p-3 shadow-lg">
                  <AddToCartButton product={product} quantity={quantity} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}