"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { addToCart } from "@/lib/shop-cart";

interface Props {
  product: Product;
  quantity: number;
}

export default function AddToCartButton({ product, quantity }: Props) {
  const [done, setDone] = useState(false);

  const onAdd = (): void => {
    addToCart(product, quantity);
    setDone(true);

    window.setTimeout(() => {
      setDone(false);
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={product.stock === 0}
      className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {product.stock === 0 ? "Дууссан" : done ? "Сагсанд нэмэгдлээ" : "Сагсанд нэмэх"}
    </button>
  );
}