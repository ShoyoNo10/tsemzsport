"use client";

import { useEffect, useMemo, useState } from "react";
import { BranchDto } from "@/types/branch";
import { ClassOptionDto } from "@/types/class-option";
import { ScheduleTemplateDto } from "@/types/schedule-template";

interface BootstrapResponse {
  branches: BranchDto[];
  schedules: ScheduleTemplateDto[];
  classOptions: ClassOptionDto[];
}

interface FormState {
  lastName: string;
  firstName: string;
  registerNumber: string;
  phonePrimary: string;
  phoneEmergency: string;
  homeAddress: string;
  classOptionId: string;
}

const initialFormState: FormState = {
  lastName: "",
  firstName: "",
  registerNumber: "",
  phonePrimary: "",
  phoneEmergency: "",
  homeAddress: "",
  classOptionId: "",
};

export default function RegistrationForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [schedules, setSchedules] = useState<ScheduleTemplateDto[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionDto[]>([]);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchBootstrap = async (): Promise<void> => {
      try {
        const response = await fetch("/api/public/bootstrap");
        const data = (await response.json()) as BootstrapResponse;

        setBranches(data.branches);
        setSchedules(data.schedules);
        setClassOptions(data.classOptions);
      } catch (error) {
        setErrorMessage("Өгөгдөл ачаалж чадсангүй");
      } finally {
        setLoading(false);
      }
    };

    void fetchBootstrap();
  }, []);

  const selectedClass = useMemo(() => {
    return classOptions.find((item) => item._id === form.classOptionId) ?? null;
  }, [classOptions, form.classOptionId]);

  const selectedBranch = useMemo(() => {
    if (!selectedClass) return null;
    return branches.find((item) => item._id === selectedClass.branchId) ?? null;
  }, [branches, selectedClass]);

  const selectedSchedule = useMemo(() => {
    if (!selectedClass) return null;
    return (
      schedules.find((item) => item._id === selectedClass.scheduleTemplateId) ?? null
    );
  }, [schedules, selectedClass]);

  const isFormValid = useMemo(() => {
    return (
      form.lastName.trim().length > 0 &&
      form.firstName.trim().length > 0 &&
      form.registerNumber.trim().length > 0 &&
      form.phonePrimary.trim().length > 0 &&
      form.phoneEmergency.trim().length > 0 &&
      form.homeAddress.trim().length > 0 &&
      form.classOptionId.trim().length > 0
    );
  }, [form]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Бүх талбарыг бөглөнө үү");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        message: string;
        registration?: {
          _id: string;
          status: string;
          paymentStatus: string;
          qpayInvoiceId: string;
          qpayQrText: string;
          qpayQrImage: string;
          qpayPaymentUrl: string;
          qpayDeepLink: string;
          qpayShortUrl: string;
          qpayUrls: {
            name: string;
            description: string;
            logo: string;
            link: string;
          }[];
        };
      };

      if (!response.ok) {
        setErrorMessage(result.message ?? "Алдаа гарлаа");
        return;
      }

      setSuccessMessage(result.message);

      if (result.registration?._id) {
        window.location.href = `/payment/${result.registration._id}`;
      }
    } catch (error) {
      setErrorMessage("Сервертэй холбогдож чадсангүй");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400" />
        <p className="text-sm text-slate-200">Уншиж байна...</p>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15";
  const labelClassName = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Бүртгэлийн мэдээлэл
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Мэдээллээ зөв бөглөөд ангиа сонгоно уу.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClassName}>Овог</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Жишээ: Бат"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Нэр</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Жишээ: Тэмүүлэн"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Регистрийн дугаар</label>
            <input
              name="registerNumber"
              value={form.registerNumber}
              onChange={handleChange}
              placeholder="AA00000000"
              className={`${inputClassName} uppercase`}
            />
          </div>

          <div>
            <label className={labelClassName}>Утасны дугаар</label>
            <input
              name="phonePrimary"
              value={form.phonePrimary}
              onChange={handleChange}
              placeholder="99112233"
              className={inputClassName}
            />
          </div>

          <div>
            <label className={labelClassName}>Яаралтай үед холбогдох утас</label>
            <input
              name="phoneEmergency"
              value={form.phoneEmergency}
              onChange={handleChange}
              placeholder="88112233"
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClassName}>Анги сонголт</label>
            <select
              name="classOptionId"
              value={form.classOptionId}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="">Сонгоно уу</option>
              {classOptions.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title} — {item.ageRangeLabel} — {item.price.toLocaleString()}₮
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            {selectedClass && selectedBranch && selectedSchedule ? (
              <div className="rounded-[24px] border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Сонгосон ангийн мэдээлэл
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      Анги
                    </p>
                    <p className="mt-1 text-base font-bold text-slate-900">
                      {selectedClass.title}
                    </p>
                    <p className="mt-1 text-slate-600">{selectedClass.ageRangeLabel}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      Үнэ
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {selectedClass.price.toLocaleString()}₮
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      Салбар
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedBranch.name}
                    </p>
                    <p className="mt-1 text-slate-600">{selectedBranch.address}</p>
                  </div>

                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      7 хоногт
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {selectedSchedule.sessionsPerWeek} удаа
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Цагийн хуваарь
                  </p>

                  <ul className="mt-3 space-y-2">
                    {selectedSchedule.slots.map((slot, index) => (
                      <li
                        key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                      >
                        <span className="font-medium text-slate-800">{slot.day}</span>
                        <span className="text-slate-600">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-900">
                  Сонгосон ангийн мэдээлэл
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Анги сонгосны дараа үнэ, салбар, хуваарь энд гарч ирнэ.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClassName}>Гэрийн хаяг</label>
          <textarea
            name="homeAddress"
            value={form.homeAddress}
            onChange={handleChange}
            rows={4}
            placeholder="Дэлгэрэнгүй хаягаа бичнэ үү"
            className={`${inputClassName} resize-none`}
          />
        </div>

        {errorMessage ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!isFormValid || submitting}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
        >
          {submitting ? "Түр хүлээнэ үү..." : "Төлбөр төлөх"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <h3 className="text-xl font-bold">Яагаад манай сургалт?</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/10 p-4">
              ✅ Түвшин бүрт тохирсон анги
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              ✅ Тогтмол хуваарь, орчин нөхцөл
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              ✅ Хурдан бүртгэл, шууд төлбөр
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}