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

  useEffect(() => {
    const load = async (): Promise<void> => {
      const response = await fetch(`/api/public/products?category=${params.slug}`);
      const data = (await response.json()) as Product[];
      setProducts(data);
    };

    void load();
  }, [params.slug]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 pb-28 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/shop" className="text-sm text-gray-600">
            ← Буцах
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Ангиллын бараа</h1>
        </div>
        <Link
          href="/cart"
          className="rounded-xl border border-black px-4 py-2 text-sm font-semibold"
        >
          Сагс
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <ShopFooter />
    </main>
  );
}