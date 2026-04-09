"use client";

import { useState } from "react";
import { ClassOptionDto } from "@/types/class-option";

interface AdminClassSeasonsProps {
  adminSecret: string;
  classOptions: ClassOptionDto[];
  onCreated: () => Promise<void>;
}

export default function AdminClassSeasons({
  adminSecret,
  classOptions,
  onCreated,
}: AdminClassSeasonsProps) {
  const [classOptionId, setClassOptionId] = useState<string>("");
  const [seasonLabel, setSeasonLabel] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(20);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    const response = await fetch("/api/admin/class-seasons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        classOptionId,
        seasonLabel,
        capacity,
        isOpen,
        status,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Алдаа гарлаа");
      return;
    }

    setClassOptionId("");
    setSeasonLabel("");
    setCapacity(20);
    setIsOpen(true);
    setStatus("active");
    setMessage("Сар болон суудал амжилттай хадгалагдлаа");
    await onCreated();
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">
        Ангид сар, суудал нэмэх
      </h2>

      <div className="mt-4 grid gap-3">
        <select
          value={classOptionId}
          onChange={(event) => setClassOptionId(event.target.value)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="">Анги сонгох</option>
          {classOptions.map((item) => (
            <option key={item._id} value={item._id}>
              {item.title} — {item.ageRangeLabel}
            </option>
          ))}
        </select>

        <input
          value={seasonLabel}
          onChange={(event) => setSeasonLabel(event.target.value)}
          placeholder="Жишээ: 4-5 сар"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="number"
          value={capacity}
          onChange={(event) => setCapacity(Number(event.target.value))}
          placeholder="Нийт суудал"
          className="rounded-xl border px-4 py-3"
        />

        <select
          value={isOpen ? "open" : "closed"}
          onChange={(event) => setIsOpen(event.target.value === "open")}
          className="rounded-xl border px-4 py-3"
        >
          <option value="open">Нээлттэй</option>
          <option value="closed">Хаалттай</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "active" | "inactive")
          }
          className="rounded-xl border px-4 py-3"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <button
          type="button"
          onClick={() => void handleCreate()}
          className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
        >
          Сар хадгалах
        </button>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}