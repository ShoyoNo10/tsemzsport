// export type ClassOptionStatus = "active" | "inactive";

// export interface ClassOptionDto {
//   _id: string;
//   title: string;
//   ageRangeLabel: string;
//   seasonLabel: string;
//   price: number;
//   branchId: string;
//   scheduleTemplateId: string;
//   description: string;
//   capacity: number;
//   isOpen: boolean;
//   enrolledCount: number;
//   remainingSeats: number;
//   isFull: boolean;
//   status: ClassOptionStatus;
//   createdAt: string;
//   updatedAt: string;
// }


export type ClassOptionStatus = "active" | "inactive";

export interface ClassOptionDto {
  _id: string;
  title: string;
  ageRangeLabel: string;
  price: number;
  branchId: string;
  scheduleTemplateId: string;
  description: string;
  isOpen: boolean;
  status: ClassOptionStatus;
  createdAt: string;
  updatedAt: string;
}