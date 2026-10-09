import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";


export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ question_id: string }> },
) {
  try {
    const { question_id } = await params;

    const response = await serverApi(
      `/resume/dynamic/question/delete/${question_id}/`,
      { method: "DELETE" },
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("DELETE RESUME QUESTION ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete resume question" },
      { status: 500 },
    );
  }
}
