import RegistrationForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Волейболын сургалтын бүртгэл</h1>
        <p className="mt-2 text-slate-600">
          Доорх мэдээллийг үнэн зөв бөглөж төлбөр төлснөөр бүртгэл үүснэ.
        </p>
      </div>

      <RegistrationForm />
    </main>
  );
}