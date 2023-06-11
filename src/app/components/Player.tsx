import { useRef, useEffect, useState } from "react";
import { Playlist } from "../stores";

const Player = ({ playlist }: { playlist: Playlist }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeEl = useRef<HTMLIFrameElement>(null);
  // useEffect(() => {
  //   if (iframeEl.current) {
  //     iframeEl.current.postMessage()
  //   }
  // }, [playlist])

  useEffect(() => {
    if (iframeEl.current) {
      if (iframeEl.current.contentDocument?.readyState !== "complete") {
        iframeEl.current.addEventListener("load", () => {
          setIframeLoaded(true);
        });
      } else {
        setIframeLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (iframeLoaded) {
      console.log("Iframe is loaded and playlist changed, sending message");
      sendMessage();
    }
  }, [iframeLoaded, playlist]);

  function sendMessage() {
    const files: { title: string; before: string; after: string }[] =
      playlist.items
        .filter((item) => item.beforeFile && item.afterFile)
        .map((item) => ({
          title: item.title,
          before: item.beforeFile?.path as string,
          after: item.afterFile?.path as string,
        }));

    const style = {
      mainColor: playlist.mainColor,
      altColor: playlist.altColor,
    };

    const message = { files, style };
    if (iframeEl.current) {
      iframeEl.current.contentWindow?.postMessage(message, "*");
    }
  }

  return (
    <iframe
      ref={iframeEl}
      onLoad={(ev) => console.log("IFRAME!", ev.target)}
      className="rounded-md bg-[#EEF0F2] shadow-md w-full h-full"
      src="/matt.html"
    ></iframe>
  );
};

export default Player;
