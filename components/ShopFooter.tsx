"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ShopFooter() {
  const pathname = usePathname();

  const isShop = pathname === "/shop";
  const isCart = pathname === "/cart";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
      <div className="mx-auto max-w-5xl rounded-[24px] border border-white/10 bg-white/10 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2">
          {/* Shop */}
          <Link
            href="/shop"
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${
              isShop
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <span>🛍️</span>
            <span>Бараа</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 ${
              isCart
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <span>🛒</span>
            <span>Сагс</span>
          </Link>
        </div>
      </div>
    </div>
  );
}