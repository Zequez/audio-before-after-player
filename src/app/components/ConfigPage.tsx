"client only";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import cx from "classnames";
import Authentication from "./Authentication";
import PlayerConfigurator from "./PlayerConfigurator";
import Button from "./ui/Button";
import { Playlist, BLANK_PLAYLIST } from "../../lib/database.types";

export default function ConfigPage() {
  const supabase = useSupabaseClient();
  const [playlist, setPlaylist] = useState<Playlist>(BLANK_PLAYLIST);
  const user = useUser();

  useEffect(() => {
    if (user) {
      (async function loadData() {
        const { data, error } = await supabase
          .from("playlists")
          .select("*")
          .eq("admin", user.id);
        const playlists = data as Playlist[];

        if (!error) {
          if (!playlists.length) {
            // We create a new playlist
            const newPlaylist: Playlist = {
              slug: "my-new-playlist",
              mainColor: "#ff0000",
              altColor: "#00ff00",
              admin: user.id,
            };
            const { data: playlist, error } = await supabase
              .from("playlists")
              .insert(newPlaylist)
              .single();
            if (error) {
              console.error("Error creating playlist", error);
            } else {
              setPlaylist(playlist);
            }
          } else {
            // We use the current playlist
            setPlaylist(playlists[0]);
          }
        } else {
          console.error("Error fetching user playlists", error);
        }
      })();
    }
  }, [user]);

  const handleChangePlaylist = async (playlist: Playlist) => {
    setPlaylist(playlist);
    debouncedUpdatePlaylist(playlist);
  };

  const updatePlaylist = async (playlist: Playlist) => {
    const { data, error } = await supabase
      .from("playlists")
      .update(playlist)
      .eq("id", playlist.id);
    if (error) {
      console.error("Error updating playlist", error);
    } else {
      console.log("Playlist updated", data);
    }
  };

  const debouncedUpdatePlaylist = useCallback(
    debounce(updatePlaylist, 1000),
    []
  );

  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/abst3t3" sandbox="allow-scripts" width="500px" height="815px"/>`;
  return (
    <main className="min-h-screen p-12 max-w-6xl mx-auto items-center">
      <Authentication />
      <div className="relative">
        {!user ? (
          <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded bg-antiflash/20 z-40"></div>
        ) : null}
        <div className={cx({ "blur-sm": !user })}>
          <div className="flex mb-8 flex-col lg:flex-row">
            <PlayerConfigurator
              playlist={playlist}
              onChangePlaylist={handleChangePlaylist}
            />
            <iframe
              className="rounded-md bg-[#EEF0F2] shadow-md w-full lg:w-[500px] h-[810px] flex-shrink-0"
              src="/matt.html"
            ></iframe>
          </div>
          <div className="rounded-md bg-[#EEF0F2] shadow-md p-4">
            <h2 className="text-2xl mb-4 opacity-80">Embed playlist player</h2>
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 rounded-l-md border border-r-0 text-black/50"
                value={embedValue}
                onChange={() => {}}
              />
              <Button className="rounded-l-none">COPY</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
