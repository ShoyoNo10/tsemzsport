import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Announcement from "@/models/Announcement";

interface UpdateAnnouncementBody {
  title?: string;
  content?: string;
  imageUrl?: string;
  type?: "general" | "registration" | "schedule" | "camp" | "event";
  isPublished?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

export async function GET(_: Request, context: RouteContext) {
  try {
    await connectDb();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const item = await Announcement.findById(id).lean();

    if (!item) {
      return NextResponse.json({ message: "Зар олдсонгүй" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("ADMIN_ANNOUNCEMENT_GET_ERROR", error);
    return NextResponse.json({ message: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    await connectDb();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = (await req.json()) as UpdateAnnouncementBody;

    if (body.startsAt && body.endsAt) {
      const startDate = new Date(body.startsAt);
      const endDate = new Date(body.endsAt);

      if (startDate > endDate) {
        return NextResponse.json(
          { message: "Эхлэх хугацаа дуусах хугацаанаас хойш байж болохгүй" },
          { status: 400 }
        );
      }
    }

    const updated = await Announcement.findByIdAndUpdate(
      id,
      {
        ...(body.title !== undefined ? { title: body.title.trim() } : {}),
        ...(body.content !== undefined ? { content: body.content.trim() } : {}),
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl.trim() } : {}),
        ...(body.type !== undefined ? { type: body.type } : {}),
        ...(body.isPublished !== undefined
          ? { isPublished: body.isPublished }
          : {}),
        ...(body.startsAt !== undefined
          ? { startsAt: body.startsAt ? new Date(body.startsAt) : undefined }
          : {}),
        ...(body.endsAt !== undefined
          ? { endsAt: body.endsAt ? new Date(body.endsAt) : undefined }
          : {}),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: "Зар олдсонгүй" }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("ADMIN_ANNOUNCEMENT_PATCH_ERROR", error);
    return NextResponse.json(
      { message: "Зар шинэчлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    await connectDb();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const deleted = await Announcement.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ message: "Зар олдсонгүй" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_ANNOUNCEMENT_DELETE_ERROR", error);
    return NextResponse.json(
      { message: "Зар устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}