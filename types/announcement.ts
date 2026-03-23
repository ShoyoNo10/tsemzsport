export type AnnouncementType =
  | "general"
  | "registration"
  | "schedule"
  | "camp"
  | "event";

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: AnnouncementType;
  isPublished: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt: string;
  updatedAt: string;
}