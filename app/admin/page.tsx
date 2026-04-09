"use client";

import { useState } from "react";
import AdminBranches from "@/components/AdminBranches";
import AdminClassOptions from "@/components/AdminClassOptions";
import AdminClassSeasons from "@/components/AdminClassSeasons";
import AdminRegistrations from "@/components/AdminRegistrations";
import AdminSchedules from "@/components/AdminSchedules";
import AdminCategories from "@/components/AdminCategories";
import AdminProducts from "@/components/AdminProducts";
import AdminOrders from "@/components/AdminOrders";
import { BranchDto } from "@/types/branch";
import { ClassOptionDto } from "@/types/class-option";
import { RegistrationDto } from "@/types/registration";
import { ScheduleTemplateDto } from "@/types/schedule-template";

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState<string>("");
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [schedules, setSchedules] = useState<ScheduleTemplateDto[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionDto[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationDto[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchAll = async (): Promise<void> => {
    if (!adminSecret.trim()) {
      setMessage("Admin secret оруулна уу");
      return;
    }

    const [branchesResponse, schedulesResponse, classOptionsResponse, registrationsResponse] =
      await Promise.all([
        fetch("/api/admin/branches", {
          headers: { "x-admin-secret": adminSecret },
        }),
        fetch("/api/admin/schedules", {
          headers: { "x-admin-secret": adminSecret },
        }),
        fetch("/api/admin/class-options", {
          headers: { "x-admin-secret": adminSecret },
        }),
        fetch("/api/admin/registrations", {
          headers: { "x-admin-secret": adminSecret },
        }),
      ]);

    if (
      !branchesResponse.ok ||
      !schedulesResponse.ok ||
      !classOptionsResponse.ok ||
      !registrationsResponse.ok
    ) {
      setMessage("Admin secret буруу байна");
      setAuthorized(false);
      return;
    }

    const branchesData = (await branchesResponse.json()) as BranchDto[];
    const schedulesData = (await schedulesResponse.json()) as ScheduleTemplateDto[];
    const classOptionsData = (await classOptionsResponse.json()) as ClassOptionDto[];
    const registrationsData = (await registrationsResponse.json()) as RegistrationDto[];

    setBranches(branchesData);
    setSchedules(schedulesData);
    setClassOptions(classOptionsData);
    setRegistrations(registrationsData);
    setAuthorized(true);
    setMessage("");
  };

  if (!authorized) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-slate-900">Admin panel</h1>
          <p className="mt-2 text-sm text-slate-600">Admin secret оруулна уу</p>

          <input
            type="password"
            value={adminSecret}
            onChange={(event) => setAdminSecret(event.target.value)}
            className="mt-4 w-full rounded-xl border px-4 py-3"
            placeholder="Admin secret"
          />

          <button
            type="button"
            onClick={() => void fetchAll()}
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
          >
            Нэвтрэх
          </button>

          {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Admin panel</h1>

          <button
            type="button"
            onClick={() => {
              setAuthorized(false);
              setAdminSecret("");
              setMessage("");
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Гарах
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 text-black">
          <AdminBranches adminSecret={adminSecret} onCreated={fetchAll} />
          <AdminSchedules adminSecret={adminSecret} onCreated={fetchAll} />
          <AdminClassOptions
            adminSecret={adminSecret}
            branches={branches}
            schedules={schedules}
            onCreated={fetchAll}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 text-black">
          <AdminClassSeasons
            adminSecret={adminSecret}
            classOptions={classOptions}
            onCreated={fetchAll}
          />
        </div>

        <AdminRegistrations registrations={registrations} />

        <section className="rounded-2xl bg-white p-5 shadow">
          <h2 className="text-xl font-semibold text-slate-900">Ангиуд</h2>

          <div className="mt-4 grid gap-3">
            {classOptions.map((item) => (
              <div key={item._id} className="rounded-xl border p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-black">{item.ageRangeLabel}</p>
                <p className="text-sm text-black">
                  Үнэ: {item.price.toLocaleString()}₮
                </p>
                <p className="text-sm text-black">Status: {item.status}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6">
          <AdminCategories adminSecret={adminSecret} />
          <AdminProducts adminSecret={adminSecret} />
          <AdminOrders adminSecret={adminSecret} />
        </div>
      </div>
    </main>
  );
}