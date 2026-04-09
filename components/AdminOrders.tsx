"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types/order";

interface Props {
  adminSecret: string;
}

export default function AdminOrders({ adminSecret }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    const response = await fetch("/api/admin/orders", {
      headers: {
        "x-admin-secret": adminSecret,
      },
    });

    const data = (await response.json()) as Order[];
    setOrders(data);
  };

  useEffect(() => {
    if (adminSecret) {
      void load();
    }
  }, [adminSecret]);

  const updateStatus = async (
    id: string,
    status: OrderStatus
  ): Promise<void> => {
    try {
      setUpdatingId(id);

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        alert(data?.message || "Статус өөрчлөхөд алдаа гарлаа");
        return;
      }

      await load();
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id: string): Promise<void> => {
    const confirmed = window.confirm("Энэ захиалгыг устгах уу?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        alert(data?.message || "Устгах үед алдаа гарлаа");
        return;
      }

      await load();
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold text-black">Захиалгууд</h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border p-4 text-sm text-gray-500">
            Захиалга алга
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-black">
                    Захиалга: {order._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Утас: {order.customerPhone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Хаяг: {order.address}
                  </p>
                  <p className="text-sm font-medium text-black">
                    Нийт: ₮{order.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      void updateStatus(
                        order._id,
                        event.target.value as OrderStatus
                      )
                    }
                    disabled={updatingId === order._id || deletingId === order._id}
                    className="rounded-xl border px-4 py-2 text-black disabled:opacity-50"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => void deleteOrder(order._id)}
                    disabled={deletingId === order._id || updatingId === order._id}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingId === order._id ? "Устгаж байна..." : "Устгах"}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                {order.items.map((item) => (
                  <div
                    key={`${order._id}-${item.productId}`}
                    className="flex items-center justify-between text-black"
                  >
                    <span>
                      {item.productName} x {item.quantity}
                    </span>
                    <span>₮{item.lineTotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}