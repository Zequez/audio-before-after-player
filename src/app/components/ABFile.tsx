"use client";
import Image from "next/image";
import dragIcon from "../icons/drag.svg";
import upIcon from "../icons/up.svg";
import downIcon from "../icons/down.svg";
import playIcon from "../icons/play.svg";

type File = {
  name: string;
  size: number;
  length: number;
};

type ABFileProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onSwitchAb: () => void;
  onRemoveA: () => void;
  onRemoveB: () => void;
  onPlayA: () => void;
  onPlayB: () => void;
  onRemove: () => void;
  a: File | undefined;
  b: File | undefined;
  id: string | undefined;
};

const ABFile = ({
  title,
  onTitleChange,
  a,
  b,
  id,
  onSwitchAb,
  onRemoveA,
  onRemoveB,
  onPlayA,
  onPlayB,
  onRemove,
}: ABFileProps) => {
  return (
    <div className="-ml-4 -mr-4 bg-white bg-opacity-50 border-t last:border-b border-night/30 text-opacity-75 text-black pb-2">
      <div className="flex">
        <div className="flex items-center opacity-50 px-2 cursor-move flex-shrink-0">
          <Image src={dragIcon} alt="Drag" width="20" />
        </div>
        <div className="flex-grow">
          <div className="flex">
            <input
              type="text"
              value={title}
              onChange={(ev) => onTitleChange(ev.target.value)}
              className="block flex-grow text-xl py-1 px-2 my-1 bg-white rounded-md shadow-inner border w-full"
            />
            <div className="flex items-center px-1">
              <button
                className="h-6 w-6 flex items-center justify-center text-antiflash font-bold rounded-md bg-delete-red cursor-pointer"
                onClick={onRemove}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="flex">
            <button
              className="flex flex-shrink-0 items-center bg-night/50 px-0.5 rounded-l-md cursor-pointer"
              onClick={onSwitchAb}
            >
              <Image src={downIcon} alt="Down" width={8} className="" />
              <Image src={upIcon} alt="Up" width={8} className="" />
            </button>
            <div className="flex-grow pr-1">
              <div className="flex h-6 text-xs">
                <div className="bg-night/40 uppercase flex justify-center items-center px-1 text-antiflash w-14">
                  BEFORE
                </div>
                {a ? (
                  <BeforeAfterItem
                    file={a.name}
                    size={a.size}
                    length={a.length}
                    onPlay={onPlayA}
                    onRemove={onRemoveA}
                  />
                ) : (
                  <UploadItem />
                )}
              </div>
              <div className="flex h-6 text-xs mt-0.5">
                <div className="bg-night/40 uppercase flex justify-center items-center px-1 text-antiflash w-14">
                  AFTER
                </div>
                {b ? (
                  <BeforeAfterItem
                    file={b.name}
                    size={b.size}
                    length={b.length}
                    onPlay={onPlayB}
                    onRemove={onRemoveB}
                  />
                ) : (
                  <UploadItem />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!id ? "Inserting..." : null}
    </div>
  );
};

const UploadItem = ({}: {}) => {
  return (
    <div className="flex-grow text-xs">
      <label className="relative flex-grow flex items-center justify-center uppercase border-night/40 text-night/40 font-bold border-2 border-dashed rounded-md ml-1 hover:bg-night/5">
        Upload
        <input
          type="file"
          accept="audio/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
};

type BeforeAfterItemProps = {
  file: string;
  size: number;
  length: number;
  onPlay: () => void;
  onRemove: () => void;
};
const BeforeAfterItem = ({
  file,
  size,
  length,
  onPlay,
  onRemove,
}: BeforeAfterItemProps) => (
  <div className="flex flex-grow items-stretch text-sm group ">
    <div className="relative text-night/70 bg-night/10 rounded-r-md mr-0.5 flex-grow flex items-center font-mono text-xs">
      <div className="absolute inset-0 flex items-center px-1 overflow-hidden w-full whitespace-nowrap">
        <div className="flex-grow text-ellipsis">{file}</div>
        <div className="flex-grow">&nbsp;</div>
        <div className="">
          {sizeInKBToMb(size)}MB {timeInSecondsToMinutesSeconds(length)}
        </div>
      </div>
    </div>
    <button
      className="w-6 bg-play-green text-antiflash flex items-center justify-center cursor-pointer rounded-l-md"
      onClick={() => onPlay()}
    >
      <Image src={playIcon} alt="Play" width={10} />
    </button>
    <button
      className="font-bold text-antiflash w-6 rounded-r-md bg-delete-red cursor-pointer"
      onClick={() => onRemove()}
    >
      &times;
    </button>
  </div>
);

const sizeInKBToMb = (size: number) => {
  return Math.round((size / 1024) * 100) / 100;
};

const timeInSecondsToMinutesSeconds = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default ABFile;
