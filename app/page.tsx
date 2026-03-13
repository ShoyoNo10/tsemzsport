import LandingButtons from "@/components/LandingButtons";
import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black px-6 py-20 text-white">
      
      {/* background blur circle */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {env.NEXT_PUBLIC_SITE_NAME}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
            Volleyball сургалтын бүртгэл болон онлайн дэлгүүрийн систем
          </p>
        </div>

        <LandingButtons />

        {/* small info */}
        <p className="mt-4 text-sm text-slate-400">
          Сургалтанд бүртгүүлэх эсвэл дэлгүүрээс бараа захиалах боломжтой
        </p>
      </div>
    </main>
  );
}