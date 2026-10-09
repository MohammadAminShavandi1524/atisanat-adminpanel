import { NextResponse } from "next/server";
import { serverApi } from "@/lib/server-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ question_id: string }> },
) {
  try {
    const { question_id } = await params;

    const response = await serverApi(
      `/resume/dynamic/question/get/${question_id}/`,
      { method: "GET" },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET RESUME QUESTION ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get resume question" },
      { status: 500 },
    );
  }
}
