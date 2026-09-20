import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await request.json();

    const data = await serverApi(`/chart/parent/update/${id}/`, {
      method: "PUT",
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
