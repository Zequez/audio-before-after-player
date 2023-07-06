import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }
}
