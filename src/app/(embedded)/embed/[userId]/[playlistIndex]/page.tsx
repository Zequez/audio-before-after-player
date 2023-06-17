// import Player from "@/app/components/Player";
// import Layout from "@/app/layout";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Playlist } from "@/types";
import NewPlayer from "@/components/NewPlayer/NewPlayer";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be available"
  );
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const metadata = {
  title: "Before After Audio Player",
  description: "A simple before after audio player",
};

const EmbedPage = async ({
  params,
}: {
  params: { userId: string; playlistIndex: string };
}) => {
  const { data, error } = await supabase
    .from("docs")
    .select("*")
    .eq("context", "soundtoggle")
    .eq("ownerId", params.userId);

  if (error) {
    throw new Error(
      `Error connecting to the database. Error code: ${error.code}`
    );
  }

  const index = parseInt(params.playlistIndex);

  if (
    !data.length ||
    !data[0]?.doc?.playlists ||
    !data[0].doc.playlists[index]
  ) {
    notFound();
  }

  const playlist = data[0].doc.playlists[index] as Playlist;

  return <NewPlayer playlist={playlist} />;
};

export default EmbedPage;
