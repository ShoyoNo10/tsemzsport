export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleSlot {
  day: Weekday;
  startTime: string;
  endTime: string;
}

export type ScheduleTemplateStatus = "active" | "inactive";

export interface ScheduleTemplateDto {
  _id: string;
  title: string;
  slots: ScheduleSlot[];
  sessionsPerWeek: number;
  status: ScheduleTemplateStatus;
  createdAt: string;
  updatedAt: string;
}