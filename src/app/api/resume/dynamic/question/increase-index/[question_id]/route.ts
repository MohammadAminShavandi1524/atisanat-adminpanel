import { NextResponse } from "next/server";
import { serverApi } from "@/lib/server-api";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ question_id: string }> },
) {
  try {
    const { question_id } = await params;

    const response = await serverApi(
      `/resume/dynamic/question/increase_index/${question_id}/`,
      { method: "PATCH" },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("INCREASE RESUME QUESTION INDEX ERROR:", error);

    return NextResponse.json(
      { message: "Failed to increase question index" },
      { status: 500 },
    );
  }
}
