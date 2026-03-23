import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Announcement from "@/models/Announcement";

interface CreateAnnouncementBody {
  title?: string;
  content?: string;
  imageUrl?: string;
  type?: "general" | "registration" | "schedule" | "camp" | "event";
  isPublished?: boolean;
  startsAt?: string;
  endsAt?: string;
}

export async function GET() {
  try {
    await connectDb();

    const items = await Announcement.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("ADMIN_ANNOUNCEMENTS_GET_ERROR", error);
    return NextResponse.json(
      { message: "Заруудыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();

    const body = (await req.json()) as CreateAnnouncementBody;

    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Гарчиг болон тайлбар заавал шаардлагатай" },
        { status: 400 }
      );
    }

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

    const created = await Announcement.create({
      title,
      content,
      imageUrl: body.imageUrl?.trim() || "",
      type: body.type ?? "general",
      isPublished: body.isPublished ?? true,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_ANNOUNCEMENTS_POST_ERROR", error);
    return NextResponse.json(
      { message: "Зар үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}