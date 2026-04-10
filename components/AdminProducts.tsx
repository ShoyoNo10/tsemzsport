"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { Product, ProductSizeVariant } from "@/types/product";

interface Props {
  adminSecret: string;
}

interface FormSizeState {
  size: string;
  stock: string;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
  sizeVariants: FormSizeState[];
  isActive: boolean;
}

const initialForm: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
  sizeVariants: [{ size: "", stock: "" }],
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

  const setSizeField = (
    index: number,
    key: keyof FormSizeState,
    value: string
  ): void => {
    setForm((prev) => ({
      ...prev,
      sizeVariants: prev.sizeVariants.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addSizeRow = (): void => {
    setForm((prev) => ({
      ...prev,
      sizeVariants: [...prev.sizeVariants, { size: "", stock: "" }],
    }));
  };

  const removeSizeRow = (index: number): void => {
    setForm((prev) => {
      if (prev.sizeVariants.length === 1) {
        return {
          ...prev,
          sizeVariants: [{ size: "", stock: "" }],
        };
      }

      return {
        ...prev,
        sizeVariants: prev.sizeVariants.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const buildPayloadSizes = (): ProductSizeVariant[] => {
    const normalized = form.sizeVariants
      .map((item) => ({
        size: item.size.trim().toUpperCase(),
        stock: Number(item.stock),
      }))
      .filter(
        (item) =>
          item.size.length > 0 &&
          Number.isInteger(item.stock) &&
          item.stock >= 0
      );

    const uniqueMap = new Map<string, number>();

    for (const item of normalized) {
      uniqueMap.set(item.size, item.stock);
    }

    return Array.from(uniqueMap.entries()).map(([size, stock]) => ({
      size,
      stock,
    }));
  };

  const submit = async (): Promise<void> => {
    const sizeVariants = buildPayloadSizes();

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
          imageUrl: form.imageUrl,
          categoryId: form.categoryId,
          sizeVariants,
          isActive: form.isActive,
        }),
      }
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
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      sizeVariants:
        product.sizeVariants.length > 0
          ? product.sizeVariants.map((item) => ({
              size: item.size,
              stock: String(item.stock),
            }))
          : [{ size: "", stock: "" }],
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

            const data = (await response.json()) as { url?: string };

            if (data.url) {
              setForm((prev) => ({
                ...prev,
                imageUrl: data.url || "",
              }));
            }
          }}
          className="rounded-xl border px-4 py-3 text-black"
        />

        {form.imageUrl ? (
          <img
            src={form.imageUrl}
            alt="preview"
            className="h-32 w-32 rounded-xl object-cover"
          />
        ) : null}

        <textarea
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          placeholder="Тайлбар"
          className="rounded-xl border px-4 py-3 text-black md:col-span-2"
          rows={4}
        />

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-black">Size болон stock</p>

            <button
              type="button"
              onClick={addSizeRow}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            >
              + Size нэмэх
            </button>
          </div>

          <div className="space-y-3">
            {form.sizeVariants.map((item, index) => (
              <div
                key={`${index}-${item.size}`}
                className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  value={item.size}
                  onChange={(event) =>
                    setSizeField(index, "size", event.target.value)
                  }
                  placeholder="Size (ж: S, M, L, XL)"
                  className="rounded-xl border px-4 py-3 text-black"
                />

                <input
                  value={item.stock}
                  onChange={(event) =>
                    setSizeField(index, "stock", event.target.value)
                  }
                  placeholder="Stock"
                  className="rounded-xl border px-4 py-3 text-black"
                />

                <button
                  type="button"
                  onClick={() => removeSizeRow(index)}
                  className="rounded-xl bg-red-600 px-4 py-3 text-white"
                >
                  Устгах
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-black md:col-span-2">
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
                  <p className="text-sm text-gray-500">{product.categoryName}</p>
                  <p className="text-sm text-black">
                    ₮{product.price.toLocaleString()} / Нийт үлдэгдэл: {product.stock}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizeVariants.map((item) => (
                      <span
                        key={`${product._id}-${item.size}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {item.size}: {item.stock}
                      </span>
                    ))}
                  </div>
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