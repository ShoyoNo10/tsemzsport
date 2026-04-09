// "use client";

// import { RegistrationDto } from "@/types/registration";

// interface AdminRegistrationsProps {
//   registrations: RegistrationDto[];
// }

// export default function AdminRegistrations({
//   registrations,
// }: AdminRegistrationsProps) {
//   return (
//     <section className="rounded-2xl bg-white p-5 shadow">
//       <h2 className="text-xl font-semibold text-slate-900">Бүртгэлүүд</h2>

//       <div className="mt-4 overflow-x-auto">
//         <table className="min-w-full border-collapse text-sm">
//           <thead>
//             <tr className="border-b text-left">
//               <th className="px-3 py-2">Овог нэр</th>
//               <th className="px-3 py-2">Регистр</th>
//               <th className="px-3 py-2">Утас</th>
//               <th className="px-3 py-2">Статус</th>
//               <th className="px-3 py-2">Төлбөр</th>
//             </tr>
//           </thead>
//           <tbody>
//             {registrations.map((item) => (
//               <tr key={item._id} className="border-b">
//                 <td className="px-3 py-2">
//                   {item.lastName} {item.firstName}
//                 </td>
//                 <td className="px-3 py-2">{item.registerNumber}</td>
//                 <td className="px-3 py-2">{item.phonePrimary}</td>
//                 <td className="px-3 py-2">{item.status}</td>
//                 <td className="px-3 py-2">{item.paymentStatus}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }



"use client";

import { useState } from "react";
import { RegistrationDto } from "@/types/registration";

interface AdminRegistrationsProps {
  registrations: RegistrationDto[];
  adminSecret: string;
  onDeleted?: () => Promise<void>;
}

export default function AdminRegistrations({
  registrations,
  adminSecret,
  onDeleted,
}: AdminRegistrationsProps) {
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Энэ бүртгэлийг устгах уу?");
    if (!ok) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Устгах үед алдаа гарлаа.");
        return;
      }

      if (selectedRegistration?._id === id) {
        setSelectedRegistration(null);
      }

      alert("Бүртгэл амжилттай устлаа.");

      if (onDeleted) {
        await onDeleted();
      }
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <section className="rounded-2xl bg-white p-5 shadow">
        <h2 className="text-xl font-semibold text-slate-900">Бүртгэлүүд</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-2 text-black">Овог нэр</th>
                <th className="px-3 py-2 text-black">Регистр</th>
                <th className="px-3 py-2 text-black">Утас</th>
                <th className="px-3 py-2 text-black">Статус</th>
                <th className="px-3 py-2 text-black">Төлбөр</th>
                <th className="px-3 py-2 text-black">Үйлдэл</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedRegistration(item)}
                >
                  <td className="px-3 py-2 text-black">
                    {item.lastName} {item.firstName}
                  </td>
                  <td className="px-3 py-2 text-black">{item.registerNumber}</td>
                  <td className="px-3 py-2 text-black">{item.phonePrimary}</td>
                  <td className="px-3 py-2 text-black">{item.status}</td>
                  <td className="px-3 py-2 text-black">{item.paymentStatus}</td>
                  <td
                    className="px-3 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-white transition hover:bg-red-600 disabled:opacity-50"
                    >
                      {deletingId === item._id ? "Устгаж байна..." : "Устгах"}
                    </button>
                  </td>
                </tr>
              ))}

              {registrations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-slate-500"
                  >
                    Бүртгэл алга
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Бүртгэлийн дэлгэрэнгүй
                </h3>
                <p className="mt-1 text-sm text-black">
                  {selectedRegistration.lastName}{" "}
                  {selectedRegistration.firstName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRegistration(null)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-700 hover:bg-slate-200"
              >
                Хаах
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem
                label="ID"
                value={selectedRegistration._id}
              />
              <InfoItem
                label="Овог"
                value={selectedRegistration.lastName}
              />
              <InfoItem
                label="Нэр"
                value={selectedRegistration.firstName}
              />
              <InfoItem
                label="Регистр"
                value={selectedRegistration.registerNumber}
              />
              <InfoItem
                label="Үндсэн утас"
                value={selectedRegistration.phonePrimary}
              />
              <InfoItem
                label="Яаралтай үед холбогдох утас"
                value={selectedRegistration.phoneEmergency}
              />
              <InfoItem
                label="Гэрийн хаяг"
                value={selectedRegistration.homeAddress}
                fullWidth
              />
              <InfoItem
                label="Статус"
                value={selectedRegistration.status}
              />
              <InfoItem
                label="Төлбөрийн статус"
                value={selectedRegistration.paymentStatus}
              />
              <InfoItem
                label="Төлсөн огноо"
                value={selectedRegistration.paidAt || "-"}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(selectedRegistration._id)}
                disabled={deletingId === selectedRegistration._id}
                className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deletingId === selectedRegistration._id
                  ? "Устгаж байна..."
                  : "Энэ бүртгэлийг устгах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoItem({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-slate-50 p-3 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm text-slate-900">{value}</p>
    </div>
  );
}