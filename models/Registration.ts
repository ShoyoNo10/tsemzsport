import { Schema, model, models, Types } from "mongoose";

const RegistrationSchema = new Schema(
  {
    lastName: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    registerNumber: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    phonePrimary: { type: String, required: true, trim: true },
    phoneEmergency: { type: String, required: true, trim: true },
    homeAddress: { type: String, required: true, trim: true },

    classOptionId: {
      type: Types.ObjectId,
      ref: "ClassOption",
      required: true,
    },
    classSeasonId: {
      type: Types.ObjectId,
      ref: "ClassSeason",
      required: true,
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

    status: { type: String, required: true },
    paymentStatus: { type: String, required: true },

    qpayInvoiceId: { type: String, default: "" },
    qpayPaymentId: { type: String, default: "" },
    qpayQrText: { type: String, default: "" },
    qpayQrImage: { type: String, default: "" },
    qpayPaymentUrl: { type: String, default: "" },
    qpayDeepLink: { type: String, default: "" },
    qpayShortUrl: { type: String, default: "" },
    qpayUrls: { type: Array, default: [] },

    paidAt: { type: Date },
    deleteAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const RegistrationModel =
  models.Registration || model("Registration", RegistrationSchema);
