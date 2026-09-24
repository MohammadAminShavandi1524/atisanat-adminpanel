import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const s3 = new S3Client({
  region: process.env.ARVAN_REGION!,

  endpoint: process.env.ARVAN_ENDPOINT!,

  forcePathStyle: true,

  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY!,

    secretAccessKey: process.env.ARVAN_SECRET_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "No product image uploaded",
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, JPEG, PNG and WEBP files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be 5MB or less",
        },
        {
          status: 400,
        },
      );
    }

    const extension = ALLOWED_TYPES.get(file.type)!;

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const objectKey = `products/images/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET!,

        Key: objectKey,

        Body: buffer,

        ContentType: file.type,

        ContentDisposition: "inline",

        ACL: "public-read",
      }),
    );

    const publicBaseUrl =
      process.env.ARVAN_PUBLIC_URL ??
      `${process.env.ARVAN_ENDPOINT}/${process.env.ARVAN_BUCKET}`;

    const url = `${publicBaseUrl.replace(/\/$/, "")}/${objectKey}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("PRODUCT IMAGE UPLOAD ERROR =>", error);

    return NextResponse.json(
      {
        success: false,
        message: "Product image upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
