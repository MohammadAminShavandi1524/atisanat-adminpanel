import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";

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
          message: "No chart file uploaded",
        },
        {
          status: 400,
        },
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const fileName = `${crypto.randomUUID()}.pdf`;

    const objectKey = `charts/files/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET!,

        Key: objectKey,

        Body: buffer,

        ContentType: "application/pdf",

        ContentDisposition: "attachment",

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
    console.error("CHART PDF UPLOAD ERROR =>", error);

    return NextResponse.json(
      {
        success: false,
        message: "Chart file upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
