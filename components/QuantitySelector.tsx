"use client";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: Props) {
  const decrease = (): void => {
    onChange(Math.max(min, value - 1));
  };

  const increase = (): void => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-300">
      <button type="button" onClick={decrease} className="px-4 py-2 text-lg">
        -
      </button>
      <div className="min-w-12 text-center text-sm font-semibold">{value}</div>
      <button type="button" onClick={increase} className="px-4 py-2 text-lg">
        +
      </button>
    </div>
  );
}