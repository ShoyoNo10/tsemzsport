// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { CartItem, clearCart, getCart, getCartTotal } from "@/lib/shop-cart";

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

//       const data = (await response.json()) as {
//         orderId?: string;
//         qpayDeepLink?: string;
//         message?: string;
//       };

//       if (!response.ok || !data.orderId || !data.qpayDeepLink) {
//         setError(data.message || "Алдаа гарлаа");
//         return;
//       }

//       clearCart();
//       router.push(
//         `/order-success?orderId=${data.orderId}&pay=${encodeURIComponent(data.qpayDeepLink)}`
//       );
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
//         onClick={submit}
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
import { useRouter } from "next/navigation";
import { CartItem, clearCart, getCart, getCartTotal } from "@/lib/shop-cart";

interface CreateOrderResponse {
  message?: string;
  error?: string;
  order?: {
    _id: string;
    qpayDeepLink: string;
    qpayShortUrl: string;
    qpayQrImage: string;
  };
}

export default function CheckoutForm() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = getCartTotal(items);

  const submit = async (): Promise<void> => {
    setError("");

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

clearCart();

router.push(
  `/order-success?orderId=${data.order._id}&pay=${encodeURIComponent(
    data.order.qpayDeepLink || ""
  )}&short=${encodeURIComponent(data.order.qpayShortUrl || "")}&qr=${encodeURIComponent(
    data.order.qpayQrImage || ""
  )}`
);
    } catch {
      setError("Серверийн алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
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
            <div key={item.productId} className="flex items-center justify-between text-sm">
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
        {loading ? "Уншиж байна..." : "QPay-аар төлөх"}
      </button>
    </div>
  );
}