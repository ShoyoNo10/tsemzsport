"use client";

import { useEffect, useState } from "react";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import AnnouncementTable from "@/components/admin/AnnouncementTable";
import { Announcement } from "@/types/announcement";

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/announcements", {
        cache: "no-store",
      });

      const data = (await response.json()) as { items?: Announcement[] };

      if (!response.ok) {
        throw new Error("Заруудыг авч чадсангүй");
      }

      setItems(data.items ?? []);
    } catch (error) {
      console.error(error);
      window.alert("Заруудыг авах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchItems();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Зар удирдах хэсэг</h1>
          <p className="mt-1 text-sm text-gray-600">
            Сургалт, бүртгэл, зуслан, хуваарьтай холбоотой заруудаа эндээс удирдана.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <AnnouncementForm
            editingItem={editingItem}
            onSuccess={fetchItems}
            onCancelEdit={() => setEditingItem(null)}
          />

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              Уншиж байна...
            </div>
          ) : (
            <AnnouncementTable
              items={items}
              onEdit={setEditingItem}
              onReload={fetchItems}
            />
          )}
        </div>
      </div>
    </main>
  );
}