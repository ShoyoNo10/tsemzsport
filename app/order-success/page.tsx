// "use client";

// import { useSearchParams } from "next/navigation";

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId") || "";
//   const payLink = searchParams.get("pay") || "";

//   const confirmPaid = async (): Promise<void> => {
//     await fetch("/api/public/qpay-shop", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ orderId }),
//     });

//     window.alert("Төлбөр баталгаажлаа");
//     window.location.href = "/shop";
//   };

//   return (
//     <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
//       <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//         <h1 className="text-2xl font-bold">Захиалга үүслээ</h1>
//         <p className="mt-3 text-sm text-gray-700">
//           QPay deeplink рүү орж төлбөрөө төлнө.
//         </p>
//         <p className="mt-2 break-all text-sm text-gray-500">Order ID: {orderId}</p>

//         <div className="mt-6 space-y-3">
//           <a
//             href={decodeURIComponent(payLink)}
//             className="block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
//           >
//             QPay нээх
//           </a>

//           <button
//             type="button"
//             onClick={() => void confirmPaid()}
//             className="block w-full rounded-xl border border-black px-4 py-3 text-center font-semibold text-black"
//           >
//             Төлсөн бол баталгаажуулах
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const payLink = searchParams.get("pay") || "";

  const confirmPaid = async (): Promise<void> => {
    await fetch("/api/public/qpay-shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    window.alert("Төлбөр баталгаажлаа");
    window.location.href = "/shop";
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Захиалга үүслээ</h1>
        <p className="mt-3 text-sm text-gray-700">
          QPay deeplink рүү орж төлбөрөө төлнө.
        </p>
        <p className="mt-2 break-all text-sm text-gray-500">Order ID: {orderId}</p>

        <div className="mt-6 space-y-3">
          <a
            href={payLink ? decodeURIComponent(payLink) : "#"}
            className="block rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
          >
            QPay нээх
          </a>

          <button
            type="button"
            onClick={() => void confirmPaid()}
            className="block w-full rounded-xl border border-black px-4 py-3 text-center font-semibold text-black"
          >
            Төлсөн бол баталгаажуулах
          </button>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6">Уншиж байна...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}