"client only";
import Image from "next/image";
import { useRef } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useReadable } from "react-use-svelte-store";
import cx from "classnames";
import { sizeInBToMb } from "@/lib/utils";
import Authentication from "./Authentication";
import PlayerConfigurator from "./PlayerConfigurator";
import Player from "./Player";

import logo from "@/logo.svg";
import {
  user as storeUser,
  loadUserDoc,
  loadUserFiles,
  Playlist,
  Doc,
  userDoc,
  bucketFiles,
  usedStorage,
  debouncedSaveDoc,
} from "@/stores";
import { useEffect } from "react";
import EmbedCopy from "./EmbedCopy";
// import SortableList from "./SortableList";

export default function ConfigPage() {
  const embedInputBoxEl = useRef<HTMLInputElement>(null);
  const user = useUser();
  const $doc = useReadable(userDoc);
  const $bucketFiles = useReadable(bucketFiles);
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

  const $usedStorage = useReadable(usedStorage);

  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/${
    user?.id || ""
  }/${playlistIndex}" sandbox="allow-scripts" width="500px" height="815px"/>`;
  return (
    <main className="min-h-screen p-4 sm:p-12 sm:max-w-6xl mx-auto items-center">
      <h1 className="max-w-[300px] sm:max-w-lg mx-auto mb-4">
        <a href="/">
          <Image src={logo} alt="SoundToggle - Before and after audio player" />
        </a>
      </h1>
      <Authentication />
      <div className="relative">
        {!user ? (
          <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded bg-antiflash/20 z-40"></div>
        ) : null}
        <div className={cx({ "blur-sm": !user || !$doc.id })}>
          <div className="flex mb-8 flex-col lg:flex-row">
            {/* <SortableList /> */}
            <PlayerConfigurator playlist={playlist} onChange={updatePlaylist} />
            <div className="lg:w-[550px] h-[810px] flex-shrink-0">
              <Player playlist={playlist} />
            </div>
          </div>
          <EmbedCopy value={embedValue} />
          <div className="rounded-md bg-antiflash shadow-md p-4">
            <h2 className="text-center text-2xl mb-4 opacity-80">Storage</h2>
            {/* <p className="opacity-50 text-center mb-4">
              Free up to 20MB of files storage
            </p> */}
            <div className="flex text-3xl items-center justify-center mb-4 space-x-4">
              <div className="text-right text-3xl opacity-75">
                You are using
              </div>
              <div className="bg-saffron/10 border-saffron/40 text-night/50 font-bold border-2 rounded-lg p-8 text-center">
                <div>{sizeInBToMb($usedStorage)}mb / 100mb</div>
                <div className="text-lg font-normal">of free storage</div>
              </div>
            </div>
            <h2 className="text-center text-2xl mb-4 opacity-75">
              Get additional storage
            </h2>
            <stripe-pricing-table
              pricing-table-id="prctbl_1NHqQEJgi8a4J0BVw9r6KNpF"
              publishable-key="pk_test_51NHq08Jgi8a4J0BVZZ38gt8J5eAGsDLb7yu0WGv2MlhodXg8SLaK7cmnzBX8Qz5L1efp1Yy7yellZGUkXYwqtVYr004v6JsQnZ"
            ></stripe-pricing-table>
          </div>
        </div>
      </div>
    </main>
  );
}
