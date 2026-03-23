import AnnouncementSection from "@/components/AnnouncementSection";
import Header from "@/components/Header";

export default function Page() {
  return (
    <>
    <Header/>
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative">
        <AnnouncementSection />
      </div>
    </main>
    </>
  );
}