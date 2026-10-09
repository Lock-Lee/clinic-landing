import { randomUUID } from "node:crypto";
import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// ที่เก็บรูปแบบ S3 (SeaweedFS ใน docker-compose.yml) ค่าใน .env.example ย้ายไป R2/S3/MinIO ได้โดยไม่แก้โค้ด
const endpoint = process.env.S3_ENDPOINT ?? "http://localhost:8333";
const bucket = process.env.S3_BUCKET ?? "clinic-media";
const publicUrl = (process.env.S3_PUBLIC_URL ?? `${endpoint}/${bucket}`).replace(/\/$/, "");

const g = globalThis as unknown as { __clinicS3?: S3Client; __clinicBucket?: Promise<unknown> };
const s3 = (g.__clinicS3 ??= new S3Client({
  endpoint,
  region: process.env.S3_REGION ?? "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "clinic",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "clinic-s3-dev",
  },
}));

const ensureBucket = () =>
  (g.__clinicBucket ??= s3
    .send(new HeadBucketCommand({ Bucket: bucket }))
    .catch(() => s3.send(new CreateBucketCommand({ Bucket: bucket })))
    .catch((e) => {
      g.__clinicBucket = undefined;
      throw e;
    }));

export const MAX_IMAGE_BYTES = 5_000_000;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export class UploadError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

/** อัปโหลดรูปไว้ใต้ prefix (เช่น id คลินิก) คืน URL สาธารณะของรูป */
export async function uploadImage(file: File, prefix: string): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new UploadError("รองรับเฉพาะรูป JPG, PNG, WebP, GIF");
  if (file.size > MAX_IMAGE_BYTES) throw new UploadError("รูปใหญ่เกิน 5 MB");

  const month = new Date().toISOString().slice(0, 7);
  const key = `${prefix.replace(/[^a-z0-9-]/gi, "")}/${month}/${randomUUID()}.${ext}`;
  try {
    await ensureBucket();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
  } catch {
    throw new UploadError("เชื่อมต่อที่เก็บรูปไม่ได้ เปิดด้วย docker compose up -d", 503);
  }
  return `${publicUrl}/${key}`;
}

// route handler อัปโหลดรูป: รับ multipart field "file" คืน { url }
// authorize คืน prefix ที่ใช้เก็บ (เช่น id คลินิก) หรือ null ถ้าไม่มีสิทธิ์
export function createUploadRoute(authorize: (req: Request) => Promise<string | null>) {
  return {
    POST: async (req: Request) => {
      const prefix = await authorize(req);
      if (!prefix) return Response.json({ error: "ไม่มีสิทธิ์อัปโหลด" }, { status: 403 });
      const form = await req.formData().catch(() => null);
      const file = form?.get("file");
      if (!(file instanceof File)) return Response.json({ error: "ไม่พบไฟล์" }, { status: 400 });
      try {
        return Response.json({ url: await uploadImage(file, prefix) });
      } catch (e) {
        const err = e instanceof UploadError ? e : new UploadError("อัปโหลดไม่สำเร็จ", 500);
        return Response.json({ error: err.message }, { status: err.status });
      }
    },
  };
}
