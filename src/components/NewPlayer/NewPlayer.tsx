"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import cx from "classnames";
import { Playlist, AbItem } from "@/types";
import "./style.css";

import MultiAudio from "./MultiAudio";

let timeIntervalReader: NodeJS.Timeout | null = null;
let scrubTimeout: NodeJS.Timeout | null = null;
let pausedForScrub = false;

export default function NewPlayer({ playlist }: { playlist: Playlist }) {
  const [beforeAfter, setBeforeAfter] = useState(false);
  const [itemPlayingIndex, setItemPlayingIndex] = useState<null | number>(null);
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [multiAudio, setMultiAudio] = useState<null | MultiAudio>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const items = useMemo(
    () => playlist.items.filter((item) => item.beforeFile && item.afterFile),
    [playlist.items]
  );

  useEffect(() => {
    return () => {
      if (multiAudio) {
        multiAudio.cleanEvents();
      }
      if (timeIntervalReader) clearInterval(timeIntervalReader);
      if (scrubTimeout) clearTimeout(scrubTimeout);
    };
  }, []);

  useEffect(() => {
    setItemPlayingIndex(null);
    setAudioIsPlaying(false);
    setCurrentTime(0);
    setAudioDuration(0);
    setScrubPosition(0);
    setIsLoading(false);
    if (multiAudio) {
      multiAudio.cleanEvents();
      multiAudio.stop();
    }
  }, [items]);

  const handlePlayPauseControl = useCallback(() => {
    if (items.length) {
      playPauseItem(itemPlayingIndex !== null ? itemPlayingIndex : 0);
    }
  }, [itemPlayingIndex, items]);

  const playPauseItem = useCallback(
    (index: number) => {
      if (index !== itemPlayingIndex) {
        const newMultiAudio = new MultiAudio(
          items[index].beforeFile?.url as string,
          items[index].afterFile?.url as string,
          beforeAfter
        );
        if (multiAudio && !multiAudio.paused) {
          multiAudio.stop();
          multiAudio.cleanEvents();
        }
        setMultiAudio(newMultiAudio);
        setItemPlayingIndex(index);
        setAudioIsPlaying(true);
        newMultiAudio.play();
        setIsLoading(true);
        newMultiAudio.onLoadFinishes(() => {
          setIsLoading(false);
        });
        newMultiAudio.onDurationLoads(setAudioDuration);
        newMultiAudio.onEnded(() => {
          handleNext(index);
        });
      } else {
        // Clicked the same file, just playPause it without loading
        audioIsPlaying ? multiAudio?.pause() : multiAudio?.play();
        setAudioIsPlaying(!audioIsPlaying);
      }
    },
    [itemPlayingIndex, audioIsPlaying, multiAudio, beforeAfter, items]
  );

  const handleToggle = useCallback(() => {
    const newBeforeAfter = !beforeAfter;
    multiAudio?.switchFile(newBeforeAfter);
    setBeforeAfter(newBeforeAfter);
  }, [beforeAfter, multiAudio, items]);

  useEffect(() => {
    if (timeIntervalReader) clearInterval(timeIntervalReader);
    function setScrub() {
      if (
        multiAudio &&
        !scrubTimeout &&
        currentTime !== multiAudio.currentTime
      ) {
        setCurrentTime(multiAudio.currentTime);
        if (audioDuration)
          setScrubPosition(multiAudio.currentTime / audioDuration);
      }
    }

    setScrub();

    timeIntervalReader = setInterval(() => {
      setScrub();
    }, 100);
  }, [multiAudio, audioDuration, items]);

  const scrubTo = useCallback(
    (newPosition: number) => {
      if (scrubTimeout) {
        clearTimeout(scrubTimeout);
      }
      if (multiAudio && audioDuration) {
        if (!multiAudio.paused) {
          multiAudio.pause();
          pausedForScrub = true;
        }
        if (pausedForScrub) {
          scrubTimeout = setTimeout(() => {
            multiAudio.play();
            scrubTimeout = null;
            pausedForScrub = false;
          }, 50);
        }
        multiAudio.currentTime = newPosition * audioDuration;
        setScrubPosition(newPosition);
      }
    },
    [multiAudio, audioDuration, items]
  );

  const handleNext = useCallback(
    (index: number | null = itemPlayingIndex) => {
      if (index !== null) {
        let newIndex = index + 1;
        if (newIndex > items.length - 1) {
          newIndex = 0;
        }
        playPauseItem(newIndex);
      }
    },
    [itemPlayingIndex, items]
  );

  const handlePrev = useCallback(() => {
    if (itemPlayingIndex !== null && multiAudio) {
      if (multiAudio.currentTime > 3) {
        if (multiAudio) {
          multiAudio.currentTime = 0;
          setCurrentTime(0);
          setScrubPosition(0);
        }
      } else {
        let newIndex = itemPlayingIndex - 1;
        if (newIndex < 0) {
          newIndex = items.length - 1;
        }
        playPauseItem(newIndex);
      }
    }
  }, [itemPlayingIndex, multiAudio, items]);

  return (
    <>
      <style>
        {`
      :root {
        --primary-color: ${playlist.mainColor};
        --accent-color: ${playlist.altColor};
      }
      `}
      </style>

      <div className="bg-[var(--primary-color)] w-full h-full">
        <div className="max-w-screen-sm mx-auto px-2">
          <div className="flex flex-col items-center">
            <div className="flex items-center mt-4">
              <button
                className="cursor-pointer border-0 box-border h-12 w-12 bg-white rounded-full p-3 text-gray-700 shadow-md hover:bg-[var(--accent-color)] hover:text-white/90 hover:scale-110 transition"
                onClick={() => handlePrev()}
              >
                <span className="flex mr-0.5 mt-0.25">{PrevIcon}</span>
              </button>
              <button
                className="cursor-pointer border-0 box-border h-16 w-16 bg-white rounded-full p-4 text-gray-700 shadow-md mx-2 hover:bg-[var(--accent-color)] hover:text-white/90 hover:scale-110 transition"
                onClick={() => handlePlayPauseControl()}
              >
                <span
                  className={cx("h-8 w-8 flex items-center justify-center", {
                    "ml-0.5": !audioIsPlaying,
                  })}
                >
                  {audioIsPlaying ? PauseIcon : PlayIcon}
                </span>
              </button>
              <button
                className="cursor-pointer border-0 box-border h-12 w-12 bg-white rounded-full p-3 text-gray-700 shadow-md hover:bg-[var(--accent-color)] hover:text-white/90 hover:scale-110 transition"
                onClick={() => handleNext()}
              >
                <span className="flex ml-0.5 mt-0.25">{NextIcon}</span>
              </button>
            </div>
            <div className="max-w-full w-80">
              <input
                type="range"
                className="scrub-control"
                min="0"
                max="1"
                value={scrubPosition}
                step="any"
                onChange={(ev) => {
                  scrubTo(parseFloat(ev.target.value));
                }}
              />
            </div>
            <div className="text-white/40 mt-4 font-mono">
              <span>{formatDuration(currentTime)}</span>
              &nbsp;/&nbsp;
              <span>
                {audioDuration ? formatDuration(audioDuration) : "--:--"}
              </span>
            </div>
            <div className="text-black/80 font-medium mt-4 flex items-center bg-white/95 text-black py-2 rounded-lg shadow-md">
              <div className="uppercase tracking-wider text-md w-24 text-right">
                Before
              </div>
              <label className="switch mx-2">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={beforeAfter}
                  onChange={(ev) => handleToggle()}
                />
                <span className="switch-color"></span>
                <span className="switch-handle"></span>
              </label>
              <div className="uppercase tracking-wider text-md w-24">After</div>
            </div>
          </div>
          <div className="mt-4">
            {items.map((item, i) => (
              <AudioListItem
                key={i}
                item={item}
                onPlayPause={() => playPauseItem(i)}
                selected={itemPlayingIndex === i}
                playing={itemPlayingIndex === i && audioIsPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const AudioListItem = ({
  item,
  onPlayPause,
  selected,
  playing,
}: {
  item: AbItem;
  onPlayPause: () => void;
  selected: boolean;
  playing: boolean;
}) => {
  return (
    <label
      className={cx(
        "audio-list-item flex items-center mb-4 group cursor-pointer hover:bg-white/10 rounded-md group",
        { "bg-white/10": selected }
      )}
    >
      <button
        onClick={() => onPlayPause()}
        className="cursor-pointer border-0 bg-transparent box-border flex items-center justify-center h-12 w-12 p-2 text-white/90 mr-4 audio-item-play group-hover:scale-110 transition"
      >
        {playing ? PauseIcon : PlayIcon}
      </button>
      <div className="audio-item-title flex-grow text-white/70 text-xl">
        {item.title}
      </div>
    </label>
  );
};

const PrevIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512"
  >
    <path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z" />
  </svg>
);

const NextIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512"
  >
    <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z" />
  </svg>
);

const PlayIcon = (
  <svg
    className="max-w-full max-h-full"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 384 512"
  >
    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
  </svg>
);

const PauseIcon = (
  <svg
    className="max-w-full max-h-full"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 320 512"
  >
    <path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z" />
  </svg>
);

function formatDuration(duration: number) {
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  let formattedDuration =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;
  return formattedDuration;
}
