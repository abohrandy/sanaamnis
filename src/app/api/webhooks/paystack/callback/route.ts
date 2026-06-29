import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reference = searchParams.get("reference");

  return NextResponse.redirect(
    new URL(`/checkout/success?reference=${reference || "unknown"}`, request.nextUrl.origin)
  );
}
