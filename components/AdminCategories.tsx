"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";

interface Props {
  adminSecret: string;
}

interface CategoryFormState {
  name: string;
  slug: string;
  description: string;
}

const initialForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
};

export default function AdminCategories({ adminSecret }: Props) {
  const [items, setItems] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string>("");
  const [form, setForm] = useState<CategoryFormState>(initialForm);
  const [message, setMessage] = useState<string>("");

  const load = async (): Promise<void> => {
    const response = await fetch("/api/admin/categories", {
      headers: {
        "x-admin-secret": adminSecret,
      },
    });

    const data = (await response.json()) as Category[];
    setItems(data);
  };

  useEffect(() => {
    if (adminSecret) {
      void load();
    }
  }, [adminSecret]);

  const submit = async (): Promise<void> => {
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/admin/categories/${editingId}`
      : "/api/admin/categories";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify(form),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message || "Алдаа гарлаа");
      return;
    }

    setForm(initialForm);
    setEditingId("");
    setMessage("Амжилттай хадгаллаа");
    await load();
  };

  const remove = async (id: string): Promise<void> => {
    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-secret": adminSecret,
      },
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message || "Устгах үед алдаа гарлаа");
      return;
    }

    await load();
  };

  const startEdit = (item: Category): void => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold text-black">Ангилал</h2>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Нэр"
          className="rounded-xl border px-4 py-3 text-black"
        />
        <input
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
          placeholder="Slug"
          className="rounded-xl border px-4 py-3 text-black"
        />
        <input
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          placeholder="Тайлбар"
          className="rounded-xl border px-4 py-3 text-black"
        />
      </div>

      <button
        type="button"
        onClick={() => void submit()}
        className="rounded-xl bg-black px-4 py-3 text-white"
      >
        {editingId ? "Шинэчлэх" : "Нэмэх"}
      </button>

      {message ? <p className="text-sm text-blue-600">{message}</p> : null}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-3 rounded-xl border p-3 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold text-black">{item.name}</p>
              <p className="text-sm text-gray-500">{item.slug}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-lg border px-3 py-2 text-black"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void remove(item._id)}
                className="rounded-lg bg-red-600 px-3 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}