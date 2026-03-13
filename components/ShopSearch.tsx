"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ShopSearch({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Бараа хайх"
      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
    />
  );
}