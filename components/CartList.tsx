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
      <div className="space-y-4">
        <p className="text-gray-600">Сагс хоосон байна.</p>
        <Link
          href="/shop"
          className="inline-block rounded-xl bg-black px-4 py-3 text-white"
        >
          Дэлгүүр рүү буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.productId} className="rounded-2xl border border-gray-200 bg-white p-4">
          <div className="flex gap-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div className="flex-1 space-y-2">
              <Link href={`/shop/${item.slug}`} className="font-semibold text-black">
                {item.name}
              </Link>
              <p className="text-sm text-gray-600">₮{item.price.toLocaleString()}</p>
              <QuantitySelector
                value={item.quantity}
                max={item.stock}
                onChange={(value) => updateCartQuantity(item.productId, value)}
              />
              <button
                type="button"
                onClick={() => removeFromCart(item.productId)}
                className="text-sm font-medium text-red-600"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl bg-black p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="font-medium">Нийт</span>
          <span className="text-lg font-bold">₮{total.toLocaleString()}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black"
        >
          Захиалах
        </Link>
      </div>
    </div>
  );
}