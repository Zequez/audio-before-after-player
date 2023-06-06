"client only";
import Image from "next/image";
import { useRef } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useReadable } from "react-use-svelte-store";
import cx from "classnames";
import Authentication from "./Authentication";
import PlayerConfigurator from "./PlayerConfigurator";
import Button from "./ui/Button";
import logo from "../logo.svg";
import {
  user as storeUser,
  loadUserDoc,
  Playlist,
  Doc,
  userDoc,
  debouncedSaveDoc,
} from "../stores";
import { useEffect } from "react";
// import SortableList from "./SortableList";

export default function ConfigPage() {
  const embedInputBoxEl = useRef<HTMLInputElement>(null);
  const user = useUser();
  const $doc = useReadable(userDoc);
  const playlistIndex = 0;
  const playlist = $doc.doc.playlists[playlistIndex];

  useEffect(() => {
    if (user) {
      storeUser.set(user);
      loadUserDoc(user);
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

  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/abst3t3" sandbox="allow-scripts" width="500px" height="815px"/>`;
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
                ref={embedInputBoxEl}
                disabled
                className="w-full p-2 rounded-l-md border border-r-0 border-night/50 shadow-inner text-black/50 bg-white"
                value={embedValue}
                onChange={() => {}}
              />
              <Button
                className="rounded-l-none"
                onClick={() =>
                  embedInputBoxEl.current &&
                  selectAndCopy(embedInputBoxEl.current)
                }
              >
                COPY
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function selectAndCopy(element: HTMLInputElement, copyEnabled = true) {
  window.getSelection()?.removeAllRanges();

  var range = document.createRange();
  range.selectNode(element);
  window.getSelection()?.addRange(range);

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(element.value);
      console.log("Content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  copyContent();

  // if (copyEnabled) {
  //   navigator.clipboard.writeText(element.innerText);
  //   // window.getSelection().removeAllRanges();
  // }
}
