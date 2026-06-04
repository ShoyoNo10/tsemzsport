"use client";

import { useEffect, useMemo, useState } from "react";
import { BranchDto } from "@/types/branch";
import { ClassOptionDto } from "@/types/class-option";
import { ClassSeasonDto } from "@/types/class-season";
import { ScheduleTemplateDto } from "@/types/schedule-template";

type ClassOptionWithAgreement = ClassOptionDto & {
  agreementText?: string;
};

interface BootstrapResponse {
  branches: BranchDto[];
  schedules: ScheduleTemplateDto[];
  classOptions: ClassOptionWithAgreement[];
  classSeasons: ClassSeasonDto[];
}

interface FormState {
  lastName: string;
  firstName: string;
  registerNumber: string;
  age: string;
  gender: string;
  phonePrimary: string;
  phoneEmergency: string;
  homeAddress: string;
  classOptionId: string;
  classSeasonId: string;
}

const initialFormState: FormState = {
  lastName: "",
  firstName: "",
  registerNumber: "",
  age: "",
  gender: "",
  phonePrimary: "",
  phoneEmergency: "",
  homeAddress: "",
  classOptionId: "",
  classSeasonId: "",
};

const dayMap: Record<string, string> = {
  Monday: "Даваа",
  Tuesday: "Мягмар",
  Wednesday: "Лхагва",
  Thursday: "Пүрэв",
  Friday: "Баасан",
  Saturday: "Бямба",
  Sunday: "Ням",
};

