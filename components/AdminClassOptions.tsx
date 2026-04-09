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
// }: AdminClassOptionsProps) {
//   const [title, setTitle] = useState<string>("");
//   const [ageRangeLabel, setAgeRangeLabel] = useState<string>("");
//   const [seasonLabel, setSeasonLabel] = useState<string>("");
//   const [price, setPrice] = useState<number>(0);
//   const [branchId, setBranchId] = useState<string>("");
//   const [scheduleTemplateId, setScheduleTemplateId] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [capacity, setCapacity] = useState<number>(20);
//   const [isOpen, setIsOpen] = useState<boolean>(true);
//   const [status, setStatus] = useState<"active" | "inactive">("active");
//   const [message, setMessage] = useState<string>("");

//   const selectedBranch = branches.find((item) => item._id === branchId) ?? null;

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
//         seasonLabel,
//         price,
//         branchId,
//         scheduleTemplateId,
//         description,
//         capacity,
//         isOpen,
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
//     setSeasonLabel("");
//     setPrice(0);
//     setBranchId("");
//     setScheduleTemplateId("");
//     setDescription("");
//     setCapacity(20);
//     setIsOpen(true);
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
//           placeholder="Жишээ: 9-12 нас"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           value={seasonLabel}
//           onChange={(event) => setSeasonLabel(event.target.value)}
//           placeholder="Жишээ: 4-5 сар, 7-8 сар"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           type="number"
//           value={price}
//           onChange={(event) => setPrice(Number(event.target.value))}
//           placeholder="Үнэ"
//           className="rounded-xl border px-4 py-3"
//         />

//         <input
//           type="number"
//           value={capacity}
//           onChange={(event) => setCapacity(Number(event.target.value))}
//           placeholder="Нийт суудлын тоо"
//           className="rounded-xl border px-4 py-3"
//         />

//         <select
//           value={isOpen ? "open" : "closed"}
//           onChange={(event) => setIsOpen(event.target.value === "open")}
//           className="rounded-xl border px-4 py-3"
//         >
//           <option value="open">Бүртгэл нээлттэй</option>
//           <option value="closed">Бүртгэл хаалттай</option>
//         </select>

//         <div className="grid gap-3">
//           <p className="text-sm font-semibold text-slate-700">Салбар сонгох</p>

//           <div className="grid gap-3 md:grid-cols-2">
//             {branches.map((branch) => {
//               const isSelected = branchId === branch._id;

//               return (
//                 <button
//                   key={branch._id}
//                   type="button"
//                   onClick={() => setBranchId(branch._id)}
//                   className={`overflow-hidden rounded-2xl border text-left transition ${
//                     isSelected
//                       ? "border-blue-600 ring-2 ring-blue-200"
//                       : "border-slate-200 hover:border-slate-300"
//                   }`}
//                 >
//                   <div className="aspect-[16/10] bg-slate-100">
//                     <img
//                       src={branch.imageUrl}
//                       alt={branch.name}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>

//                   <div className="p-4">
//                     <p className="font-semibold text-slate-900">{branch.name}</p>
//                     <p className="mt-1 text-sm text-slate-500">{branch.address}</p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {selectedBranch ? (
//           <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
//             Сонгосон салбар: <span className="font-semibold">{selectedBranch.name}</span>
//           </div>
//         ) : null}

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
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [message, setMessage] = useState<string>("");

  const selectedBranch = branches.find((item) => item._id === branchId) ?? null;

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
          placeholder="Жишээ: 9-12 нас"
          className="rounded-xl border px-4 py-3"
        />

        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          placeholder="Үнэ"
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

        <div className="grid gap-3">
          <p className="text-sm font-semibold text-slate-700">Салбар сонгох</p>

          <div className="grid gap-3 md:grid-cols-2">
            {branches.map((branch) => {
              const isSelected = branchId === branch._id;

              return (
                <button
                  key={branch._id}
                  type="button"
                  onClick={() => setBranchId(branch._id)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-slate-200 hover:border-slate-300"
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
                    <p className="font-semibold text-slate-900">{branch.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{branch.address}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedBranch ? (
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            Сонгосон салбар: <span className="font-semibold">{selectedBranch.name}</span>
          </div>
        ) : null}

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