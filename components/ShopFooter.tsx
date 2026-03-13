"use client";

import Link from "next/link";

export default function ShopFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 p-3">
        <Link
          href="/shop"
          className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Бүх бараа
        </Link>
        <Link
          href="/shop#categories"
          className="rounded-xl border border-black px-4 py-3 text-center text-sm font-semibold text-black"
        >
          Ангилал
        </Link>
      </div>
    </div>
  );
}