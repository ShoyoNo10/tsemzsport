"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartItem,
  getCart,
  getCartTotal,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/shop-cart";
import QuantitySelector from "@/components/QuantitySelector";

export default function CartList() {
  const [items, setItems] = useState<CartItem[]>([]);

  const load = (): void => {
    setItems(getCart());
  };

  useEffect(() => {
    load();

    const handler = (): void => load();
    window.addEventListener("cart-updated", handler);

    return () => {
      window.removeEventListener("cart-updated", handler);
    };
  }, []);

  const total = getCartTotal(items);

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-8">
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl">
            🛒
          </div>

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Сагс хоосон байна
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Та одоогоор сагсандаа бараа нэмээгүй байна.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Дэлгүүр рүү буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.cartKey}
            className="rounded-[28px] border border-white/10 bg-white/95 p-4 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] sm:p-5"
          >
            <div className="flex gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                  <Link
                    href={`/shop/${item.slug}`}
                    className="line-clamp-2 text-base font-bold text-slate-900 transition hover:text-cyan-600 sm:text-lg"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Size: {item.size}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Нэгж үнэ
                  </p>
                  <p className="text-base font-extrabold text-slate-900">
                    ₮{item.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Тоо ширхэг
                    </p>
                    <QuantitySelector
                      value={item.quantity}
                      max={item.stock}
                      onChange={(value) => updateCartQuantity(item.cartKey, value)}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Дүн
                      </p>
                      <p className="text-lg font-black text-slate-900">
                        ₮{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartKey)}
                      className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] lg:sticky lg:top-6">
        <h2 className="text-xl font-bold text-slate-900">Захиалгын мэдээлэл</h2>
        <p className="mt-1 text-sm text-slate-500">
          Таны сонгосон бараануудын нийт дүн
        </p>

        <div className="mt-5 space-y-3 rounded-[24px] bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Барааны төрөл</span>
            <span>{items.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Нийт ширхэг</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-slate-900">Нийт</span>
            <span className="text-2xl font-black text-slate-900">
              ₮{total.toLocaleString()}
            </span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-5 block rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3.5 text-center text-sm font-bold text-white shadow-[0_20px_40px_rgba(14,165,233,0.22)] transition duration-200 hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500"
        >
          Захиалах
        </Link>

        <Link
          href="/shop"
          className="mt-3 block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Дахин бараа үзэх
        </Link>
      </div>
    </div>
  );
}