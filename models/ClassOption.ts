import { Schema, model, models, Types } from "mongoose";

const ClassOptionSchema = new Schema(
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
      type: Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    scheduleTemplateId: {
      type: Types.ObjectId,
      ref: "ScheduleTemplate",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
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
    agreementText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const ClassOptionModel =
  models.ClassOption || model("ClassOption", ClassOptionSchema);
