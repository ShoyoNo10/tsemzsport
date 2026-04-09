"use client";

import { useState } from "react";

interface AdminBranchesProps {
  adminSecret: string;
  onCreated: () => Promise<void>;
}

export default function AdminBranches({
  adminSecret,
  onCreated,
}: AdminBranchesProps) {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    const response = await fetch("/api/admin/branches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        name,
        address,
        imageUrl,
        description,
        status,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Алдаа гарлаа");
      return;
    }

    setName("");
    setAddress("");
    setImageUrl("");
    setDescription("");
    setStatus("active");
    setMessage("Салбар амжилттай нэмэгдлээ");
    await onCreated();
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Салбар нэмэх</h2>

      <div className="mt-4 grid gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Салбарын нэр"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Хаяг"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Зургийн URL"
          className="rounded-xl border px-4 py-3"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Салбарын тайлбар"
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
          Нэмэх
        </button>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}