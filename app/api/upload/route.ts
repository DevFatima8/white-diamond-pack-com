import { NextRequest, NextResponse } from 'next/server';
import type { UploadApiResponse } from 'cloudinary';
import cloudinary from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';
import { serverError } from '@/lib/api';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const CLOUDINARY_FOLDER = 'whitediamond/products';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

/**
 * The file type sent by the browser can be faked (e.g. a script renamed to .png),
 * so we also check the first bytes of the file ("magic numbers"),
 * which identify the real format.
 */
function detectImageType(buf: Buffer): AllowedType | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (
    buf.length >= 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png';
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

const badRequest = (error: string, status = 400) =>
  NextResponse.json({ success: false, error }, { status });

// Admin only: upload one product image to Cloudinary.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  // Reject obviously oversized requests before reading the body into memory.
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BYTES + 64 * 1024) return badRequest('File is larger than 5 MB', 413);

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  if (!(file instanceof File)) return badRequest('No file uploaded');

  if (file.size > MAX_BYTES) return badRequest('File is larger than 5 MB', 413);
  if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
    return badRequest('Only JPG, PNG or WEBP images are allowed', 415);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (detectImageType(buffer) === null) {
    return badRequest('File content is not a valid JPG, PNG or WEBP image', 415);
  }

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: CLOUDINARY_FOLDER, resource_type: 'image' },
          (error, response) => {
            if (error || !response) reject(error ?? new Error('Empty Cloudinary response'));
            else resolve(response);
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    return serverError('upload', err, 'Image upload failed');
  }
}
