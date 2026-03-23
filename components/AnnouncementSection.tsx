"use client";

import { useEffect, useState } from "react";
import { Announcement } from "@/types/announcement";

const typeLabelMap: Record<Announcement["type"], string> = {
  general: "Ерөнхий",
  registration: "Бүртгэл",
  schedule: "Хуваарь",
  camp: "Зуслан",
  event: "Арга хэмжээ",
};

export default function AnnouncementSection() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/public/announcements", {
          cache: "no-store",
        });

        const data = (await response.json()) as { items?: Announcement[] };

        if (!response.ok) {
          throw new Error("Failed");
        }

        setItems(data.items ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem]);

  const formatDate = (value?: string) => {
    if (!value) return null;

    return new Date(value).toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
        <p className="text-sm text-slate-300">Зар уншиж байна...</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 text-center">
        <div className="rounded-[28px] border border-dashed border-white/20 bg-white/5 px-6 py-14 backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl">
            📢
          </div>
          <p className="mt-4 text-lg font-bold text-white">
            Одоогоор зар байхгүй байна
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Шинэ мэдээлэл удахгүй нэмэгдэнэ
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-cyan-200 backdrop-blur">
            Announcement
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/10 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            >
              {item.imageUrl && (
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}

              <div className="p-5 text-white">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur">
                  {typeLabelMap[item.type]}
                </span>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                  {item.content}
                </p>

                <div className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-200">
                  Дэлгэрэнгүй →
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedItem(null)}
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/50 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black/70"
            >
              ✕
            </button>

            <div className="max-h-[90vh] overflow-y-auto">
              {selectedItem.imageUrl && (
                <div className="relative h-64 w-full sm:h-80">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>
              )}

              <div className="p-5 text-white sm:p-7">
                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur">
                  {typeLabelMap[selectedItem.type]}
                </span>

                <h2 className="mt-4 text-2xl font-black leading-tight text-white sm:text-3xl">
                  {selectedItem.title}
                </h2>
                
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-200 sm:text-base">
                    {selectedItem.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}