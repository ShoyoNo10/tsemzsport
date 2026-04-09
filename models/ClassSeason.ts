import { Schema, model, models, Types } from "mongoose";

const ClassSeasonSchema = new Schema(
  {
    classOptionId: {
      type: Types.ObjectId,
      ref: "ClassOption",
      required: true,
    },
    seasonLabel: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
      default: 20,
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
  }
);

export const ClassSeasonModel =
  models.ClassSeason || model("ClassSeason", ClassSeasonSchema);