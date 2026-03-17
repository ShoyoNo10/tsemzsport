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
    if (!selectedClass) {
      return null;
    }

    return branches.find((item) => item._id === selectedClass.branchId) ?? null;
  }, [branches, selectedClass]);

  const selectedSchedule = useMemo(() => {
    if (!selectedClass) {
      return null;
    }

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
    return <div className="text-white">Уншиж байна...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Овог</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Нэр</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Регистр</label>
          <input
            name="registerNumber"
            value={form.registerNumber}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 uppercase outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Утас 1</label>
          <input
            name="phonePrimary"
            value={form.phonePrimary}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Яаралтай үед утас
          </label>
          <input
            name="phoneEmergency"
            value={form.phoneEmergency}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Анги сонголт
          </label>
          <select
            name="classOptionId"
            value={form.classOptionId}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">Сонгоно уу</option>
            {classOptions.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title} — {item.ageRangeLabel} — {item.price.toLocaleString()}₮
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">Гэрийн хаяг</label>
        <textarea
          name="homeAddress"
          value={form.homeAddress}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      {selectedClass && selectedBranch && selectedSchedule ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-800">Сонгосон ангийн мэдээлэл</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>
              <span className="font-semibold">Анги:</span> {selectedClass.title}
            </p>
            <p>
              <span className="font-semibold">Насны ангилал:</span>{" "}
              {selectedClass.ageRangeLabel}
            </p>
            <p>
              <span className="font-semibold">Үнэ:</span>{" "}
              {selectedClass.price.toLocaleString()}₮
            </p>
            <p>
              <span className="font-semibold">Салбар:</span> {selectedBranch.name}
            </p>
            <p>
              <span className="font-semibold">Хаяг:</span> {selectedBranch.address}
            </p>
            <p>
              <span className="font-semibold">7 хоногт:</span>{" "}
              {selectedSchedule.sessionsPerWeek} удаа
            </p>
            <div>
              <span className="font-semibold">Цагийн хуваарь:</span>
              <ul className="mt-2 list-disc pl-5">
                {selectedSchedule.slots.map((slot, index) => (
                  <li key={`${slot.day}-${slot.startTime}-${slot.endTime}-${index}`}>
                    {slot.day} — {slot.startTime} - {slot.endTime}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void handleSubmit()}
        disabled={!isFormValid || submitting}
        className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitting ? "Түр хүлээнэ үү..." : "Төлбөр төлөх"}
      </button>
    </div>
  );
}