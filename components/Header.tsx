"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Сургалт", href: "/register", icon: "🏐" },
    { name: "Дэлгүүр", href: "/shop", icon: "🛍️" },
    { name: "Зар", href: "/announcements", icon: "📢" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-lg shadow-[0_10px_30px_rgba(14,165,233,0.35)]">
            🏐
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Tsemz
            </p>
            <h1 className="text-base font-black text-white sm:text-lg">
              TsemzSport
            </h1>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-[22px] border border-white/10 bg-white/5 p-1.5 backdrop-blur">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 ${
                  active
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}