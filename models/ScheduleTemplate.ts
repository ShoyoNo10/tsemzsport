import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const slotSchema = new Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const scheduleTemplateSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slots: {
      type: [slotSchema],
      required: true,
      default: [],
    },
    sessionsPerWeek: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type ScheduleTemplateDocument = InferSchemaType<
  typeof scheduleTemplateSchema
>;

export const ScheduleTemplateModel: Model<ScheduleTemplateDocument> =
  models.ScheduleTemplate ||
  model<ScheduleTemplateDocument>("ScheduleTemplate", scheduleTemplateSchema);