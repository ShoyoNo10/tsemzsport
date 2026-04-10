"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { addToCart } from "@/lib/shop-cart";

interface Props {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export default function AddToCartButton({
  product,
  quantity,
  selectedSize,
}: Props) {
  const [done, setDone] = useState(false);

  const selectedVariant = product.sizeVariants.find(
    (item) => item.size === selectedSize
  );

  const selectedStock = selectedVariant?.stock ?? 0;

  const onAdd = (): void => {
    if (!selectedSize || !selectedVariant || selectedStock <= 0) {
      return;
    }

    addToCart(product, selectedSize, quantity);
    setDone(true);

    window.setTimeout(() => {
      setDone(false);
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={!selectedSize || selectedStock === 0}
      className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {!selectedSize
        ? "Size сонгоно уу"
        : selectedStock === 0
          ? "Дууссан"
          : done
            ? "Сагсанд нэмэгдлээ"
            : "Сагсанд нэмэх"}
    </button>
  );
}