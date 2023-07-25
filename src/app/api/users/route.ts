import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admins = ["zequez@gmail.com", "matthewgrosso95@gmail.com"];

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_SUPABASE_SERVICE_ROLE || ""
  );

  const currentUser = await supabase.auth.getUser(
    req.nextUrl.searchParams.get("token") || ""
  );

  // This is very bad practice, don't do this kids
  if (
    !currentUser ||
    !currentUser.data.user ||
    !admins.includes(currentUser.data.user.email || "")
  ) {
    return NextResponse.json({ error: "You are not admin" }, { status: 400 });
  }

  const { data: users, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  const { data: docs } = await supabase
    .from("docs")
    .select("*")
    .eq("context", "soundtoggle");

  console.log(docs);

  const docsByUserId = docs?.reduce((all, doc) => {
    all[doc.ownerId] = doc.doc;
    return all;
  }, {});

  const usersWithDocs = users.users.map((user) => {
    return {
      ...user,
      doc: docsByUserId[user.id],
    };
  });

  try {
    return NextResponse.json({ users: usersWithDocs });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }
}
