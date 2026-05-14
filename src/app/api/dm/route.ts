import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "OpenAI provider is not configured in version 1. Mock mode is active."
    },
    { status: 501 }
  );
}
