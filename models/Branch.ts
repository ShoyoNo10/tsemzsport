import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const branchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
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

export type BranchDocument = InferSchemaType<typeof branchSchema>;
export const BranchModel: Model<BranchDocument> =
  models.Branch || model<BranchDocument>("Branch", branchSchema);