import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await connectDb();

    const now = new Date();

    const items = await Announcement.find({
      isPublished: true,
      $and: [
        {
          $or: [{ startsAt: { $exists: false } }, { startsAt: null }, { startsAt: { $lte: now } }],
        },
        {
          $or: [{ endsAt: { $exists: false } }, { endsAt: null }, { endsAt: { $gte: now } }],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("PUBLIC_ANNOUNCEMENTS_GET_ERROR", error);
    return NextResponse.json(
      { message: "Заруудыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}