// import LandingButtons from "@/components/LandingButtons";
// import { env } from "@/lib/env";
// import AnnouncementSection from "@/components/AnnouncementSection";

// export default function HomePage() {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black px-6 py-20 text-white">
//       {/* background blur circle */}
//       <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />

//       <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
//         <div className="space-y-4">
//           <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
//             {env.NEXT_PUBLIC_SITE_NAME}
//           </h1>

//           <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
//             Volleyball сургалтын бүртгэл болон онлайн дэлгүүрийн систем
//           </p>
//         </div>

//         <LandingButtons />

//         {/* small info */}
//         {/* <p className="mt-4 text-sm text-slate-400">
//           Сургалтанд бүртгүүлэх эсвэл дэлгүүрээс бараа захиалах боломжтой
//         </p> */}
//       </div>
//       {/* <div className="mt-12 rounded-3xl bg-white py-2 text-black">
//         <AnnouncementSection />
//       </div> */}
//     </main>
//   );
// }



// import LandingButtons from "@/components/LandingButtons";
// import { env } from "@/lib/env";

// export default function HomePage() {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
//       <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-500/20 blur-[120px]" />
//       <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px]" />

//       <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 ">
//         <div className="grid w-full items-center gap-12 lg:grid-cols-2">
//           {/* left */}
//           <div>
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
//               <span className="h-2 w-2 rounded-full bg-emerald-400" />
//               Live registration system
//             </div>

//             <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
//               {/* <span className="text-white">
//                 {env.NEXT_PUBLIC_SITE_NAME}
//               </span> */}
//               <span className="block bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
//                 volleyball platform
//               </span>
//             </h1>



//             <div className="mt-9">
//               <LandingButtons />
//             </div>
//           </div>

//           {/* right card */}
//           <div className="relative">
//             <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-sky-500/40 via-violet-500/30 to-fuchsia-500/30 blur-2xl" />

//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }




import LandingButtons from "@/components/LandingButtons";
import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-20 text-white">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.28),transparent_45%)]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-160px)] max-w-4xl flex-col items-center justify-center text-center">
        <h1 className="mb-10 text-4xl font-black tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-sky-300 via-white to-cyan-300 bg-clip-text text-transparent">
            Tsemz volleyball academy
          </span>
        </h1>

        <LandingButtons />
      </div>
    </main>
  );
}