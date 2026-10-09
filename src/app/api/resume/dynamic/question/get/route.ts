import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const response = await serverApi("/resume/dynamic/question/get/", {
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get resume questions error:", error);

    return NextResponse.json(
      { message: "Failed to get resume questions" },
      { status: 500 },
    );
  }
}
