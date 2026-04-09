export type ClassSeasonStatus = "active" | "inactive";

export interface ClassSeasonDto {
  _id: string;
  classOptionId: string;
  seasonLabel: string;
  capacity: number;
  enrolledCount: number;
  remainingSeats: number;
  isFull: boolean;
  isOpen: boolean;
  status: ClassSeasonStatus;
  createdAt: string;
  updatedAt: string;
}