"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/types/order";

interface Props {
  adminSecret: string;
}

export default function AdminOrders({ adminSecret }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);

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

  const updateStatus = async (id: string, status: OrderStatus): Promise<void> => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ status }),
    });

    await load();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold text-black">Захиалгууд</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl border p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-black">Захиалга: {order._id}</p>
                <p className="text-sm text-gray-600">Утас: {order.customerPhone}</p>
                <p className="text-sm text-gray-600">Хаяг: {order.address}</p>
                <p className="text-sm font-medium text-black">
                  Нийт: ₮{order.totalAmount.toLocaleString()}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(event) =>
                  void updateStatus(order._id, event.target.value as OrderStatus)
                }
                className="rounded-xl border px-4 py-2 text-black"
              >
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="cancelled">cancelled</option>
              </select>
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
        ))}
      </div>
    </div>
  );
}