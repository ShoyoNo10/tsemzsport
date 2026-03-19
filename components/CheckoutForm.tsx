// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CartItem, clearCart, getCart, getCartTotal } from "@/lib/shop-cart";

// interface CreateOrderResponse {
//   message?: string;
//   error?: string;
//   order?: {
//     _id: string;
//     qpayDeepLink: string;
//     qpayShortUrl: string;
//     qpayQrImage: string;
//   };
// }

// export default function CheckoutForm() {
//   const router = useRouter();
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [alternatePhone, setAlternatePhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setItems(getCart());
//   }, []);

//   const total = getCartTotal(items);

//   const submit = async (): Promise<void> => {
//     setError("");

//     if (!customerPhone || !address || items.length === 0) {
//       setError("Мэдээллээ бүрэн оруулна уу");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/public/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customerPhone,
//           alternatePhone,
//           address,
//           items: items.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//           })),
//         }),
//       });

//       const data = (await response.json()) as CreateOrderResponse;

// if (!response.ok || !data.order?._id) {
//   setError(data.error || data.message || "Алдаа гарлаа");
//   return;
// }

// clearCart();

// router.push(
//   `/order-success?orderId=${data.order._id}&pay=${encodeURIComponent(
//     data.order.qpayDeepLink || ""
//   )}&short=${encodeURIComponent(data.order.qpayShortUrl || "")}&qr=${encodeURIComponent(
//     data.order.qpayQrImage || ""
//   )}`
// );
//     } catch {
//       setError("Серверийн алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="rounded-2xl border border-gray-200 bg-white p-4">
//         <h2 className="mb-4 text-lg font-bold">Хүргэлтийн мэдээлэл</h2>
//         <div className="space-y-3">
//           <input
//             value={customerPhone}
//             onChange={(event) => setCustomerPhone(event.target.value)}
//             placeholder="Утасны дугаар"
//             className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
//           />
//           <input
//             value={alternatePhone}
//             onChange={(event) => setAlternatePhone(event.target.value)}
//             placeholder="Нэмэлт утасны дугаар"
//             className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
//           />
//           <textarea
//             value={address}
//             onChange={(event) => setAddress(event.target.value)}
//             placeholder="Гэрийн хаяг"
//             rows={4}
//             className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
//           />
//         </div>
//       </div>

//       <div className="rounded-2xl border border-gray-200 bg-white p-4">
//         <h2 className="mb-4 text-lg font-bold">Таны захиалга</h2>
//         <div className="space-y-2">
//           {items.map((item) => (
//             <div key={item.productId} className="flex items-center justify-between text-sm">
//               <span>
//                 {item.name} x {item.quantity}
//               </span>
//               <span>₮{(item.price * item.quantity).toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//         <div className="mt-4 flex items-center justify-between border-t pt-4 font-bold">
//           <span>Нийт үнэ</span>
//           <span>₮{total.toLocaleString()}</span>
//         </div>
//       </div>

//       {error ? <p className="text-sm text-red-600">{error}</p> : null}

//       <button
//         type="button"
//         onClick={() => void submit()}
//         disabled={loading}
//         className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:bg-gray-400"
//       >
//         {loading ? "Уншиж байна..." : "QPay-аар төлөх"}
//       </button>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
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
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | "cancelled" | "">("");

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

  return (
    <div className="space-y-4">
      {!orderId ? (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-bold">Хүргэлтийн мэдээлэл</h2>
            <div className="space-y-3">
              <input
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="Утасны дугаар"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
              <input
                value={alternatePhone}
                onChange={(event) => setAlternatePhone(event.target.value)}
                placeholder="Нэмэлт утасны дугаар"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Гэрийн хаяг"
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-bold">Таны захиалга</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₮{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 font-bold">
              <span>Нийт үнэ</span>
              <span>₮{total.toLocaleString()}</span>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={() => void submit()}
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:bg-gray-400"
          >
            {loading ? "Үүсгэж байна..." : "QPay-аар төлөх"}
          </button>
        </>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Төлбөр төлөх</h2>

          <p className="mt-2 text-sm text-gray-500 break-all">Order ID: {orderId}</p>

          <p className="mt-3 text-sm font-medium text-black">
            Төлөв:{" "}
            {paymentStatus === "pending"
              ? "Хүлээгдэж байна"
              : paymentStatus === "paid"
                ? "Төлөгдсөн"
                : paymentStatus === "cancelled"
                  ? "Цуцлагдсан"
                  : "-"}
          </p>

          {qpayQrImage ? (
            <div className="mt-6 flex justify-center">
              <img
                src={qpayQrImage}
                alt="QPay QR"
                className="h-64 w-64 rounded-xl border object-contain"
              />
            </div>
          ) : null}

          <div className="mt-6 space-y-3">
            {qpayShortUrl ? (
              <a
                href={qpayShortUrl}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
              >
                QPay линкээр төлөх
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => void checkStatus()}
              className="block w-full rounded-xl border border-black px-4 py-3 text-center font-semibold text-black"
            >
              {checking ? "Шалгаж байна..." : "Төлөв шалгах"}
            </button>
          </div>

          {qpayUrls.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-black">
                Бусад төлбөрийн сувгууд
              </h3>

              <div className="mt-4 grid gap-3">
                {qpayUrls.map((item) => (
                  <a
                    key={`${item.name}-${item.link}`}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-slate-50"
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="h-10 w-10 rounded object-contain"
                    />
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {message ? (
            <p className="mt-6 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}