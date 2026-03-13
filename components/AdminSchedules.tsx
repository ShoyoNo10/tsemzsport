"use client";

import { useState } from "react";
import { Weekday } from "@/types/schedule-template";

interface AdminSchedulesProps {
  adminSecret: string;
  onCreated: () => Promise<void>;
}

interface SlotInput {
  day: Weekday;
  startTime: string;
  endTime: string;
}

export default function AdminSchedules({
  adminSecret,
  onCreated,
}: AdminSchedulesProps) {
  const [title, setTitle] = useState<string>("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(3);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [slots, setSlots] = useState<SlotInput[]>([
    {
      day: "Monday",
      startTime: "18:00",
      endTime: "19:30",
    },
  ]);
  const [message, setMessage] = useState<string>("");

  const updateSlot = (
    index: number,
    key: keyof SlotInput,
    value: string
  ): void => {
    setSlots((previous) =>
      previous.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (key === "day") {
          return {
            ...item,
            day: value as Weekday,
          };
        }

        return {
          ...item,
          [key]: value,
        };
      })
    );
  };

  const addSlot = (): void => {
    setSlots((previous) => [
      ...previous,
      {
        day: "Wednesday",
        startTime: "18:00",
        endTime: "19:30",
      },
    ]);
  };

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    const response = await fetch("/api/admin/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        title,
        slots,
        sessionsPerWeek,
        status,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Алдаа гарлаа");
      return;
    }

    setTitle("");
    setSessionsPerWeek(3);
    setStatus("active");
    setSlots([
      {
        day: "Monday",
        startTime: "18:00",
        endTime: "19:30",
      },
    ]);
    setMessage("Хуваарь амжилттай нэмэгдлээ");
    await onCreated();
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Хуваарь нэмэх</h2>

      <div className="mt-4 grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Жишээ: 13-15 нас орой анги"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="number"
          value={sessionsPerWeek}
          onChange={(event) => setSessionsPerWeek(Number(event.target.value))}
          placeholder="7 хоногт хэд орох"
          className="rounded-xl border px-4 py-3"
        />

        {slots.map((slot, index) => (
          <div key={index} className="grid gap-2 rounded-xl border p-3 md:grid-cols-3">
            <select
              value={slot.day}
              onChange={(event) => updateSlot(index, "day", event.target.value)}
              className="rounded-xl border px-4 py-3"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>

            <input
              value={slot.startTime}
              onChange={(event) =>
                updateSlot(index, "startTime", event.target.value)
              }
              placeholder="18:00"
              className="rounded-xl border px-4 py-3"
            />

            <input
              value={slot.endTime}
              onChange={(event) => updateSlot(index, "endTime", event.target.value)}
              placeholder="19:30"
              className="rounded-xl border px-4 py-3"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addSlot}
          className="rounded-xl border px-4 py-3 font-medium"
        >
          Цаг нэмэх
        </button>

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
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
        >
          Хуваарь нэмэх
        </button>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}