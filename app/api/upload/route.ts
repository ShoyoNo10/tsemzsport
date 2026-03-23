import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Файл олдсонгүй" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "announcements" }, (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Cloudinary upload failed"));
              return;
            }

            resolve({ secure_url: result.secure_url });
          })
          .end(buffer);
      }
    );

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return NextResponse.json({ message: "Upload error" }, { status: 500 });
  }
}