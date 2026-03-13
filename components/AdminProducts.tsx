"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

interface Props {
  adminSecret: string;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
}

const initialForm: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
  isActive: true,
};

export default function AdminProducts({ adminSecret }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState<string>("");

  const load = async (): Promise<void> => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/admin/products", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      }),
      fetch("/api/admin/categories", {
        headers: {
          "x-admin-secret": adminSecret,
        },
      }),
    ]);

    const productsData = (await productsResponse.json()) as Product[];
    const categoriesData = (await categoriesResponse.json()) as Category[];

    setProducts(productsData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    if (adminSecret) {
      void load();
    }
  }, [adminSecret]);

  const submit = async (): Promise<void> => {
    const response = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          imageUrl: form.imageUrl,
          categoryId: form.categoryId,
          isActive: form.isActive,
        }),
      },
    );

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message || "Алдаа гарлаа");
      return;
    }

    setEditingId("");
    setForm(initialForm);
    setMessage("Амжилттай хадгаллаа");
    await load();
  };

  const remove = async (id: string): Promise<void> => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-secret": adminSecret,
      },
    });

    if (!response.ok) {
      setMessage("Устгах үед алдаа гарлаа");
      return;
    }

    await load();
  };

  const startEdit = (product: Product): void => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      isActive: product.isActive,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-bold text-black">Бараа</h2>

      <div className="grid gap-3 md:grid-cols-2">
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
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          placeholder="Үнэ"
          className="rounded-xl border px-4 py-3 text-black"
        />
        <input
          value={form.stock}
          onChange={(event) => setForm({ ...form, stock: event.target.value })}
          placeholder="Үлдэгдэл"
          className="rounded-xl border px-4 py-3 text-black"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });

            const data = await response.json();

            setForm({
              ...form,
              imageUrl: data.url,
            });
          }}
          className="rounded-xl border px-4 py-3 text-black"
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            className="h-32 w-32 rounded-xl object-cover"
          />
        )}
        <select
          value={form.categoryId}
          onChange={(event) =>
            setForm({ ...form, categoryId: event.target.value })
          }
          className="rounded-xl border px-4 py-3 text-black"
        >
          <option value="">Ангилал сонго</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <textarea
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          placeholder="Тайлбар"
          className="rounded-xl border px-4 py-3 text-black md:col-span-2"
          rows={4}
        />

        <label className="flex items-center gap-2 text-sm font-medium text-black">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm({ ...form, isActive: event.target.checked })
            }
          />
          Идэвхтэй
        </label>
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
        {products.map((product) => (
          <div key={product._id} className="rounded-xl border p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-black">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.categoryName}
                  </p>
                  <p className="text-sm text-black">
                    ₮{product.price.toLocaleString()} / Үлдэгдэл:{" "}
                    {product.stock}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="rounded-lg border px-3 py-2 text-black"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void remove(product._id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
