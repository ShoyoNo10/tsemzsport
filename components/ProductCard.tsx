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
      className="group block overflow-hidden rounded-[22px] border border-white/10 bg-white/95 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
    >
      {/* image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>

      {/* content */}
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-cyan-600">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <p className="text-base font-extrabold text-slate-900">
            ₮{product.price.toLocaleString()}
          </p>

          {/* жижиг hover icon */}
          {/* <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition group-hover:bg-cyan-500 group-hover:text-white">
            Дэлгэрэнгүй
          </div> */}
        </div>
      </div>
    </Link>
  );
}