import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const classOptionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ageRangeLabel: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    scheduleTemplateId: {
      type: Schema.Types.ObjectId,
      ref: "ScheduleTemplate",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },

// addedd
    capacity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
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
  },
);

export type ClassOptionDocument = InferSchemaType<typeof classOptionSchema>;

export const ClassOptionModel: Model<ClassOptionDocument> =
  models.ClassOption ||
  model<ClassOptionDocument>("ClassOption", classOptionSchema);
