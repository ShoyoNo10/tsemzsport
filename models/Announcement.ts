import mongoose, { Model, Schema } from "mongoose";

export type AnnouncementType =
  | "general"
  | "registration"
  | "schedule"
  | "camp"
  | "event";

export interface AnnouncementDocument {
  title: string;
  content: string;
  imageUrl?: string;
  type: AnnouncementType;
  isPublished: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<AnnouncementDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["general", "registration", "schedule", "camp", "event"],
      default: "general",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
      required: false,
    },
    endsAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ isPublished: 1, createdAt: -1 });
announcementSchema.index({ startsAt: 1, endsAt: 1 });

const AnnouncementModel: Model<AnnouncementDocument> =
  mongoose.models.Announcement ||
  mongoose.model<AnnouncementDocument>("Announcement", announcementSchema);

export default AnnouncementModel;