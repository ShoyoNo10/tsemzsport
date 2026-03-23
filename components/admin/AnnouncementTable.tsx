"use client";

import { Announcement } from "@/types/announcement";

interface Props {
  items: Announcement[];
  onEdit: (item: Announcement) => void;
  onReload: () => Promise<void> | void;
}

const typeLabelMap: Record<Announcement["type"], string> = {
  general: "Ерөнхий",
  registration: "Бүртгэл",
  schedule: "Хуваарь",
  camp: "Зуслан",
  event: "Арга хэмжээ",
};

export default function AnnouncementTable({ items, onEdit, onReload }: Props) {
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Энэ зарыг устгах уу?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/announcements/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      window.alert(data.message ?? "Устгах үед алдаа гарлаа");
      return;
    }

    await onReload();
  };

  const handleTogglePublish = async (item: Announcement) => {
    const response = await fetch(`/api/admin/announcements/${item._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isPublished: !item.isPublished,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      window.alert(data.message ?? "Төлөв солих үед алдаа гарлаа");
      return;
    }

    await onReload();
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">Нийт зарууд</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Одоогоор зар алга.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-gray-200 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-36 w-full rounded-xl object-cover md:w-56"
                  />
                ) : (
                  <div className="flex h-36 w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 md:w-56">
                    Зураггүй
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {typeLabelMap[item.type]} •{" "}
                        {item.isPublished ? "Нийтэлсэн" : "Ноорог"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                      >
                        Засах
                      </button>

                      <button
                        onClick={() => handleTogglePublish(item)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                      >
                        {item.isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm text-gray-700">
                    {item.content}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <p>
                      Эхлэх: {item.startsAt ? new Date(item.startsAt).toLocaleString() : "-"}
                    </p>
                    <p>
                      Дуусах: {item.endsAt ? new Date(item.endsAt).toLocaleString() : "-"}
                    </p>
                    <p>
                      Үүсгэсэн: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}