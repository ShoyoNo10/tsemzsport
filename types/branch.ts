export type BranchStatus = "active" | "inactive";

export interface BranchDto {
  _id: string;
  name: string;
  address: string;
  status: BranchStatus;
  createdAt: string;
  updatedAt: string;
}