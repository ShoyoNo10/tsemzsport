import Link from "next/link";

export default function LandingButtons() {
  return (
    <div className="mt-4 flex w-full max-w-md flex-col gap-4 sm:flex-row">
      
      <Link
        href="/register"
        className="flex flex-1 items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02]"
      >
        🏐 Сургалт
      </Link>

      <Link
        href="/shop"
        className="flex flex-1 items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white hover:text-black"
      >
        🛍 Дэлгүүр
      </Link>

            <Link
        href="/announcements"
        className="flex flex-1 items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02]"
      >
        Зар
      </Link>

    </div>
  );
}