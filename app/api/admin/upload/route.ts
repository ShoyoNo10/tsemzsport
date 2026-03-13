import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "File байхгүй" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "shop" }, (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as { secure_url: string });
        })
        .end(buffer);
    });

    return NextResponse.json({
      url: upload.secure_url,
    });
  } catch {
    return NextResponse.json({ message: "Upload error" }, { status: 500 });
  }
}