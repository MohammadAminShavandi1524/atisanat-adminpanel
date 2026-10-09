import { NextResponse } from "next/server";
import { serverApi } from "@/lib/server-api";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ question_id: string }> },
) {
  try {
    const { question_id } = await params;
    const body = await request.json();

    const response = await serverApi(
      `/resume/dynamic/question/update/${question_id}/`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("UPDATE RESUME QUESTION ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update resume question" },
      { status: 500 },
    );
  }
}
