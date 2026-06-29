import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/requireAdmin";
import { uploadImage, uploadResume } from "@/lib/cloudinary";

// base64 inflates ~33%, keep within serverless body limits.
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Signed upload. The browser sends the file as multipart/form-data to this
 * protected route; the server (which holds the Cloudinary API secret) performs
 * the actual upload. No unsigned client-side preset is used.
 *
 * Form fields:
 *   file  — the file blob
 *   kind  — "image" (default, project thumbnails) | "resume" (PDF)
 */
export const POST = withAdmin(async (req) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = (form?.get("kind") as string) || "image";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;

  try {
    if (kind === "resume") {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { error: "Resume must be a PDF file." },
          { status: 400 }
        );
      }
      if (bytes.byteLength > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: "PDF is too large (max 10 MB)." },
          { status: 400 }
        );
      }
      const { url, publicId } = await uploadResume(dataUri);
      return NextResponse.json({ ok: true, url, publicId });
    }

    // Default: image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image is too large (max 6 MB)." },
        { status: 400 }
      );
    }
    const { url, publicId } = await uploadImage(dataUri);
    return NextResponse.json({ ok: true, url, publicId });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json(
      { error: "Upload failed. Check Cloudinary credentials." },
      { status: 500 }
    );
  }
});
