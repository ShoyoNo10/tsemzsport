import { Product } from "@/types/product";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

const CART_KEY = "shop-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(CART_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product, quantity: number): void {
  const current = getCart();
  const existing = current.find((item) => item.productId === product._id);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    saveCart([...current]);
    return;
  }

  current.push({
    productId: product._id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    quantity: Math.min(quantity, product.stock),
    stock: product.stock,
  });

  saveCart(current);
}

export function removeFromCart(productId: string): void {
  const filtered = getCart().filter((item) => item.productId !== productId);
  saveCart(filtered);
}

export function updateCartQuantity(productId: string, quantity: number): void {
  const current = getCart();

  const next = current.map((item) => {
    if (item.productId !== productId) {
      return item;
    }

    return {
      ...item,
      quantity: Math.max(1, Math.min(quantity, item.stock)),
    };
  });

  saveCart(next);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}