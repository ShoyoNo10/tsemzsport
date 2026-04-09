// "use client";

// import { useState } from "react";

// interface AdminBranchesProps {
//   adminSecret: string;
//   onCreated: () => Promise<void>;
// }

// export default function AdminBranches({
//   adminSecret,
//   onCreated,
// }: AdminBranchesProps) {
//   const [name, setName] = useState<string>("");
//   const [address, setAddress] = useState<string>("");
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [status, setStatus] = useState<"active" | "inactive">("active");
//   const [message, setMessage] = useState<string>("");

//   const handleCreate = async (): Promise<void> => {
//     setMessage("");

//     const response = await fetch("/api/admin/branches", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-admin-secret": adminSecret,
//       },
//       body: JSON.stringify({
//         name,
//         address,
//         imageUrl,
//         description,
//         status,
//       }),
//     });

//     const result = (await response.json()) as { message?: string };

//     if (!response.ok) {
//       setMessage(result.message ?? "Алдаа гарлаа");
//       return;
//     }

//     setName("");
//     setAddress("");
//     setImageUrl("");
//     setDescription("");
//     setStatus("active");
//     setMessage("Салбар амжилттай нэмэгдлээ");
//     await onCreated();
//   };

//   return (
//     <section className="rounded-2xl bg-white p-5 shadow">
//       <h2 className="text-xl font-semibold text-slate-900">Салбар нэмэх</h2>

//       <div className="mt-4 grid gap-3">
//         <input
//           value={name}
//           onChange={(event) => setName(event.target.value)}
//           placeholder="Салбарын нэр"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           value={address}
//           onChange={(event) => setAddress(event.target.value)}
//           placeholder="Хаяг"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           value={imageUrl}
//           onChange={(event) => setImageUrl(event.target.value)}
//           placeholder="Зургийн URL"
//           className="rounded-xl border px-4 py-3"
//         />

//         <textarea
//           value={description}
//           onChange={(event) => setDescription(event.target.value)}
//           placeholder="Салбарын тайлбар"
//           rows={3}
//           className="rounded-xl border px-4 py-3"
//         />

//         <select
//           value={status}
//           onChange={(event) =>
//             setStatus(event.target.value as "active" | "inactive")
//           }
//           className="rounded-xl border px-4 py-3"
//         >
//           <option value="active">active</option>
//           <option value="inactive">inactive</option>
//         </select>

//         <button
//           type="button"
//           onClick={() => void handleCreate()}
//           className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
//         >
//           Нэмэх
//         </button>

//         {message ? <p className="text-sm text-slate-600">{message}</p> : null}
//       </div>
//     </section>
//   );
// }

"use client";

import { ChangeEvent, useEffect, useState } from "react";

interface BranchDto {
  _id: string;
  name: string;
  address: string;
  imageUrl: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface AdminBranchesProps {
  adminSecret: string;
  onCreated: () => Promise<void>;
}

export default function AdminBranches({
  adminSecret,
  onCreated,
}: AdminBranchesProps) {
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const resetForm = (): void => {
    setEditingId(null);
    setName("");
    setAddress("");
    setImageUrl("");
    setDescription("");
    setStatus("active");
  };

  const fetchBranches = async (): Promise<void> => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/branches", {
        method: "GET",
        headers: {
          "x-admin-secret": adminSecret,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message ?? "Салбаруудыг авч чадсангүй");
        return;
      }

      const safeBranches: BranchDto[] = Array.isArray(result)
        ? result.map((item) => ({
            _id: String(item._id),
            name: item.name ?? "",
            address: item.address ?? "",
            imageUrl: item.imageUrl ?? "",
            description: item.description ?? "",
            status: item.status === "inactive" ? "inactive" : "active",
            createdAt: item.createdAt ?? "",
            updatedAt: item.updatedAt ?? "",
          }))
        : [];

