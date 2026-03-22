"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ShopSearch({ value, onChange }: Props) {
  return (
    <div className="relative">
      {/* icon */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </div>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Бараа хайх..."
        className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15"
      />

      {/* clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
        >
          ✕
        </button>
      )}
    </div>
  );
}