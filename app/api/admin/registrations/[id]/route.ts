import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { env } from "@/lib/env";
import { RegistrationModel } from "@/models/Registration";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const adminSecret = request.headers.get("x-admin-secret");

  if (adminSecret !== env.ADMIN_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await connectDb();

  const deleted = await RegistrationModel.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { message: "Бүртгэл олдсонгүй." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Бүртгэл амжилттай устлаа.",
  });
}