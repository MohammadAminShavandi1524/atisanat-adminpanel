import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = await serverApi("/chart/parent/create/", {
      method: "POST",

      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.body ?? "Internal Server Error",
      },
      {
        status: error.status ?? 500,
      },
    );
  }
}
