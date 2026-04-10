"use client";

import Link from "next/link";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const availableSizes = product.sizeVariants.filter((item) => item.stock > 0);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block overflow-hidden rounded-[22px] border border-white/10 bg-white/10 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/10">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      <div className="space-y-2 bg-white/90 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-cyan-600">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-base font-extrabold text-slate-900">
            ₮{product.price.toLocaleString()}
          </p>

          <p className="text-xs font-semibold text-slate-500">
            Нийт: {product.stock}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {availableSizes.length > 0 ? (
            availableSizes.map((item) => (
              <span
                key={`${product._id}-${item.size}`}
                className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700"
              >
                {item.size}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
              Дууссан
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}