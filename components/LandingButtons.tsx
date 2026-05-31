// import Link from "next/link";

// export default function LandingButtons() {
//   return (
//     <div className="mt-4 flex w-full max-w-md flex-col gap-4 sm:flex-row">
      
//       <Link
//         href="/register"
//         className="flex flex-1 items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02]"
//       >
//         🏐 Сургалт
//       </Link>

//       <Link
//         href="/shop"
//         className="flex flex-1 items-center justify-center rounded-2xl border border-white/30 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white hover:text-black"
//       >
//         🛍 Дэлгүүр
//       </Link>

//             <Link
//         href="/announcements"
//         className="flex flex-1 items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-bold text-black shadow-lg transition hover:scale-[1.02]"
//       >
//         Зар
//       </Link>

//     </div>
//   );
// }



import Link from "next/link";

export default function LandingButtons() {
  return (
    <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <Link
        href="/register"
        className="group rounded-2xl border border-sky-500/30 bg-sky-500/10 px-6 py-5 text-center font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:bg-sky-500/20"
      >
        <div className="text-2xl">🏐</div>
        <div className="mt-2">Сургалт</div>
      </Link>

      <Link
        href="/shop"
        className="group rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-center font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
      >
        <div className="text-2xl">🛍</div>
        <div className="mt-2">Дэлгүүр</div>
      </Link>

      <Link
        href="/announcements"
        className="group rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-5 text-center font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-violet-400 hover:bg-violet-500/20"
      >
        <div className="text-2xl">📢</div>
        <div className="mt-2">Зар</div>
      </Link>
    </div>
  );
}