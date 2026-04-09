"use client";

import { useEffect, useMemo, useState } from "react";
import { BranchDto } from "@/types/branch";
import { ScheduleTemplateDto } from "@/types/schedule-template";

interface AdminClassOptionsProps {
  adminSecret: string;
  branches: BranchDto[];
  schedules: ScheduleTemplateDto[];
  onCreated: () => Promise<void>;
}

interface ClassOptionItem {
  _id: string;
  title: string;
  ageRangeLabel: string;
  price: number;
  branchId: string;
  scheduleTemplateId: string;
  description: string;
  isOpen: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function AdminClassOptions({
  adminSecret,
  branches,
  schedules,
  onCreated,
}: AdminClassOptionsProps) {
  const [title, setTitle] = useState<string>("");
  const [ageRangeLabel, setAgeRangeLabel] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [branchId, setBranchId] = useState<string>("");
  const [scheduleTemplateId, setScheduleTemplateId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const [classOptions, setClassOptions] = useState<ClassOptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editAgeRangeLabel, setEditAgeRangeLabel] = useState<string>("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editBranchId, setEditBranchId] = useState<string>("");
  const [editScheduleTemplateId, setEditScheduleTemplateId] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editIsOpen, setEditIsOpen] = useState<boolean>(true);
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  const selectedBranch = branches.find((item) => item._id === branchId) ?? null;
  const editSelectedBranch =
    branches.find((item) => item._id === editBranchId) ?? null;

  const branchNameMap = useMemo(() => {
    return new Map(branches.map((branch) => [branch._id, branch.name]));
  }, [branches]);

  const scheduleNameMap = useMemo(() => {
    return new Map(schedules.map((schedule) => [schedule._id, schedule.title]));
  }, [schedules]);

  const fetchClassOptions = async (): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/class-options", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      const result = (await response.json()) as
        | { message?: string }
        | ClassOptionItem[];

      if (!response.ok) {
        setMessage(
          "message" in result ? result.message ?? "Алдаа гарлаа" : "Алдаа гарлаа"
        );
        setLoading(false);
        return;
      }

      setClassOptions(Array.isArray(result) ? result : []);
    } catch {
      setMessage("Ангиудыг татах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchClassOptions();
  }, [adminSecret]);

  const resetCreateForm = (): void => {
    setTitle("");
    setAgeRangeLabel("");
    setPrice(0);
    setBranchId("");
    setScheduleTemplateId("");
    setDescription("");
    setIsOpen(true);
    setStatus("active");
  };

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    try {
      const response = await fetch("/api/admin/class-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          title,
          ageRangeLabel,
          price,
          branchId,
          scheduleTemplateId,
          description,
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
      setMessage("Анги амжилттай нэмэгдлээ");
      await fetchClassOptions();
      await onCreated();
    } catch {
      setMessage("Анги нэмэх үед алдаа гарлаа");
    }
  };

  const startEdit = (item: ClassOptionItem): void => {
    setEditingId(item._id);
    setEditTitle(item.title);
    setEditAgeRangeLabel(item.ageRangeLabel);
    setEditPrice(item.price);
    setEditBranchId(item.branchId);
    setEditScheduleTemplateId(item.scheduleTemplateId);
    setEditDescription(item.description);
    setEditIsOpen(item.isOpen);
    setEditStatus(item.status);
    setMessage("");
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditTitle("");
    setEditAgeRangeLabel("");
    setEditPrice(0);
    setEditBranchId("");
    setEditScheduleTemplateId("");
    setEditDescription("");
    setEditIsOpen(true);
    setEditStatus("active");
  };

  const handleUpdate = async (): Promise<void> => {
    if (!editingId) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/class-options", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          id: editingId,
          title: editTitle,
          ageRangeLabel: editAgeRangeLabel,
          price: editPrice,
          branchId: editBranchId,
          scheduleTemplateId: editScheduleTemplateId,
          description: editDescription,
          isOpen: editIsOpen,
          status: editStatus,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Засах үед алдаа гарлаа");
        return;
      }

