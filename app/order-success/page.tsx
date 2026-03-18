import { Suspense } from "react";
import ShopPaymentClient from "@/components/ShopPaymentClient";

export default function OrderSuccessPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <Suspense fallback={<div>Уншиж байна...</div>}>
        <ShopPaymentClient />
      </Suspense>
    </main>
  );
}