      setBranches(safeBranches);
    } catch {
      setMessage("Салбаруудыг авч чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBranches();
  }, []);

  const handleUploadImage = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = (await response.json()) as {
        url?: string;
        message?: string;
      };

      if (!response.ok) {
        setMessage(result.message ?? "Зураг upload хийж чадсангүй");
        return;
      }

      setImageUrl(result.url ?? "");
      setMessage("Зураг амжилттай upload хийгдлээ");
    } catch {
      setMessage("Зураг upload хийх үед алдаа гарлаа");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleCreateOrUpdate = async (): Promise<void> => {
    setSaving(true);
    setMessage("");

    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `/api/admin/branches/${editingId}`
        : "/api/admin/branches";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          imageUrl: imageUrl.trim(),
          description: description.trim(),
          status,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Алдаа гарлаа");
        return;
      }

      resetForm();
      setMessage(
        isEditing
          ? "Салбар амжилттай шинэчлэгдлээ"
          : "Салбар амжилттай нэмэгдлээ"
      );

      await fetchBranches();
      await onCreated();
    } catch {
      setMessage("Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (branch: BranchDto): void => {
    setEditingId(branch._id);
    setName(branch.name ?? "");
    setAddress(branch.address ?? "");
    setImageUrl(branch.imageUrl ?? "");
    setDescription(branch.description ?? "");
    setStatus(branch.status ?? "active");
    setMessage("");
  };

  const handleCancelEdit = (): void => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id: string): Promise<void> => {
  const ok = window.confirm("Энэ салбарыг устгах уу?");

  if (!ok) return;

  setMessage("");

  try {
    const response = await fetch(`/api/admin/branches/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-secret": adminSecret,
      },
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Устгах үед алдаа гарлаа");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage("Салбар амжилттай устгагдлаа");
    await fetchBranches();
    await onCreated();
  } catch {
    setMessage("Устгах үед алдаа гарлаа");
  }
};

  

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">
        {editingId ? "Салбар засах" : "Салбар нэмэх"}
      </h2>

      <div className="mt-4 grid gap-3">
        <input
          value={name ?? ""}
          onChange={(event) => setName(event.target.value)}
          placeholder="Салбарын нэр"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={address ?? ""}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Хаяг"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={imageUrl ?? ""}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="Зургийн URL"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(event) => void handleUploadImage(event)}
          className="rounded-xl border px-4 py-3"
        />

        {uploading ? (
          <p className="text-sm text-slate-500">Зураг upload хийж байна...</p>
        ) : null}

        {imageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 p-2">
            <img
              src={imageUrl}
              alt="branch preview"
              className="h-44 w-full rounded-xl object-cover"
            />
          </div>
        ) : null}

        <textarea
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Салбарын тайлбар"
          rows={3}
          className="rounded-xl border px-4 py-3"
        />

        <select
          value={status ?? "active"}
          onChange={(event) =>
            setStatus(event.target.value as "active" | "inactive")
          }
          className="rounded-xl border px-4 py-3"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void handleCreateOrUpdate()}
            disabled={saving || uploading}
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Түр хүлээнэ үү..." : editingId ? "Хадгалах" : "Нэмэх"}
          </button>

          {editingId ? (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-800"
            >
              Болих
            </button>
          ) : null}
        </div>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900">Салбарууд</h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Уншиж байна...</p>
        ) : branches.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Салбар алга</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {branches.map((branch) => (
              <div
                key={branch._id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    {branch.imageUrl ? (
                      <img
                        src={branch.imageUrl}
                        alt={branch.name}
                        className="mb-3 h-40 w-full rounded-xl object-cover md:w-72"
                      />
                    ) : null}

                    <p className="text-lg font-semibold text-slate-900">
                      {branch.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {branch.address}
                    </p>

                    {branch.description ? (
                      <p className="mt-2 text-sm text-slate-500">
                        {branch.description}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs text-slate-500">
                      Төлөв: {branch.status}
                    </p>
                  </div>

      <div className="flex gap-2">
  <button
    type="button"
    onClick={() => handleEdit(branch)}
    className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
  >
    Засах
  </button>

  <button
    type="button"
    onClick={() => void handleDelete(branch._id)}
    className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
  >
    Устгах
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}