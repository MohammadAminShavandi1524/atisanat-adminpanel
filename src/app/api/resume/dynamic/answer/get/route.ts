import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await serverApi("/resume/dynamic/answer/get/", {
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get dynamic resume answers error:", error);

    return NextResponse.json(
      { message: "Failed to get dynamic resume answers" },
      { status: 500 },
    );
  }
}
