import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const pathToRevalidate = req.nextUrl.searchParams.get("path");
    if (pathToRevalidate) {
      // This is a stupid implementation on part of NextJS
      // I want to revalidate just a single path, not all the paths!
      // But there is no way to do that...
      // So a single user changing their stuff, invalidates the cache for everyone...
      // I really wanted to give NextJS a shot, but I'm gonna switch to Astro, it's simpler
      revalidatePath("/(embedded)/embed/[userId]/[playlistIndex]");
    }

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }
}
