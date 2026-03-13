"use client";

import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="block rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.name}
        </h3>
        <p className="text-base font-bold text-black">
          ₮{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}