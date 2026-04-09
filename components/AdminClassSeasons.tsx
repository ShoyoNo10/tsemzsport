"use client";

import { useEffect, useMemo, useState } from "react";
import { ClassOptionDto } from "@/types/class-option";

interface AdminClassSeasonsProps {
  adminSecret: string;
  classOptions: ClassOptionDto[];
  onCreated: () => Promise<void>;
}

interface ClassSeasonItem {
  _id: string;
  classOptionId: string;
  seasonLabel: string;
  capacity: number;
  enrolledCount: number;
  remainingSeats: number;
  isFull: boolean;
  isOpen: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
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

  const [seasons, setSeasons] = useState<ClassSeasonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClassOptionId, setEditClassOptionId] = useState<string>("");
  const [editSeasonLabel, setEditSeasonLabel] = useState<string>("");
  const [editCapacity, setEditCapacity] = useState<number>(20);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(true);
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  const classOptionNameMap = useMemo(() => {
    return new Map(
      classOptions.map((item) => [
        item._id,
        `${item.title} — ${item.ageRangeLabel}`,
      ])
    );
  }, [classOptions]);

  const fetchSeasons = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/class-seasons", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      const result = (await response.json()) as
        | { message?: string }
        | ClassSeasonItem[];

      if (!response.ok) {
        setMessage(
          "message" in result ? result.message ?? "Алдаа гарлаа" : "Алдаа гарлаа"
        );
        setLoading(false);
        return;
      }

      setSeasons(Array.isArray(result) ? result : []);
    } catch {
      setMessage("Сар / улирлуудыг татах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSeasons();
  }, [adminSecret]);

  const resetCreateForm = (): void => {
    setClassOptionId("");
    setSeasonLabel("");
    setCapacity(20);
    setIsOpen(true);
    setStatus("active");
  };

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    try {
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

      resetCreateForm();
      setMessage("Сар болон суудал амжилттай хадгалагдлаа");
      await fetchSeasons();
      await onCreated();
    } catch {
      setMessage("Сар хадгалах үед алдаа гарлаа");
    }
  };

  const startEdit = (item: ClassSeasonItem): void => {
    setEditingId(item._id);
    setEditClassOptionId(item.classOptionId);
    setEditSeasonLabel(item.seasonLabel);
    setEditCapacity(item.capacity);
    setEditIsOpen(item.isOpen);
    setEditStatus(item.status);
    setMessage("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditClassOptionId("");
    setEditSeasonLabel("");
    setEditCapacity(20);
    setEditIsOpen(true);
    setEditStatus("active");
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editingId) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/class-seasons", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          id: editingId,
          classOptionId: editClassOptionId,
          seasonLabel: editSeasonLabel,
          capacity: editCapacity,
          isOpen: editIsOpen,
          status: editStatus,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Засах үед алдаа гарлаа");
        return;
      }

      setMessage("Сар болон суудал амжилттай шинэчлэгдлээ");
      cancelEdit();
      await fetchSeasons();
      await onCreated();
    } catch {
      setMessage("Засах үед алдаа гарлаа");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmed = window.confirm("Энэ сар / улирлыг устгах уу?");
    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/class-seasons", {
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

      setMessage("Сар болон суудал амжилттай устлаа");
      await fetchSeasons();
      await onCreated();
    } catch {
      setMessage("Устгах үед алдаа гарлаа");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">
        Ангид сар, суудал удирдах
      </h2>

      <div className="mt-6 rounded-2xl border p-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Ангид сар, суудал нэмэх
        </h3>

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

<div>Нийт суудал</div>
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
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Нэмэгдсэн сар, суудлууд
        </h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Уншиж байна...</p>
        ) : seasons.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Сар / улирал алга</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {seasons.map((item) => {
              const isEditing = editingId === item._id;

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  {isEditing ? (
                    <div className="grid gap-3">
                      <select
                        value={editClassOptionId}
                        onChange={(event) =>
                          setEditClassOptionId(event.target.value)
                        }
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="">Анги сонгох</option>
                        {classOptions.map((classItem) => (
                          <option key={classItem._id} value={classItem._id}>
                            {classItem.title} — {classItem.ageRangeLabel}
                          </option>
                        ))}
                      </select>

                      <input
                        value={editSeasonLabel}
                        onChange={(event) => setEditSeasonLabel(event.target.value)}
                        placeholder="Жишээ: 4-5 сар"
                        className="rounded-xl border px-4 py-3"
                      />

                      <input
                        type="number"
                        value={editCapacity}
                        onChange={(event) =>
                          setEditCapacity(Number(event.target.value))
                        }
                        placeholder="Нийт суудал"
                        className="rounded-xl border px-4 py-3"
                      />

                      <select
                        value={editIsOpen ? "open" : "closed"}
                        onChange={(event) =>
                          setEditIsOpen(event.target.value === "open")
                        }
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="open">Нээлттэй</option>
                        <option value="closed">Хаалттай</option>
                      </select>

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
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {item.seasonLabel}
                          </h4>

                          <div className="mt-2 grid gap-1 text-sm text-slate-600">
                            <p>
                              Анги:{" "}
                              {classOptionNameMap.get(item.classOptionId) ??
                                "Тодорхойгүй"}
                            </p>
                            <p>Нийт суудал: {item.capacity}</p>
                            <p>Бүртгүүлсэн: {item.enrolledCount}</p>
                            <p>Үлдсэн: {item.remainingSeats}</p>
                            <p>Дүүрсэн эсэх: {item.isFull ? "Тийм" : "Үгүй"}</p>
                            <p>Бүртгэл: {item.isOpen ? "Нээлттэй" : "Хаалттай"}</p>
                            <p>Төлөв: {item.status}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded-xl border px-4 py-2 font-medium"
                          >
                            Засах
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(item._id)}
                            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white"
                          >
                            Устгах
                          </button>
                        </div>
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