export default function RegistrationForm() {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [branches, setBranches] = useState<BranchDto[]>([]);
  const [schedules, setSchedules] = useState<ScheduleTemplateDto[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOptionWithAgreement[]>(
    [],
  );
  const [classSeasons, setClassSeasons] = useState<ClassSeasonDto[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState<boolean>(false);
  const [agreementAccepted, setAgreementAccepted] = useState<boolean>(false);
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
        setClassSeasons(data.classSeasons);
      } catch {
        setErrorMessage("Өгөгдөл ачаалж чадсангүй");
      } finally {
        setLoading(false);
      }
    };

    void fetchBootstrap();
  }, []);

  useEffect(() => {
    if (isModalOpen || isAgreementOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isAgreementOpen]);

  const filteredClassOptions = useMemo(() => {
    if (!selectedBranchId) return [];
    return classOptions.filter((item) => item.branchId === selectedBranchId);
  }, [classOptions, selectedBranchId]);

  const selectedClass = useMemo(() => {
    return classOptions.find((item) => item._id === form.classOptionId) ?? null;
  }, [classOptions, form.classOptionId]);

  const hasAgreement = useMemo(() => {
    return Boolean(selectedClass?.agreementText?.trim());
  }, [selectedClass]);

  const selectedBranch = useMemo(() => {
    if (!selectedBranchId) return null;
    return branches.find((item) => item._id === selectedBranchId) ?? null;
  }, [branches, selectedBranchId]);

  const selectedSchedule = useMemo(() => {
    if (!selectedClass) return null;
    return (
      schedules.find((item) => item._id === selectedClass.scheduleTemplateId) ??
      null
    );
  }, [schedules, selectedClass]);

  const filteredSeasons = useMemo(() => {
    if (!form.classOptionId) return [];
    return classSeasons.filter(
      (item) =>
        item.classOptionId === form.classOptionId && item.status === "active",
    );
  }, [classSeasons, form.classOptionId]);

  const selectedSeason = useMemo(() => {
    return classSeasons.find((item) => item._id === form.classSeasonId) ?? null;
  }, [classSeasons, form.classSeasonId]);

  const isFormValid = useMemo(() => {
    return (
      selectedBranchId.trim().length > 0 &&
      form.lastName.trim().length > 0 &&
      form.firstName.trim().length > 0 &&
      form.registerNumber.trim().length > 0 &&
      form.age.trim().length > 0 &&
      Number(form.age) > 0 &&
      form.gender.trim().length > 0 &&
      form.phonePrimary.trim().length > 0 &&
      form.phoneEmergency.trim().length > 0 &&
      form.homeAddress.trim().length > 0 &&
      form.classOptionId.trim().length > 0 &&
      form.classSeasonId.trim().length > 0 &&
      !!selectedSeason &&
      !selectedSeason.isFull
    );
  }, [selectedBranchId, form, selectedSeason]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleBranchSelect = (branchId: string): void => {
    setSelectedBranchId(branchId);
    setForm((previous) => ({
      ...previous,
      classOptionId: "",
      classSeasonId: "",
    }));
    setAgreementAccepted(false);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleBack = (): void => {
    setIsModalOpen(false);
    setIsAgreementOpen(false);
    setAgreementAccepted(false);
    setForm((previous) => ({
      ...previous,
      classOptionId: "",
      classSeasonId: "",
    }));
  };

  const handleClassChange = (value: string): void => {
    setForm((previous) => ({
      ...previous,
      classOptionId: value,
      classSeasonId: "",
    }));
    setAgreementAccepted(false);
  };

  const handleOpenAgreement = (): void => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Бүх талбарыг зөв бөглөнө үү");
      return;
    }

    if (hasAgreement) {
      setAgreementAccepted(false);
      setIsAgreementOpen(true);
      return;
    }

    void handleSubmit(true);
  };

  const handleSubmit = async (skipAgreementCheck = false): Promise<void> => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!isFormValid) {
      setErrorMessage("Бүх талбарыг зөв бөглөнө үү");
      return;
    }

    if (hasAgreement && !agreementAccepted && !skipAgreementCheck) {
      setErrorMessage("Гэрээг уншиж зөвшөөрсний дараа төлбөр төлнө үү");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      const result = (await response.json()) as {
        message: string;
        registration?: {
          _id: string;
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
    } catch {
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
    <>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Бүртгэлийн мэдээлэл
            </h2>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Салбар сонгох
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {[...branches].reverse().map((branch) => {
                const isSelected = selectedBranchId === branch._id;

                return (
                  <button
                    key={branch._id}
                    type="button"
                    onClick={() => handleBranchSelect(branch._id)}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      isSelected
                        ? "border-cyan-500 ring-4 ring-cyan-500/20"
                        : "border-white/10 hover:border-cyan-300"
                    }`}
                  >
                    <div className="aspect-[16/10] bg-slate-100">
                      <img
                        src={branch.imageUrl}
                        alt={branch.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900">
                        {branch.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {branch.address}
                      </p>
                      {branch.description ? (
                        <p className="mt-2 text-sm text-slate-600">
                          {branch.description}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <h3 className="text-xl font-bold">Салбаруудын хичээлийн хуваарь</h3>

            <div className="mt-4 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold text-white">
                  📍 Салбар 1 — БГД, Модны 2
                </p>
                <p className="mt-1">
                  Сан их сургуулийн заал, Макс Молл-н эсрэг талд
                </p>
                <div className="mt-3 space-y-1">
                  {/* <p>✅ 9-15 нас: Пүрэв 19:00, Бямба 11:00</p> */}
                  {/* <p>
                    ✅ Насанд хүрэгчид /эрэгтэй/: Лхагва 19:00, Бямба 13:00
                  </p> */}
                  <p>
                    ✅ Насанд хүрэгчид /эмэгтэй/: 6 сарын 6нд 11:00, 6 сарын 8,
                    10, 15, 17, 19, 24, 26нд 19:00 цаг
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold text-white">
                  📍 Салбар 2 — ХУД, Мишээл
                </p>
                <div className="mt-3 space-y-1">
                  <p>✅ 9-12 нас: Лхагва 16:00, Бямба 17:00</p>
                  <p>✅ 13-16 нас: Лхагва 18:00, Бямба 19:00</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="font-semibold text-white">
                  📍 Зуны зуслан эрчимжүүлсэн сургалт
                </p>
                <div className="mt-3 space-y-1">
                  <p>✅ 1-р ээлж 6 сарын 27 - 7 сарын 3</p>
                  <p>✅ 2-р ээлж 7 сарын 3 - 7 сарын 8</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                📞 Холбоо барих: 99001522
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Бүртгэлийн форм
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedBranch?.name ?? "Салбар"} салбарын бүртгэл
                </p>
              </div>

              <button
                type="button"
                onClick={handleBack}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Буцах
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClassName}>Анги сонголт</label>
                <select
                  name="classOptionId"
                  value={form.classOptionId}
                  onChange={(event) => handleClassChange(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Сонгоно уу</option>
                  {filteredClassOptions.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.title} — {item.ageRangeLabel} —{" "}
                      {item.price.toLocaleString()}₮
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
                        <p className="mt-1 text-slate-600">
                          {selectedClass.ageRangeLabel}
                        </p>
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
                        <p className="mt-1 text-slate-600">
                          {selectedBranch.address}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                          7 хоногт
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {selectedSchedule.displayLabel?.trim()
                            ? selectedSchedule.displayLabel
                            : `7 хоногт ${selectedSchedule.sessionsPerWeek} удаа`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                        Цагийн хуваарь
                      </p>

                      {selectedSchedule.slots.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {selectedSchedule.slots.map((slot, index) => (
                            <li
                              key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                            >
                              <span className="font-medium text-slate-800">
                                {dayMap[slot.day] ?? slot.day}
                              </span>
                              <span className="text-slate-600">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          Цагийн хуваарь тогтмол биш
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
                    <h3 className="text-base font-bold text-slate-900">
                      Сонгосон ангийн мэдээлэл
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Анги сонгосны дараа энд гарч ирнэ.
                    </p>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClassName}>Сар сонголт</label>
                <select
                  name="classSeasonId"
                  value={form.classSeasonId}
                  onChange={handleChange}
                  className={inputClassName}
                  disabled={!form.classOptionId}
                >
                  <option value="">Сонгоно уу</option>
                  {filteredSeasons.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                      disabled={item.isFull}
                    >
                      {item.seasonLabel}
                      {item.isFull
                        ? " — Дүүрсэн"
                        : ` — Үлдсэн суудал: ${item.remainingSeats}`}
                    </option>
                  ))}
                </select>
              </div>

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
                <label className={labelClassName}>Нас</label>
                <input
                  name="age"
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Жишээ: 14"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>Хүйс</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Сонгоно уу</option>
                  <option value="male">Эрэгтэй</option>
                  <option value="female">Эмэгтэй</option>
                </select>
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
                <label className={labelClassName}>
                  Яаралтай үед холбогдох утас
                </label>
                <input
                  name="phoneEmergency"
                  value={form.phoneEmergency}
                  onChange={handleChange}
                  placeholder="88112233"
                  className={inputClassName}
                />
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

            {selectedSeason?.isFull ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Энэ сарын бүртгэл дүүрсэн тул бүртгүүлэх боломжгүй.
              </div>
            ) : null}

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
              onClick={handleOpenAgreement}
              disabled={!isFormValid || submitting}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
            >
              {submitting ? "Түр хүлээнэ үү..." : "Төлбөр төлөх"}
            </button>
          </div>
        </div>
      )}

      {isAgreementOpen && hasAgreement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-[28px] bg-white p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Сургалтын гэрээ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Гэрээг уншиж зөвшөөрсний дараа төлбөр төлөх хэсэг рүү
                  үргэлжилнэ.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAgreementOpen(false);
                  setAgreementAccepted(false);
                }}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Хаах
              </button>
            </div>

            <div className="mt-5 max-h-[52vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <div className="whitespace-pre-wrap">
                {selectedClass?.agreementText}
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={agreementAccepted}
                onChange={(event) => setAgreementAccepted(event.target.checked)}
                className="mt-1 h-4 w-4 accent-cyan-600"
              />
              <span>
                Би сургалтын гэрээг уншиж танилцсан бөгөөд нөхцөлийг зөвшөөрч
                байна.
              </span>
            </label>

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!agreementAccepted || submitting}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
            >
              {submitting ? "Түр хүлээнэ үү..." : "Зөвшөөрч төлбөр төлөх"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
