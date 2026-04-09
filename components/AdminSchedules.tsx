"use client";

import { useEffect, useState } from "react";
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

interface ScheduleItem {
  _id: string;
  title: string;
  slots: SlotInput[];
  sessionsPerWeek: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

const defaultSlot: SlotInput = {
  day: "Monday",
  startTime: "18:00",
  endTime: "19:30",
};

export default function AdminSchedules({
  adminSecret,
  onCreated,
}: AdminSchedulesProps) {
  const [title, setTitle] = useState<string>("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(3);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [slots, setSlots] = useState<SlotInput[]>([defaultSlot]);
  const [message, setMessage] = useState<string>("");

  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editSessionsPerWeek, setEditSessionsPerWeek] = useState<number>(3);
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [editSlots, setEditSlots] = useState<SlotInput[]>([defaultSlot]);

  const fetchSchedules = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/schedules", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      const result = (await response.json()) as
        | { message?: string }
        | ScheduleItem[];

      if (!response.ok) {
        setMessage(
          "message" in result ? result.message ?? "Алдаа гарлаа" : "Алдаа гарлаа"
        );
        setLoading(false);
        return;
      }

      setSchedules(Array.isArray(result) ? result : []);
    } catch {
      setMessage("Хуваарь татах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSchedules();
  }, [adminSecret]);

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

  const removeSlot = (index: number): void => {
    setSlots((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const updateEditSlot = (
    index: number,
    key: keyof SlotInput,
    value: string
  ): void => {
    setEditSlots((previous) =>
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

  const addEditSlot = (): void => {
    setEditSlots((previous) => [
      ...previous,
      {
        day: "Wednesday",
        startTime: "18:00",
        endTime: "19:30",
      },
    ]);
  };

  const removeEditSlot = (index: number): void => {
    setEditSlots((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const resetCreateForm = (): void => {
    setTitle("");
    setSessionsPerWeek(3);
    setStatus("active");
    setSlots([defaultSlot]);
  };

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    try {
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

      resetCreateForm();
      setMessage("Хуваарь амжилттай нэмэгдлээ");
      await fetchSchedules();
      await onCreated();
    } catch {
      setMessage("Хуваарь нэмэх үед алдаа гарлаа");
    }
  };

  const startEdit = (schedule: ScheduleItem): void => {
    setEditingId(schedule._id);
    setEditTitle(schedule.title);
    setEditSessionsPerWeek(schedule.sessionsPerWeek);
    setEditStatus(schedule.status);
    setEditSlots(schedule.slots.length > 0 ? schedule.slots : [defaultSlot]);
    setMessage("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditTitle("");
    setEditSessionsPerWeek(3);
    setEditStatus("active");
    setEditSlots([defaultSlot]);
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editingId) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/schedules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          id: editingId,
          title: editTitle,
          slots: editSlots,
          sessionsPerWeek: editSessionsPerWeek,
          status: editStatus,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Засах үед алдаа гарлаа");
        return;
      }

      setMessage("Хуваарь амжилттай шинэчлэгдлээ");
      cancelEdit();
      await fetchSchedules();
      await onCreated();
    } catch {
      setMessage("Засах үед алдаа гарлаа");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmed = window.confirm("Энэ хуваарийг устгах уу?");
    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/schedules", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ id }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Устгах үед алдаа гарлаа");
        return;
      }

      if (editingId === id) {
        cancelEdit();
      }

      setMessage("Хуваарь амжилттай устлаа");
      await fetchSchedules();
      await onCreated();
    } catch {
      setMessage("Устгах үед алдаа гарлаа");
    }
  };

  const renderDayOptions = () => (
    <>
      <option value="Monday">Monday</option>
      <option value="Tuesday">Tuesday</option>
      <option value="Wednesday">Wednesday</option>
      <option value="Thursday">Thursday</option>
      <option value="Friday">Friday</option>
      <option value="Saturday">Saturday</option>
      <option value="Sunday">Sunday</option>
    </>
  );

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Хуваарь удирдах</h2>

      <div className="mt-6 rounded-2xl border p-4">
        <h3 className="text-lg font-semibold text-slate-900">Хуваарь нэмэх</h3>

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
            <div
              key={index}
              className="grid gap-2 rounded-xl border p-3 md:grid-cols-4"
            >
              <select
                value={slot.day}
                onChange={(event) => updateSlot(index, "day", event.target.value)}
                className="rounded-xl border px-4 py-3"
              >
                {renderDayOptions()}
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
                onChange={(event) =>
                  updateSlot(index, "endTime", event.target.value)
                }
                placeholder="19:30"
                className="rounded-xl border px-4 py-3"
              />

              <button
                type="button"
                onClick={() => removeSlot(index)}
                className="rounded-xl border border-red-300 px-4 py-3 font-medium text-red-600"
              >
                Цаг устгах
              </button>
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
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Нэмэгдсэн хуваариуд
        </h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Уншиж байна...</p>
        ) : schedules.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Хуваарь алга</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {schedules.map((schedule) => {
              const isEditing = editingId === schedule._id;

              return (
                <div
                  key={schedule._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  {isEditing ? (
                    <div className="grid gap-3">
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className="rounded-xl border px-4 py-3"
                        placeholder="Гарчиг"
                      />

                      <input
                        type="number"
                        value={editSessionsPerWeek}
                        onChange={(event) =>
                          setEditSessionsPerWeek(Number(event.target.value))
                        }
                        className="rounded-xl border px-4 py-3"
                        placeholder="7 хоногт хэд орох"
                      />

                      {editSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="grid gap-2 rounded-xl border p-3 md:grid-cols-4"
                        >
                          <select
                            value={slot.day}
                            onChange={(event) =>
                              updateEditSlot(index, "day", event.target.value)
                            }
                            className="rounded-xl border px-4 py-3"
                          >
                            {renderDayOptions()}
                          </select>

                          <input
                            value={slot.startTime}
                            onChange={(event) =>
                              updateEditSlot(index, "startTime", event.target.value)
                            }
                            className="rounded-xl border px-4 py-3"
                            placeholder="18:00"
                          />

                          <input
                            value={slot.endTime}
                            onChange={(event) =>
                              updateEditSlot(index, "endTime", event.target.value)
                            }
                            className="rounded-xl border px-4 py-3"
                            placeholder="19:30"
                          />

                          <button
                            type="button"
                            onClick={() => removeEditSlot(index)}
                            className="rounded-xl border border-red-300 px-4 py-3 font-medium text-red-600"
                          >
                            Цаг устгах
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addEditSlot}
                        className="rounded-xl border px-4 py-3 font-medium"
                      >
                        Цаг нэмэх
                      </button>

                      <select
                        value={editStatus}
                        onChange={(event) =>
                          setEditStatus(
                            event.target.value as "active" | "inactive"
                          )
                        }
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </select>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void handleUpdate()}
                          className="rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
                        >
                          Хадгалах
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-xl border px-4 py-3 font-semibold"
                        >
                          Болих
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {schedule.title}
                          </h4>
                          <p className="text-sm text-slate-500">
                            7 хоногт {schedule.sessionsPerWeek} удаа • {schedule.status}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(schedule)}
                            className="rounded-xl border px-4 py-2 font-medium"
                          >
                            Засах
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(schedule._id)}
                            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white"
                          >
                            Устгах
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {schedule.slots.map((slot, index) => (
                          <div
                            key={index}
                            className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                          >
                            {slot.day} • {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}