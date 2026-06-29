import { v2 as cloudinary } from "cloudinary";

let configured = false;

function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

const FOLDER = "anushka-portfolio/projects";
const RESUME_FOLDER = "anushka-portfolio/resume";

/**
 * Server-side SIGNED upload. The image bytes are sent to this server first
 * (never an unsigned client-side preset), so the API secret is required and
 * uploads cannot be forged from the browser.
 *
 * @param dataUri  a base64 data URI, e.g. "data:image/png;base64,...."
 */
export async function uploadImage(dataUri: string): Promise<{
  url: string;
  publicId: string;
}> {
  configure();
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: FOLDER,
    resource_type: "image",
    overwrite: true,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: res.secure_url, publicId: res.public_id };
}

/**
 * Signed upload for the resume PDF. Stored as a "raw" asset so the returned
 * secure_url points straight at the .pdf and can be downloaded/viewed.
 */
export async function uploadResume(dataUri: string): Promise<{
  url: string;
  publicId: string;
}> {
  configure();
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: RESUME_FOLDER,
    resource_type: "raw",
    public_id: "anushka-pandit-resume.pdf",
    overwrite: true,
    invalidate: true,
  });
  return { url: res.secure_url, publicId: res.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  configure();
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal — log-and-continue so DB deletes aren't blocked by Cloudinary.
  }
}
