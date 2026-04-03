// "use client";

// import { useState } from "react";
// import { BranchDto } from "@/types/branch";
// import { ScheduleTemplateDto } from "@/types/schedule-template";

// interface AdminClassOptionsProps {
//   adminSecret: string;
//   branches: BranchDto[];
//   schedules: ScheduleTemplateDto[];
//   onCreated: () => Promise<void>;
// }

// export default function AdminClassOptions({
//   adminSecret,
//   branches,
//   schedules,
//   onCreated,
// }: AdminClassOptionsProps){
//   const [title, setTitle] = useState<string>("");
//   const [ageRangeLabel, setAgeRangeLabel] = useState<string>("");
//   const [price, setPrice] = useState<number>(0);
//   const [branchId, setBranchId] = useState<string>("");
//   const [scheduleTemplateId, setScheduleTemplateId] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [status, setStatus] = useState<"active" | "inactive">("active");
//   const [message, setMessage] = useState<string>("");

//   const handleCreate = async (): Promise<void> => {
//     setMessage("");

//     const response = await fetch("/api/admin/class-options", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "x-admin-secret": adminSecret,
//       },
//       body: JSON.stringify({
//         title,
//         ageRangeLabel,
//         price,
//         branchId,
//         scheduleTemplateId,
//         description,
//         status,
//       }),
//     });

//     const result = (await response.json()) as { message?: string };

//     if (!response.ok) {
//       setMessage(result.message ?? "Алдаа гарлаа");
//       return;
//     }

//     setTitle("");
//     setAgeRangeLabel("");
//     setPrice(0);
//     setBranchId("");
//     setScheduleTemplateId("");
//     setDescription("");
//     setStatus("active");
//     setMessage("Анги амжилттай нэмэгдлээ");
//     await onCreated();
//   };

//   return (
//     <section className="rounded-2xl bg-white p-5 shadow">
//       <h2 className="text-xl font-semibold text-slate-900">Анги нэмэх</h2>

//       <div className="mt-4 grid gap-3">
//         <input
//           value={title}
//           onChange={(event) => setTitle(event.target.value)}
//           placeholder="Жишээ: Beginner анги"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           value={ageRangeLabel}
//           onChange={(event) => setAgeRangeLabel(event.target.value)}
//           placeholder="Жишээ: 13-15 нас"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           type="number"
//           value={price}
//           onChange={(event) => setPrice(Number(event.target.value))}
//           placeholder="Үнэ"
//           className="rounded-xl border px-4 py-3"
//         />

//         <select
//           value={branchId}
//           onChange={(event) => setBranchId(event.target.value)}
//           className="rounded-xl border px-4 py-3"
//         >
//           <option value="">Салбар сонгох</option>
//           {branches.map((branch) => (
//             <option key={branch._id} value={branch._id}>
//               {branch.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={scheduleTemplateId}
//           onChange={(event) => setScheduleTemplateId(event.target.value)}
//           className="rounded-xl border px-4 py-3"
//         >
//           <option value="">Хуваарь сонгох</option>
//           {schedules.map((schedule) => (
//             <option key={schedule._id} value={schedule._id}>
//               {schedule.title}
//             </option>
//           ))}
//         </select>

//         <textarea
//           value={description}
//           onChange={(event) => setDescription(event.target.value)}
//           placeholder="Тайлбар"
//           rows={3}
//           className="rounded-xl border px-4 py-3"
//         />

//         <select
//           value={status}
//           onChange={(event) =>
//             setStatus(event.target.value as "active" | "inactive")
//           }
//           className="rounded-xl border px-4 py-3"
//         >
//           <option value="active">active</option>
//           <option value="inactive">inactive</option>
//         </select>

//         <button
//           type="button"
//           onClick={() => void handleCreate()}
//           className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
//         >
//           Анги нэмэх
//         </button>

//         {message ? <p className="text-sm text-slate-600">{message}</p> : null}
//       </div>
//     </section>
//   );
// }







"use client";

import { useState } from "react";
import { BranchDto } from "@/types/branch";
import { ScheduleTemplateDto } from "@/types/schedule-template";

interface AdminClassOptionsProps {
  adminSecret: string;
  branches: BranchDto[];
  schedules: ScheduleTemplateDto[];
  onCreated: () => Promise<void>;
}

export default function AdminClassOptions({
  adminSecret,
  branches,
  schedules,
  onCreated,
}: AdminClassOptionsProps) {
  const [title, setTitle] = useState<string>("");
  const [ageRangeLabel, setAgeRangeLabel] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [branchId, setBranchId] = useState<string>("");
  const [scheduleTemplateId, setScheduleTemplateId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(20);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const handleCreate = async (): Promise<void> => {
    setMessage("");

    const response = await fetch("/api/admin/class-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({
        title,
        ageRangeLabel,
        price,
        branchId,
        scheduleTemplateId,
        description,
        capacity,
        isOpen,
        status,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(result.message ?? "Алдаа гарлаа");
      return;
    }

    setTitle("");
    setAgeRangeLabel("");
    setPrice(0);
    setBranchId("");
    setScheduleTemplateId("");
    setDescription("");
    setCapacity(20);
    setIsOpen(true);
    setStatus("active");
    setMessage("Анги амжилттай нэмэгдлээ");
    await onCreated();
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow">
      <h2 className="text-xl font-semibold text-slate-900">Анги нэмэх</h2>

      <div className="mt-4 grid gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Жишээ: Beginner анги"
          className="rounded-xl border px-4 py-3"
        />

        <input
          value={ageRangeLabel}
          onChange={(event) => setAgeRangeLabel(event.target.value)}
          placeholder="Жишээ: 13-15 нас"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          placeholder="Үнэ"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="number"
          value={capacity}
          onChange={(event) => setCapacity(Number(event.target.value))}
          placeholder="Нийт суудлын тоо"
          className="rounded-xl border px-4 py-3"
        />

        <select
          value={isOpen ? "open" : "closed"}
          onChange={(event) => setIsOpen(event.target.value === "open")}
          className="rounded-xl border px-4 py-3"
        >
          <option value="open">Бүртгэл нээлттэй</option>
          <option value="closed">Бүртгэл хаалттай</option>
        </select>

        <select
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="">Салбар сонгох</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name}
            </option>
          ))}
        </select>

        <select
          value={scheduleTemplateId}
          onChange={(event) => setScheduleTemplateId(event.target.value)}
          className="rounded-xl border px-4 py-3"
        >
          <option value="">Хуваарь сонгох</option>
          {schedules.map((schedule) => (
            <option key={schedule._id} value={schedule._id}>
              {schedule.title}
            </option>
          ))}
        </select>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Тайлбар"
          rows={3}
          className="rounded-xl border px-4 py-3"
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "active" | "inactive")
          }
          className="rounded-xl border px-4 py-3"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <button
          type="button"
          onClick={() => void handleCreate()}
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
        >
          Анги нэмэх
        </button>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </section>
  );
}