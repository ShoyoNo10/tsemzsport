import CartList from "@/components/CartList";

export default function CartPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Сагс</h1>
      <CartList />
    </main>
  );
}