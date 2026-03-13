// import { InferSchemaType, Model, Schema, model, models } from "mongoose";

// const registrationSchema = new Schema(
//   {
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     registerNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phonePrimary: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phoneEmergency: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     homeAddress: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     classOptionId: {
//       type: Schema.Types.ObjectId,
//       ref: "ClassOption",
//       required: true,
//     },
//     branchId: {
//       type: Schema.Types.ObjectId,
//       ref: "Branch",
//       required: true,
//     },
//     scheduleTemplateId: {
//       type: Schema.Types.ObjectId,
//       ref: "ScheduleTemplate",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["draft", "submitted", "payment_pending", "paid", "cancelled"],
//       default: "payment_pending",
//       required: true,
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["unpaid", "pending", "paid", "failed"],
//       default: "pending",
//       required: true,
//     },
//     qpayDeepLink: {
//       type: String,
//       required: true,
//       trim: true,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export type RegistrationDocument = InferSchemaType<typeof registrationSchema>;

// export const RegistrationModel: Model<RegistrationDocument> =
//   models.Registration ||
//   model<RegistrationDocument>("Registration", registrationSchema);

import { InferSchemaType, Model, Schema, model, models } from "mongoose";

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
      enum: ["draft", "submitted", "payment_pending", "paid", "cancelled"],
      default: "payment_pending",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    qpayDeepLink: {
      type: String,
      trim: true,
      default: "",
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