"client only";
import { useUser } from "@supabase/auth-helpers-react";
import { useReadable } from "react-use-svelte-store";
import cx from "classnames";
import Authentication from "./Authentication";
import PlayerConfigurator from "./PlayerConfigurator";
import NewPlayer from "./NewPlayer/NewPlayer";

import { Playlist, Doc } from "@/types";
import {
  user as storeUser,
  loadUserDoc,
  loadUserFiles,
  userDoc,
  debouncedSaveDoc,
} from "@/stores";
import { useEffect } from "react";
import EmbedCopy from "./EmbedCopy";
import Subscription from "./Subscription";

export default function ConfigPage() {
  const user = useUser();
  const $doc = useReadable(userDoc);
  const playlistIndex = 0;
  const playlist = $doc.doc.playlists[playlistIndex];

  useEffect(() => {
    if (user) {
      storeUser.set(user);
      loadUserDoc(user);
      loadUserFiles(user);
    }
  }, [user]);

  function updateDoc(newDoc: Doc) {
    const newUserDoc = {
      ...$doc,
      doc: newDoc,
    };

    userDoc.set(newUserDoc);
    debouncedSaveDoc(newUserDoc);
  }

  function updatePlaylist(newPlaylist: Playlist) {
    const playlistsCopy = $doc.doc.playlists.concat([]);
    playlistsCopy.splice(playlistIndex, 1, newPlaylist);
    updateDoc({ playlists: playlistsCopy });
  }

  return (
    <>
      <Authentication />
      <div className="relative">
        {!user ? (
          <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded bg-antiflash/20 z-40"></div>
        ) : null}
        <div className={cx({ "blur-sm": !user || !$doc.id })}>
          <div className="flex mb-8 flex-col lg:flex-row">
            {/* <SortableList /> */}
            <PlayerConfigurator playlist={playlist} onChange={updatePlaylist} />
            <div className="lg:w-[550px] h-[810px] flex-shrink-0 overflow-hidden rounded-md">
              <NewPlayer playlist={playlist} />
            </div>
          </div>
          <EmbedCopy userId={user?.id || ""} playlistIndex={playlistIndex} />
          <Subscription />
        </div>
      </div>
    </>
  );
}
