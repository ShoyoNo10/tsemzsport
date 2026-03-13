"use client";

import { RegistrationDto } from "@/types/registration";

interface AdminRegistrationsProps {
  registrations: RegistrationDto[];
}

export default function AdminRegistrations({
  registrations,
}: AdminRegistrationsProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Бүртгэлүүд</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">Овог нэр</th>
              <th className="px-3 py-2">Регистр</th>
              <th className="px-3 py-2">Утас</th>
              <th className="px-3 py-2">Статус</th>
              <th className="px-3 py-2">Төлбөр</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="px-3 py-2">
                  {item.lastName} {item.firstName}
                </td>
                <td className="px-3 py-2">{item.registerNumber}</td>
                <td className="px-3 py-2">{item.phonePrimary}</td>
                <td className="px-3 py-2">{item.status}</td>
                <td className="px-3 py-2">{item.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}