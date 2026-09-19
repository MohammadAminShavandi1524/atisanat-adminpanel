import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    const data = await serverApi(`/faq/reduce/${id}/`, {
      method: "PATCH",
    });

    return NextResponse.json(data ?? { success: true });
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
