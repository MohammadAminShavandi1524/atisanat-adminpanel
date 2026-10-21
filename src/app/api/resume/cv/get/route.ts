import { serverApi } from "@/lib/server-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await serverApi("/resume/cv/get/", {
      method: "GET",
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get CV resumes error:", error);

    return NextResponse.json(
      { message: "Failed to get CV resumes" },
      { status: 500 },
    );
  }
}


