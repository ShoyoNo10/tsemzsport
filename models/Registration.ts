import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const qpayUrlSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const registrationSchema = new Schema(
  {
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    registerNumber: {
      type: String,
      required: true,
      trim: true,
    },
    phonePrimary: {
      type: String,
      required: true,
      trim: true,
    },
    phoneEmergency: {
      type: String,
      required: true,
      trim: true,
    },
    homeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    classOptionId: {
      type: Schema.Types.ObjectId,
      ref: "ClassOption",
      required: true,
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
    status: {
      type: String,
      enum: ["draft", "submitted", "payment_pending", "paid", "cancelled", "expired"],
      default: "payment_pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "expired"],
      default: "pending",
      required: true,
    },
    qpayInvoiceId: {
      type: String,
      trim: true,
      default: "",
    },
    qpayPaymentId: {
      type: String,
      trim: true,
      default: "",
    },
    qpayQrText: {
      type: String,
      trim: true,
      default: "",
    },
    qpayQrImage: {
      type: String,
      trim: true,
      default: "",
    },
    qpayPaymentUrl: {
      type: String,
      trim: true,
      default: "",
    },
    qpayDeepLink: {
      type: String,
      trim: true,
      default: "",
    },
    qpayShortUrl: {
      type: String,
      trim: true,
      default: "",
    },
    qpayUrls: {
      type: [qpayUrlSchema],
      default: [],
    },
    paidAt: {
      type: Date,
      required: false,
    },
    deleteAt: {
      type: Date,
      required: true,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export type RegistrationDocument = InferSchemaType<typeof registrationSchema>;

export const RegistrationModel: Model<RegistrationDocument> =
  models.Registration ||
  model<RegistrationDocument>("Registration", registrationSchema);