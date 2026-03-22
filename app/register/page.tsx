import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-cyan-200 backdrop-blur">
            Volleyball Academy
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Волейболын сургалтын бүртгэл
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Доорх мэдээллийг үнэн зөв бөглөж, ангиа сонгон төлбөр төлснөөр
            бүртгэл тань баталгаажна.
          </p>
        </div>

        <RegistrationForm />
      </div>
    </main>
  );
}