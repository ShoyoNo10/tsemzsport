"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem, clearCart, getCart, getCartTotal } from "@/lib/shop-cart";

interface QPayUrlItem {
  name: string;
  description: string;
  logo: string;
  link: string;
}

interface CreateOrderResponse {
  message?: string;
  error?: string;
  order?: {
    _id: string;
    status: string;
    qpayInvoiceId: string;
    qpayQrText: string;
    qpayQrImage: string;
    qpayPaymentUrl: string;
    qpayDeepLink: string;
    qpayShortUrl: string;
    qpayUrls: QPayUrlItem[];
  };
}

interface OrderStatusResponse {
  _id: string;
  status: "pending" | "paid" | "cancelled";
  paidAt?: string | null;
}

export default function CheckoutForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [orderId, setOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "paid" | "cancelled" | ""
  >("");

  const [qpayQrImage, setQpayQrImage] = useState("");
  const [qpayShortUrl, setQpayShortUrl] = useState("");
  const [qpayUrls, setQpayUrls] = useState<QPayUrlItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = getCartTotal(items);

  const checkStatus = async (targetOrderId?: string): Promise<void> => {
    const finalOrderId = targetOrderId || orderId;

    if (!finalOrderId) {
      return;
    }

    setChecking(true);
    setMessage("");

    try {
      const response = await fetch(`/api/public/order-status/${finalOrderId}`);
      const data = (await response.json()) as OrderStatusResponse;

      if (!response.ok) {
        setMessage("Төлөв шалгаж чадсангүй");
        return;
      }

      setPaymentStatus(data.status);

      if (data.status === "paid") {
        setMessage("Төлбөр амжилттай баталгаажлаа");
        clearCart();
        setItems([]);
      } else if (data.status === "pending") {
        setMessage("Төлбөр хүлээгдэж байна");
      } else {
        setMessage("Захиалга цуцлагдсан байна");
      }
    } catch {
      setMessage("Төлөв шалгах үед алдаа гарлаа");
    } finally {
      setChecking(false);
    }
  };

  const submit = async (): Promise<void> => {
    setError("");
    setMessage("");

    if (!customerPhone || !address || items.length === 0) {
      setError("Мэдээллээ бүрэн оруулна уу");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/public/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerPhone,
          alternatePhone,
          address,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as CreateOrderResponse;

      if (!response.ok || !data.order?._id) {
        setError(data.error || data.message || "Алдаа гарлаа");
        return;
      }

      setOrderId(data.order._id);
      setPaymentStatus(
        data.order.status === "paid" || data.order.status === "cancelled"
          ? data.order.status
          : "pending"
      );
      setQpayQrImage(data.order.qpayQrImage || "");
      setQpayShortUrl(data.order.qpayShortUrl || "");
      setQpayUrls(Array.isArray(data.order.qpayUrls) ? data.order.qpayUrls : []);

      await checkStatus(data.order._id);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const statusText =
    paymentStatus === "pending"
      ? "Хүлээгдэж байна"
      : paymentStatus === "paid"
        ? "Төлөгдсөн"
        : paymentStatus === "cancelled"
          ? "Цуцлагдсан"
          : "-";

  const statusClassName =
    paymentStatus === "paid"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : paymentStatus === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : paymentStatus === "cancelled"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-slate-50 text-slate-700";

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15";

  if (!orderId) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Хүргэлтийн мэдээлэл
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Захиалга хүргэх мэдээллээ оруулна уу
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Утасны дугаар
              </label>
              <input
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="Жишээ: 99112233"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Нэмэлт утасны дугаар
              </label>
              <input
                value={alternatePhone}
                onChange={(event) => setAlternatePhone(event.target.value)}
                placeholder="Жишээ: 88112233"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Хүргэлтийн хаяг
              </label>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Дэлгэрэнгүй хаягаа оруулна уу"
                rows={5}
                className={`${inputClassName} resize-none`}
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void submit()}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(14,165,233,0.22)] transition duration-200 hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
            >
              {loading ? "Захиалга үүсгэж байна..." : "QPay-аар төлөх"}
            </button>
          </div>
        </div>

        <div className="h-fit rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] lg:sticky lg:top-6">
          <h2 className="text-xl font-bold text-slate-900">Таны захиалга</h2>
          <p className="mt-1 text-sm text-slate-500">
            Сагсанд байгаа бараанууд
          </p>

          {items.length === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl">
                🛒
              </div>
              <p className="mt-4 text-lg font-bold text-slate-900">
                Сагс хоосон байна
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Эхлээд бараа нэмээд дахин орж ирээрэй.
              </p>
              <Link
                href="/shop"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Дэлгүүр рүү очих
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-3">
                {items.map((item) => (
                  <div key={item.cartKey} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Size: {item.size}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.quantity} ш × ₮{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-slate-900">
                        ₮{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] bg-slate-900 p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Нийт үнэ</span>
                  <span className="text-2xl font-black">
                    ₮{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Төлбөр төлөх</h2>
            <p className="mt-2 break-all text-sm text-slate-500">
              Захиалгын ID: {orderId}
            </p>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${statusClassName}`}
          >
            {statusText}
          </div>
        </div>

        <div className="mt-6 space-y-3">

          <button
            type="button"
            onClick={() => void checkStatus()}
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-sm font-bold text-slate-900 transition hover:bg-slate-50"
          >
            {checking ? "Төлөв шалгаж байна..." : "Төлөв шалгах"}
          </button>
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {message}
          </div>
        ) : null}
      </div>

      <div className="space-y-5">
        {qpayUrls.length > 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
            <h3 className="text-xl font-bold text-slate-900">
              Бусад төлбөрийн сувгууд
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Доорх аппуудын аль нэгээр төлөх боломжтой
            </p>

            <div className="mt-5 grid gap-3">
              {qpayUrls.map((item) => (
                <a
                  key={`${item.name}-${item.link}`}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-11 w-11 rounded-xl bg-white object-contain p-1"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 text-slate-900 shadow-[0_16px_50px_rgba(0,0,0,0.18)]">
          <h3 className="text-xl font-bold text-slate-900">Анхаарах зүйл</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              QR эсвэл линкээр төлсний дараа <b>“Төлөв шалгах”</b> товч дарна.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Төлбөр амжилттай орвол сагс автоматаар хоосорно.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              Хэрэв удаад байвал хэдэн секундийн дараа дахин шалгаарай.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}