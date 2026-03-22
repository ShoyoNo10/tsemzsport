import CartList from "@/components/CartList";
import Link from "next/link";

export default function CartPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 pb-20 pt-4 text-white">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-100px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* header */}
        <div className="mb-6 overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
              >
                <span>←</span>
                <span>Дэлгүүр</span>
              </Link>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Сагс
              </h1>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                Таны сонгосон бараануудын жагсаалт
              </p>
            </div>
{/* 
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg transition duration-200 hover:scale-[1.02]"
            >
              Дахин бараа үзэх
            </Link> */}
          </div>
        </div>

        {/* cart list */}
        <CartList />
      </div>
    </main>
  );
}