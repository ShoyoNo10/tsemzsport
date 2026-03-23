"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Announcement } from "@/types/announcement";

type AnnouncementType =
  | "general"
  | "registration"
  | "schedule"
  | "camp"
  | "event";

interface Props {
  editingItem: Announcement | null;
  onSuccess: () => Promise<void> | void;
  onCancelEdit: () => void;
}

interface FormState {
  title: string;
  content: string;
  imageUrl: string;
  type: AnnouncementType;
  isPublished: boolean;
  startsAt: string;
  endsAt: string;
}

const initialState: FormState = {
  title: "",
  content: "",
  imageUrl: "",
  type: "general",
  isPublished: true,
  startsAt: "",
  endsAt: "",
};

export default function AnnouncementForm({
  editingItem,
  onSuccess,
  onCancelEdit,
}: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editingItem) {
      setForm(initialState);
      return;
    }

    setForm({
      title: editingItem.title,
      content: editingItem.content,
      imageUrl: editingItem.imageUrl ?? "",
      type: editingItem.type,
      isPublished: editingItem.isPublished,
      startsAt: editingItem.startsAt ? editingItem.startsAt.slice(0, 16) : "",
      endsAt: editingItem.endsAt ? editingItem.endsAt.slice(0, 16) : "",
    });
  }, [editingItem]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; message?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "Зураг upload хийж чадсангүй");
      }

      updateField("imageUrl", data.url);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Upload хийхэд алдаа гарлаа"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        type: form.type,
        isPublished: form.isPublished,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      };

      const response = await fetch(
        editingItem
          ? `/api/admin/announcements/${editingItem._id}`
          : "/api/admin/announcements",
        {
          method: editingItem ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Хадгалах үед алдаа гарлаа");
      }

      setForm(initialState);
      onCancelEdit();
      await onSuccess();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Хадгалах үед алдаа гарлаа"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">
          {editingItem ? "Зар засах" : "Шинэ зар нэмэх"}
        </h2>

        {editingItem ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
          >
            Болих
          </button>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Гарчиг</label>
        <input
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          placeholder="Жишээ: Шинэ бүртгэл эхэллээ"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Тайлбар</label>
        <textarea
          value={form.content}
          onChange={(e) => updateField("content", e.target.value)}
          className="min-h-[130px] w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          placeholder="Дэлгэрэнгүй мэдээлэл..."
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Төрөл</label>
          <select
            value={form.type}
            onChange={(e) =>
              updateField("type", e.target.value as AnnouncementType)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          >
            <option value="general">Ерөнхий</option>
            <option value="registration">Бүртгэл</option>
            <option value="schedule">Хуваарь</option>
            <option value="camp">Зуслан</option>
            <option value="event">Арга хэмжээ</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Төлөв</label>
          <select
            value={form.isPublished ? "published" : "draft"}
            onChange={(e) =>
              updateField("isPublished", e.target.value === "published")
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          >
            <option value="published">Нийтэлсэн</option>
            <option value="draft">Ноорог</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Эхлэх хугацаа</label>
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => updateField("startsAt", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Дуусах хугацаа</label>
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => updateField("endsAt", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Зураг upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full rounded-xl border border-gray-300 px-4 py-3"
        />
        {uploading ? <p className="text-sm text-gray-500">Upload хийж байна...</p> : null}
      </div>

      {form.imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <img
            src={form.imageUrl}
            alt="announcement preview"
            className="h-56 w-full object-cover"
          />
        </div>
      ) : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Хадгалж байна..." : editingItem ? "Шинэчлэх" : "Зар нэмэх"}
      </button>
    </form>
  );
}