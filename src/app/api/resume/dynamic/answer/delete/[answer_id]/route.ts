import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    answer_id: string;
  }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { answer_id } = await params;

  try {
    const response = await serverApi(
      `/resume/dynamic/answer/delete/${answer_id}/`,
      {
        method: "DELETE",
      },
    );

    return NextResponse.json(response ?? { success: true });
  } catch (error) {
    console.error("Delete dynamic resume answer error:", error);

    return NextResponse.json(
      { message: "Failed to delete dynamic resume answer" },
      { status: 500 },
    );
  }
}
