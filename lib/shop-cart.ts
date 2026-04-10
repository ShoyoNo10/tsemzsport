import { Product } from "@/types/product";

export interface CartItem {
  cartKey: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
  size: string;
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

export function addToCart(
  product: Product,
  size: string,
  quantity: number
): void {
  const variant = product.sizeVariants.find((item) => item.size === size);

  if (!variant || variant.stock <= 0) {
    return;
  }

  const current = getCart();
  const cartKey = `${product._id}-${size}`;
  const existing = current.find((item) => item.cartKey === cartKey);

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, variant.stock);
    existing.stock = variant.stock;
    saveCart([...current]);
    return;
  }

  current.push({
    cartKey,
    productId: product._id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    quantity: Math.min(quantity, variant.stock),
    stock: variant.stock,
    size,
  });

  saveCart(current);
}

export function removeFromCart(cartKey: string): void {
  const filtered = getCart().filter((item) => item.cartKey !== cartKey);
  saveCart(filtered);
}

export function updateCartQuantity(cartKey: string, quantity: number): void {
  const current = getCart();

  const next = current.map((item) => {
    if (item.cartKey !== cartKey) {
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