"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface OrderStatusResponse {
  _id: string;
  status: "pending" | "paid" | "cancelled";
  paidAt?: string | null;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const payLink = searchParams.get("pay") || "";
  const [status, setStatus] = useState<"pending" | "paid" | "cancelled">("pending");
  const [checking, setChecking] = useState<boolean>(false);

  const checkStatus = async (): Promise<void> => {
    if (!orderId) {
      return;
    }

    setChecking(true);

    try {
      const response = await fetch(`/api/public/order-status/${orderId}`);
      const data = (await response.json()) as OrderStatusResponse;

      if (response.ok) {
        setStatus(data.status);
      }
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void checkStatus();

    const interval = window.setInterval(() => {
      void checkStatus();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [orderId]);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Захиалга үүслээ</h1>

        <p className="mt-3 text-sm text-gray-700">
          QPay нээгээд төлбөрөө төлнө. Төлбөр баталгаажмагц статус автоматаар шинэчлэгдэнэ.
        </p>

        <p className="mt-2 break-all text-sm text-gray-500">Order ID: {orderId}</p>

        <div className="mt-4">
          <p className="text-sm font-medium text-black">
            Төлөв:{" "}
            {status === "pending"
              ? "Хүлээгдэж байна"
              : status === "paid"
              ? "Төлөгдсөн"
              : "Цуцлагдсан"}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={decodeURIComponent(payLink)}
            className="block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            QPay нээх
          </a>

          <button
            type="button"
            onClick={() => void checkStatus()}
            className="block w-full rounded-xl border border-black px-4 py-3 text-center font-semibold text-black"
          >
            {checking ? "Шалгаж байна..." : "Төлөв шалгах"}
          </button>
        </div>

        {status === "paid" ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            Төлбөр амжилттай баталгаажсан.
          </div>
        ) : null}
      </div>
    </main>
  );
}