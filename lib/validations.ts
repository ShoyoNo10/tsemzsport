// import { z } from "zod";

// export const weekdaySchema = z.enum([
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ]);

// export const scheduleSlotSchema = z.object({
//   day: weekdaySchema,
//   startTime: z.string().min(1, "Эхлэх цаг оруулна уу"),
//   endTime: z.string().min(1, "Дуусах цаг оруулна уу"),
// });

// export const createBranchSchema = z.object({
//   name: z.string().min(1, "Салбарын нэр шаардлагатай"),
//   address: z.string().min(1, "Салбарын хаяг шаардлагатай"),
//   imageUrl: z.string().min(1, "Салбарын зураг шаардлагатай"),
//   description: z.string().optional().default(""),
//   status: z.enum(["active", "inactive"]),
// });

// export const createScheduleTemplateSchema = z.object({
//   title: z.string().min(1, "Хуваарийн нэр шаардлагатай"),
//   slots: z.array(scheduleSlotSchema).min(1, "Дор хаяж 1 цагийн хуваарь нэмнэ"),
//   sessionsPerWeek: z.number().int().min(1, "7 хоногт орох тоо шаардлагатай"),
//   status: z.enum(["active", "inactive"]),
// });

// export const createClassOptionSchema = z.object({
//   title: z.string().min(1, "Ангийн нэр шаардлагатай"),
//   ageRangeLabel: z.string().min(1, "Насны ангилал шаардлагатай"),
//   seasonLabel: z.string().min(1, "Сар сонголт шаардлагатай"),
//   price: z.number().min(0, "Үнэ буруу байна"),
//   branchId: z.string().min(1, "Салбар сонгоно уу"),
//   scheduleTemplateId: z.string().min(1, "Хуваарь сонгоно уу"),
//   description: z.string().min(1, "Тайлбар шаардлагатай"),
//   capacity: z.number().int().min(0, "Суудлын тоо буруу байна"),
//   isOpen: z.boolean(),
//   status: z.enum(["active", "inactive"]),
// });

// export const createRegistrationSchema = z.object({
//   lastName: z.string().min(1, "Овог шаардлагатай"),
//   firstName: z.string().min(1, "Нэр шаардлагатай"),
//   registerNumber: z
//     .string()
//     .regex(/^[А-ЯӨҮЁа-яөүёA-Za-z]{2}\d{8}$/, "Регистрийн формат буруу байна"),
//   phonePrimary: z.string().min(8, "Утас 1 буруу байна"),
//   phoneEmergency: z.string().min(8, "Яаралтай үед холбогдох утас буруу байна"),
//   homeAddress: z.string().min(1, "Гэрийн хаяг шаардлагатай"),
//   classOptionId: z.string().min(1, "Анги сонгоно уу"),
// });

// export type CreateBranchInput = z.infer<typeof createBranchSchema>;
// export type CreateScheduleTemplateInput = z.infer<
//   typeof createScheduleTemplateSchema
// >;
// export type CreateClassOptionInput = z.infer<typeof createClassOptionSchema>;
// export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;




import { z } from "zod";

export const weekdaySchema = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const scheduleSlotSchema = z.object({
  day: weekdaySchema,
  startTime: z.string().min(1, "Эхлэх цаг оруулна уу"),
  endTime: z.string().min(1, "Дуусах цаг оруулна уу"),
});

export const createBranchSchema = z.object({
  name: z.string().min(1, "Салбарын нэр шаардлагатай"),
  address: z.string().min(1, "Салбарын хаяг шаардлагатай"),
  imageUrl: z.string().min(1, "Салбарын зураг шаардлагатай"),
  description: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]),
});

export const createScheduleTemplateSchema = z.object({
  title: z.string().min(1, "Хуваарийн нэр шаардлагатай"),
  slots: z.array(scheduleSlotSchema).min(1, "Дор хаяж 1 цагийн хуваарь нэмнэ"),
  sessionsPerWeek: z.number().int().min(1, "7 хоногт орох тоо шаардлагатай"),
  status: z.enum(["active", "inactive"]),
});

export const createClassOptionSchema = z.object({
  title: z.string().min(1, "Ангийн нэр шаардлагатай"),
  ageRangeLabel: z.string().min(1, "Насны ангилал шаардлагатай"),
  price: z.number().min(0, "Үнэ буруу байна"),
  branchId: z.string().min(1, "Салбар сонгоно уу"),
  scheduleTemplateId: z.string().min(1, "Хуваарь сонгоно уу"),
  description: z.string().min(1, "Тайлбар шаардлагатай"),
  isOpen: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

export const createClassSeasonSchema = z.object({
  classOptionId: z.string().min(1, "Анги сонгоно уу"),
  seasonLabel: z.string().min(1, "Сар сонгоно уу"),
  capacity: z.number().int().min(0, "Суудлын тоо буруу байна"),
  isOpen: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

export const createRegistrationSchema = z.object({
  lastName: z.string().min(1, "Овог шаардлагатай"),
  firstName: z.string().min(1, "Нэр шаардлагатай"),
  registerNumber: z
    .string()
    .regex(/^[А-ЯӨҮЁа-яөүёA-Za-z]{2}\d{8}$/, "Регистрийн формат буруу байна"),
  phonePrimary: z.string().min(8, "Утас 1 буруу байна"),
  phoneEmergency: z.string().min(8, "Яаралтай үед холбогдох утас буруу байна"),
  homeAddress: z.string().min(1, "Гэрийн хаяг шаардлагатай"),
  classOptionId: z.string().min(1, "Анги сонгоно уу"),
  classSeasonId: z.string().min(1, "Сар сонгоно уу"),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type CreateScheduleTemplateInput = z.infer<
  typeof createScheduleTemplateSchema
>;
export type CreateClassOptionInput = z.infer<typeof createClassOptionSchema>;
export type CreateClassSeasonInput = z.infer<typeof createClassSeasonSchema>;
export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;