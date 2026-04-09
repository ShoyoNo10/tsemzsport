// import { NextRequest, NextResponse } from "next/server";
// import { connectDb } from "@/lib/db";
// import { createRegistrationSchema } from "@/lib/validations";
// import { createQPayInvoice, getBestPaymentLink } from "@/lib/qpay";
// import { ClassOptionModel } from "@/models/ClassOption";
// import { RegistrationModel } from "@/models/Registration";
// import { env } from "@/lib/env";
// import { getPendingDeleteAt } from "@/lib/registration-time";

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   try {
//     await connectDb();

//     const json: unknown = await request.json();
//     const parsed = createRegistrationSchema.safeParse(json);

//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           message: "Мэдээлэл буруу байна",
//           errors: parsed.error.flatten(),
//         },
//         { status: 400 },
//       );
//     }

//     const data = parsed.data;

//     const classOption = await ClassOptionModel.findById(
//       data.classOptionId,
//     ).lean();

//     if (!classOption || classOption.status !== "active") {
//       return NextResponse.json(
//         { message: "Сонгосон анги олдсонгүй" },
//         { status: 404 },
//       );
//     }

//     const created = await RegistrationModel.create({
//       lastName: data.lastName,
//       firstName: data.firstName,
//       registerNumber: data.registerNumber,
//       phonePrimary: data.phonePrimary,
//       phoneEmergency: data.phoneEmergency,
//       homeAddress: data.homeAddress,
//       classOptionId: classOption._id,
//       branchId: classOption.branchId,
//       scheduleTemplateId: classOption.scheduleTemplateId,
//       status: "payment_pending",
//       paymentStatus: "pending",
//       qpayInvoiceId: "",
//       qpayPaymentId: "",
//       qpayQrText: "",
//       qpayQrImage: "",
//       qpayPaymentUrl: "",
//       qpayDeepLink: "",
//       qpayShortUrl: "",
//       qpayUrls: [],
//       deleteAt: getPendingDeleteAt(),
//     });

//     const senderInvoiceNo = `REG-${String(created._id)}`;
//     const invoiceDescription = `${classOption.title} сургалтын төлбөр`;

//     const invoice = await createQPayInvoice({
//       senderInvoiceNo,
//       amount: classOption.price,
//       invoiceDescription,
//       callbackUrl: env.QPAY_CALLBACK_URL,
//       invoiceReceiverCode: data.registerNumber,
//       receiverRegister: data.registerNumber,
//       receiverName: `${data.lastName} ${data.firstName}`,
//       receiverPhone: data.phonePrimary,
//     });

//     const bestPaymentLink = getBestPaymentLink(invoice.urls);

//     created.qpayInvoiceId = invoice.invoiceId;
//     created.qpayQrText = invoice.qrText;
//     created.qpayQrImage = invoice.qrImage;
//     created.qpayShortUrl = invoice.qPayShortUrl;
//     created.set(
//       "qpayUrls",
//       invoice.urls.map((item) => ({
//         name: item.name,
//         description: item.description,
//         logo: item.logo,
//         link: item.link,
//       })),
//     );
//     created.qpayPaymentUrl = bestPaymentLink;
//     created.qpayDeepLink = bestPaymentLink;

//     await created.save();

//     return NextResponse.json({
//       message: "Бүртгэл амжилттай үүслээ",
//       registration: {
//         _id: String(created._id),
//         status: created.status,
//         paymentStatus: created.paymentStatus,
//         qpayInvoiceId: created.qpayInvoiceId,
//         qpayQrText: created.qpayQrText,
//         qpayQrImage: created.qpayQrImage,
//         qpayPaymentUrl: created.qpayPaymentUrl,
//         qpayDeepLink: created.qpayDeepLink,
//         qpayShortUrl: created.qpayShortUrl,
//         qpayUrls: created.qpayUrls,
//       },
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Unknown server error";

//     return NextResponse.json(
//       {
//         message: "Бүртгэл үүсгэх үед алдаа гарлаа",
//         error: message,
//       },
//       { status: 500 },
//     );
//   }
// }







// import { NextRequest, NextResponse } from "next/server";
// import { connectDb } from "@/lib/db";
// import { createRegistrationSchema } from "@/lib/validations";
// import { createQPayInvoice, getBestPaymentLink } from "@/lib/qpay";
// import { ClassOptionModel } from "@/models/ClassOption";
// import { RegistrationModel } from "@/models/Registration";
// import { env } from "@/lib/env";
// import { getPendingDeleteAt } from "@/lib/registration-time";

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   try {
//     await connectDb();

//     const json: unknown = await request.json();
//     const parsed = createRegistrationSchema.safeParse(json);

//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           message: "Мэдээлэл буруу байна",
//           errors: parsed.error.flatten(),
//         },
//         { status: 400 },
//       );
//     }

//     const data = parsed.data;

//     const classOption = await ClassOptionModel.findById(data.classOptionId).lean();

//     if (!classOption || classOption.status !== "active") {
//       return NextResponse.json(
//         { message: "Сонгосон анги олдсонгүй" },
//         { status: 404 },
//       );
//     }

//     if (!classOption.isOpen) {
//       return NextResponse.json(
//         { message: "Энэ ангийн бүртгэл хаалттай байна" },
//         { status: 400 },
//       );
//     }

//     const paidCount = await RegistrationModel.countDocuments({
//       classOptionId: classOption._id,
//       paymentStatus: "paid",
//       status: "paid",
//     });

//     const remainingSeats = Math.max(classOption.capacity - paidCount, 0);

//     if (remainingSeats <= 0) {
//       return NextResponse.json(
//         { message: "Энэ анги дүүрсэн байна" },
//         { status: 400 },
//       );
//     }

//     const created = await RegistrationModel.create({
//       lastName: data.lastName,
//       firstName: data.firstName,
//       registerNumber: data.registerNumber,
//       phonePrimary: data.phonePrimary,
//       phoneEmergency: data.phoneEmergency,
//       homeAddress: data.homeAddress,
//       classOptionId: classOption._id,
//       branchId: classOption.branchId,
//       scheduleTemplateId: classOption.scheduleTemplateId,
//       status: "payment_pending",
//       paymentStatus: "pending",
//       qpayInvoiceId: "",
//       qpayPaymentId: "",
//       qpayQrText: "",
//       qpayQrImage: "",
//       qpayPaymentUrl: "",
//       qpayDeepLink: "",
//       qpayShortUrl: "",
//       qpayUrls: [],
//       deleteAt: getPendingDeleteAt(),
//     });

//     const senderInvoiceNo = `REG-${String(created._id)}`;
//     const invoiceDescription = `${classOption.title} сургалтын төлбөр`;

//     const invoice = await createQPayInvoice({
//       senderInvoiceNo,
//       amount: classOption.price,
//       invoiceDescription,
//       callbackUrl: env.QPAY_CALLBACK_URL,
//       invoiceReceiverCode: data.registerNumber,
//       receiverRegister: data.registerNumber,
//       receiverName: `${data.lastName} ${data.firstName}`,
//       receiverPhone: data.phonePrimary,
//     });

//     const bestPaymentLink = getBestPaymentLink(invoice.urls);

//     created.qpayInvoiceId = invoice.invoiceId;
//     created.qpayQrText = invoice.qrText;
//     created.qpayQrImage = invoice.qrImage;
//     created.qpayShortUrl = invoice.qPayShortUrl;
//     created.set(
//       "qpayUrls",
//       invoice.urls.map((item) => ({
//         name: item.name,
//         description: item.description,
//         logo: item.logo,
//         link: item.link,
//       })),
//     );
//     created.qpayPaymentUrl = bestPaymentLink;
//     created.qpayDeepLink = bestPaymentLink;

//     await created.save();

//     return NextResponse.json({
//       message: "Бүртгэл амжилттай үүслээ",
//       registration: {
//         _id: String(created._id),
//         status: created.status,
//         paymentStatus: created.paymentStatus,
//         qpayInvoiceId: created.qpayInvoiceId,
//         qpayQrText: created.qpayQrText,
//         qpayQrImage: created.qpayQrImage,
//         qpayPaymentUrl: created.qpayPaymentUrl,
//         qpayDeepLink: created.qpayDeepLink,
//         qpayShortUrl: created.qpayShortUrl,
//         qpayUrls: created.qpayUrls,
//       },
//     });
//   } catch (error) {
//     const message =
//       error instanceof Error ? error.message : "Unknown server error";

//     return NextResponse.json(
//       {
//         message: "Бүртгэл үүсгэх үед алдаа гарлаа",
//         error: message,
//       },
//       { status: 500 },
//     );
//   }
// }




import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { createRegistrationSchema } from "@/lib/validations";
import { createQPayInvoice, getBestPaymentLink } from "@/lib/qpay";
import { ClassOptionModel } from "@/models/ClassOption";
import { ClassSeasonModel } from "@/models/ClassSeason";
import { RegistrationModel } from "@/models/Registration";
import { env } from "@/lib/env";
import { getPendingDeleteAt } from "@/lib/registration-time";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDb();

    const json: unknown = await request.json();
    const parsed = createRegistrationSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Мэдээлэл буруу байна",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const classOption = await ClassOptionModel.findById(data.classOptionId).lean();
    const classSeason = await ClassSeasonModel.findById(data.classSeasonId).lean();

    if (!classOption || classOption.status !== "active") {
      return NextResponse.json(
        { message: "Сонгосон анги олдсонгүй" },
        { status: 404 }
      );
    }

    if (!classSeason || classSeason.status !== "active") {
      return NextResponse.json(
        { message: "Сонгосон сар олдсонгүй" },
        { status: 404 }
      );
    }

    if (String(classSeason.classOptionId) !== String(classOption._id)) {
      return NextResponse.json(
        { message: "Сонгосон сар энэ ангид хамаарахгүй байна" },
        { status: 400 }
      );
    }

    if (!classOption.isOpen || !classSeason.isOpen) {
      return NextResponse.json(
        { message: "Энэ бүртгэл хаалттай байна" },
        { status: 400 }
      );
    }

    const paidCount = await RegistrationModel.countDocuments({
      classSeasonId: classSeason._id,
      paymentStatus: "paid",
      status: "paid",
    });

    const remainingSeats = Math.max(classSeason.capacity - paidCount, 0);

    if (remainingSeats <= 0) {
      return NextResponse.json(
        { message: "Энэ сарын анги дүүрсэн байна" },
        { status: 400 }
      );
    }

    const created = await RegistrationModel.create({
      lastName: data.lastName,
      firstName: data.firstName,
      registerNumber: data.registerNumber,
      phonePrimary: data.phonePrimary,
      phoneEmergency: data.phoneEmergency,
      homeAddress: data.homeAddress,
      classOptionId: classOption._id,
      classSeasonId: classSeason._id,
      branchId: classOption.branchId,
      scheduleTemplateId: classOption.scheduleTemplateId,
      status: "payment_pending",
      paymentStatus: "pending",
      qpayInvoiceId: "",
      qpayPaymentId: "",
      qpayQrText: "",
      qpayQrImage: "",
      qpayPaymentUrl: "",
      qpayDeepLink: "",
      qpayShortUrl: "",
      qpayUrls: [],
      deleteAt: getPendingDeleteAt(),
    });

    const senderInvoiceNo = `REG-${String(created._id)}`;
    const invoiceDescription = `${classOption.title} ${classSeason.seasonLabel} сургалтын төлбөр`;

    const invoice = await createQPayInvoice({
      senderInvoiceNo,
      amount: classOption.price,
      invoiceDescription,
      callbackUrl: env.QPAY_CALLBACK_URL,
      invoiceReceiverCode: data.registerNumber,
      receiverRegister: data.registerNumber,
      receiverName: `${data.lastName} ${data.firstName}`,
      receiverPhone: data.phonePrimary,
    });

    const bestPaymentLink = getBestPaymentLink(invoice.urls);

    created.qpayInvoiceId = invoice.invoiceId;
    created.qpayQrText = invoice.qrText;
    created.qpayQrImage = invoice.qrImage;
    created.qpayShortUrl = invoice.qPayShortUrl;
    created.set(
      "qpayUrls",
      invoice.urls.map((item) => ({
        name: item.name,
        description: item.description,
        logo: item.logo,
        link: item.link,
      }))
    );
    created.qpayPaymentUrl = bestPaymentLink;
    created.qpayDeepLink = bestPaymentLink;

    await created.save();

    return NextResponse.json({
      message: "Бүртгэл амжилттай үүслээ",
      registration: {
        _id: String(created._id),
        status: created.status,
        paymentStatus: created.paymentStatus,
        qpayInvoiceId: created.qpayInvoiceId,
        qpayQrText: created.qpayQrText,
        qpayQrImage: created.qpayQrImage,
        qpayPaymentUrl: created.qpayPaymentUrl,
        qpayDeepLink: created.qpayDeepLink,
        qpayShortUrl: created.qpayShortUrl,
        qpayUrls: created.qpayUrls,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        message: "Бүртгэл үүсгэх үед алдаа гарлаа",
        error: message,
      },
      { status: 500 }
    );
  }
}