      setMessage("Анги амжилттай шинэчлэгдлээ");
      cancelEdit();
      await fetchClassOptions();
      await onCreated();
    } catch {
      setMessage("Засах үед алдаа гарлаа");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const confirmed = window.confirm("Энэ ангийг устгах уу?");
    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch("/api/admin/class-options", {
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

      setMessage("Анги амжилттай устлаа");
      await fetchClassOptions();
      await onCreated();
    } catch {
      setMessage("Устгах үед алдаа гарлаа");
    }
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Анги удирдах</h2>

      <div className="mt-6 rounded-2xl border p-4">
        <h3 className="text-lg font-semibold text-slate-900">Анги нэмэх</h3>

        <div className="mt-4 grid gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Жишээ: Beginner анги"
            className="rounded-xl border px-4 py-3"
          />

          <input
            value={ageRangeLabel}
            onChange={(event) => setAgeRangeLabel(event.target.value)}
            placeholder="Жишээ: 9-12 нас"
            className="rounded-xl border px-4 py-3"
          />

          <input
            type="number"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            placeholder="Үнэ"
            className="rounded-xl border px-4 py-3"
          />

          <select
            value={isOpen ? "open" : "closed"}
            onChange={(event) => setIsOpen(event.target.value === "open")}
            className="rounded-xl border px-4 py-3"
          >
            <option value="open">Бүртгэл нээлттэй</option>
            <option value="closed">Бүртгэл хаалттай</option>
          </select>

          <div className="grid gap-3">
            <p className="text-sm font-semibold text-slate-700">Салбар сонгох</p>

            <div className="grid gap-3 md:grid-cols-2">
              {branches.map((branch) => {
                const isSelected = branchId === branch._id;

                return (
                  <button
                    key={branch._id}
                    type="button"
                    onClick={() => setBranchId(branch._id)}
                    className={`overflow-hidden rounded-2xl border text-left transition ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="aspect-[16/10] bg-slate-100">
                      <img
                        src={branch.imageUrl}
                        alt={branch.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <p className="font-semibold text-slate-900">{branch.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{branch.address}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedBranch ? (
            <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              Сонгосон салбар:{" "}
              <span className="font-semibold">{selectedBranch.name}</span>
            </div>
          ) : null}

          <select
            value={scheduleTemplateId}
            onChange={(event) => setScheduleTemplateId(event.target.value)}
            className="rounded-xl border px-4 py-3"
          >
            <option value="">Хуваарь сонгох</option>
            {schedules.map((schedule) => (
              <option key={schedule._id} value={schedule._id}>
                {schedule.title}
              </option>
            ))}
          </select>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Тайлбар"
            rows={3}
            className="rounded-xl border px-4 py-3"
          />

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
            Анги нэмэх
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-slate-900">Нэмэгдсэн ангиуд</h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Уншиж байна...</p>
        ) : classOptions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Анги алга</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {classOptions.map((item) => {
              const isEditing = editingId === item._id;

              return (
                <div
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  {isEditing ? (
                    <div className="grid gap-3">
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Жишээ: Beginner анги"
                        className="rounded-xl border px-4 py-3"
                      />

                      <input
                        value={editAgeRangeLabel}
                        onChange={(event) =>
                          setEditAgeRangeLabel(event.target.value)
                        }
                        placeholder="Жишээ: 9-12 нас"
                        className="rounded-xl border px-4 py-3"
                      />

                      <input
                        type="number"
                        value={editPrice}
                        onChange={(event) => setEditPrice(Number(event.target.value))}
                        placeholder="Үнэ"
                        className="rounded-xl border px-4 py-3"
                      />

                      <select
                        value={editIsOpen ? "open" : "closed"}
                        onChange={(event) =>
                          setEditIsOpen(event.target.value === "open")
                        }
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="open">Бүртгэл нээлттэй</option>
                        <option value="closed">Бүртгэл хаалттай</option>
                      </select>

                      <div className="grid gap-3">
                        <p className="text-sm font-semibold text-slate-700">
                          Салбар сонгох
                        </p>

                        <div className="grid gap-3 md:grid-cols-2">
                          {branches.map((branch) => {
                            const isSelected = editBranchId === branch._id;

                            return (
                              <button
                                key={branch._id}
                                type="button"
                                onClick={() => setEditBranchId(branch._id)}
                                className={`overflow-hidden rounded-2xl border text-left transition ${
                                  isSelected
                                    ? "border-blue-600 ring-2 ring-blue-200"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <div className="aspect-[16/10] bg-slate-100">
                                  <img
                                    src={branch.imageUrl}
                                    alt={branch.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                <div className="p-4">
                                  <p className="font-semibold text-slate-900">
                                    {branch.name}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-500">
                                    {branch.address}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {editSelectedBranch ? (
                        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                          Сонгосон салбар:{" "}
                          <span className="font-semibold">
                            {editSelectedBranch.name}
                          </span>
                        </div>
                      ) : null}

                      <select
                        value={editScheduleTemplateId}
                        onChange={(event) =>
                          setEditScheduleTemplateId(event.target.value)
                        }
                        className="rounded-xl border px-4 py-3"
                      >
                        <option value="">Хуваарь сонгох</option>
                        {schedules.map((schedule) => (
                          <option key={schedule._id} value={schedule._id}>
                            {schedule.title}
                          </option>
                        ))}
                      </select>

                      <textarea
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                        placeholder="Тайлбар"
                        rows={3}
                        className="rounded-xl border px-4 py-3"
                      />

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
                            {item.title}
                          </h4>

                          <div className="mt-2 grid gap-1 text-sm text-slate-600">
                            <p>Нас: {item.ageRangeLabel}</p>
                            <p>Үнэ: {item.price.toLocaleString()}₮</p>
                            <p>
                              Салбар: {branchNameMap.get(item.branchId) ?? "Тодорхойгүй"}
                            </p>
                            <p>
                              Хуваарь:{" "}
                              {scheduleNameMap.get(item.scheduleTemplateId) ??
                                "Тодорхойгүй"}
                            </p>
                            <p>
                              Бүртгэл: {item.isOpen ? "Нээлттэй" : "Хаалттай"}
                            </p>
                            <p>Төлөв: {item.status}</p>
                            {item.description ? (
                              <p>Тайлбар: {item.description}</p>
                            ) : null}
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