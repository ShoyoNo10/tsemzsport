"use client";

import { useEffect, useState } from "react";
import { QPayUrlItem } from "@/types/registration";

interface RegistrationPayload {
  _id: string;
  status: string;
  paymentStatus: string;
  qpayInvoiceId: string;
  qpayQrText: string;
  qpayQrImage: string;
  qpayPaymentUrl: string;
  qpayDeepLink: string;
  qpayShortUrl: string;
  qpayUrls: QPayUrlItem[];
}

interface RegistrationResponse {
  registration: RegistrationPayload;
}

interface PaymentClientProps {
  registrationId: string;
}

export default function PaymentClient({
  registrationId,
}: PaymentClientProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [registration, setRegistration] = useState<RegistrationPayload | null>(null);

  const fetchRegistration = async (): Promise<void> => {
    const response = await fetch(`/api/public/registration/${registrationId}`);
    const data = (await response.json()) as RegistrationResponse;

    if (!response.ok) {
      throw new Error("Бүртгэлийн мэдээлэл ачаалж чадсангүй");
    }

    setRegistration(data.registration);
  };

  const checkPayment = async (): Promise<void> => {
    setChecking(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/public/payment-status?registrationId=${registrationId}`
      );

      const data = (await response.json()) as RegistrationResponse;

      if (!response.ok) {
        setMessage("Төлбөр шалгаж чадсангүй");
        return;
      }

      setRegistration(data.registration);

      if (data.registration.paymentStatus === "paid") {
        setMessage("Төлбөр амжилттай баталгаажлаа");
      } else {
        setMessage("Төлбөр хүлээгдэж байна");
      }
    } catch {
      setMessage("Төлбөр шалгах үед алдаа гарлаа");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const run = async (): Promise<void> => {
      try {
        await fetchRegistration();
      } catch {
        setMessage("Мэдээлэл ачаалж чадсангүй");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [registrationId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
          Уншиж байна...
        </div>
      </main>
    );
  }

  if (!registration) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
          Мэдээлэл олдсонгүй
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-900">Төлбөр төлөх</h1>

        <p className="mt-2 text-sm text-slate-600">
          Төлөв: <span className="font-semibold">{registration.paymentStatus}</span>
        </p>

        {registration.qpayQrImage ? (
          <div className="mt-6 flex justify-center">
            <img
              src={registration.qpayQrImage}
              alt="QPay QR"
              className="h-72 w-72 rounded-xl border object-contain"
            />
          </div>
        ) : null}

        <div className="mt-6 space-y-3">
          {registration.qpayShortUrl ? (
            <a
              href={registration.qpayShortUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-xl bg-blue-600 px-6 py-4 text-center font-semibold text-white"
            >
              QPay линкээр төлөх
            </a>
          ) : null}

          {registration.qpayPaymentUrl ? (
            <a
              href={registration.qpayPaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded-xl bg-emerald-600 px-6 py-4 text-center font-semibold text-white"
            >
              Аппаар төлөх
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => void checkPayment()}
            disabled={checking}
            className="w-full rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white disabled:bg-slate-400"
          >
            {checking ? "Шалгаж байна..." : "Төлбөр шалгах"}
          </button>
        </div>

        {registration.qpayUrls.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Бусад төлбөрийн сувгууд</h2>
            <div className="mt-4 grid gap-3">
              {registration.qpayUrls.map((item) => (
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
    </main>
  );
}