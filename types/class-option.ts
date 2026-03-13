export type ClassOptionStatus = "active" | "inactive";

export interface ClassOptionDto {
  _id: string;
  title: string;
  ageRangeLabel: string;
  price: number;
  branchId: string;
  scheduleTemplateId: string;
  description: string;
  status: ClassOptionStatus;
  createdAt: string;
  updatedAt: string;
}