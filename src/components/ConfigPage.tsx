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
import { useEffect, useRef, useState } from "react";
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

  const [feedbackCardVisible, setFeedbackCardVisible] = useState(false);
  function openFeedbackCard(ev: React.MouseEvent) {
    ev.stopPropagation();
    setFeedbackCardVisible(true);
  }

  return (
    <>
      <Authentication />
      <button
        className="fixed bottom-4 right-4 bg-saffron hover:opacity-90 z-50 p-4 rounded-full shadow-md text-white"
        onClick={(ev) => !feedbackCardVisible && openFeedbackCard(ev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M231.79,187.33A80,80,0,0,0,169.57,72.59,80,80,0,1,0,24.21,139.33l-7.66,26.82a14,14,0,0,0,17.3,17.3l26.82-7.66a80.15,80.15,0,0,0,25.75,7.63,80,80,0,0,0,108.91,40.37l26.82,7.66a14,14,0,0,0,17.3-17.3Zm-16.26,1.34,7.55,26.41-26.41-7.55a8,8,0,0,0-6,.68,64.06,64.06,0,0,1-86.32-24.64A79.93,79.93,0,0,0,174.7,89.71a64,64,0,0,1,41.51,92.93A8,8,0,0,0,215.53,188.67Z"></path>
        </svg>
      </button>
      {feedbackCardVisible ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/10 z-10"
            onClick={() => setFeedbackCardVisible(false)}
          ></div>
          <div
            className={cx(
              "absolute bottom-24 top-20 sm:top-auto right-4 sm:right-24 rounded-md shadow-md bg-white left-4 sm:left-auto sm:w-[500px] sm:h-[800px] overflow-hidden z-20"
            )}
          >
            <iframe
              src="https://airtable.com/embed/shrbhsk1641VlOsxz?backgroundColor=green"
              width="100%"
              height="100%"
              style={{ background: "transparent" }}
            ></iframe>
          </div>
        </div>
      ) : null}
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
