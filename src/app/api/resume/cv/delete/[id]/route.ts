import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!/^\d+$/.test(id) || Number(id) <= 0) {
      return NextResponse.json(
        { message: "Invalid CV resume ID" },
        { status: 400 },
      );
    }

    const response = await serverApi(`/resume/cv/delete/${id}/`, {
      method: "DELETE",
    });

    return NextResponse.json(response ?? { success: true });
  } catch (error) {
    console.error("Delete CV resume error:", error);

    return NextResponse.json(
      { message: "Failed to delete CV resume" },
      { status: 500 },
    );
  }
}
