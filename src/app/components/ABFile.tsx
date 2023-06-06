"use client";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase, user, UserFile } from "../stores";
import { useReadable } from "react-use-svelte-store";

import dragIcon from "../icons/drag.svg";
import playIcon from "../icons/play.svg";

type ABFileProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onChangeA: () => void;
  onChangeB: () => void;
  onRemove: () => void;
  a: UserFile | null;
  b: UserFile | null;
  id: string;
};

const ABFile = ({
  title,
  onTitleChange,
  a,
  b,
  id,
  onChangeA,
  onChangeB,
  onRemove,
}: ABFileProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: active?.id === id ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative -ml-4 -mr-4 bg-antiflash-light first:border-t border-b border-night/30 text-opacity-75 text-black py-2"
    >
      <div className="flex">
        <div
          {...listeners}
          {...attributes}
          className="flex items-center opacity-50 px-2 cursor-move flex-shrink-0"
        >
          <Image src={dragIcon} alt="Drag" width="20" />
        </div>
        <div className="flex-grow">
          <div className="flex mb-2">
            <input
              type="text"
              value={title}
              onChange={(ev) => onTitleChange(ev.target.value)}
              className="block flex-grow text-xl py-1 px-2 bg-white rounded-md shadow-inner border border-night/50 w-full outline-saffron"
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
            <div className="flex-grow pr-1">
              <FileItem title="BEFORE" file={a} onChange={onChangeA} />
              <FileItem title="AFTER" file={b} onChange={onChangeB} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type FileItemProps = {
  title: string;
  file: UserFile | null;
  onChange: (file: UserFile | null) => void;
};
const FileItem = ({ title, file, onChange }: FileItemProps) => (
  <div className="flex h-6 text-xs">
    <div className="text-night/60 font-bold uppercase flex justify-end items-center px-1 w-14">
      {title}
    </div>
    {file ? (
      <BeforeAfterItem
        file={file.path}
        size={file.size}
        onRemove={() => onChange(null)}
      />
    ) : (
      <UploadItem onUploaded={(file: UserFile) => onChange(file)} />
    )}
  </div>
);
const UploadItem = ({
  onUploaded,
}: {
  onUploaded: (file: UserFile) => void;
}) => {
  const $user = useReadable(user);

  async function handleUpload(ev: any) {
    console.log(ev, ev.target, $user);
    if (ev && ev.target && $user) {
      const soundFile = ev.target.files[0];
      console.log("UPLOADING FILE!", soundFile);
      console.log(soundFile);
      soundFile.name;
      const { data, error } = await supabase.storage
        .from("soundtoggle")
        .upload(`${$user.id}/${soundFile.name}`, soundFile, {
          cacheControl: "3600",
          upsert: false,
        });

      console.log(data, error);
    }
  }

  return (
    <div className="flex-grow text-xs">
      <label className="relative flex-grow flex items-center justify-center uppercase border-night/60 text-night/40 font-semibold border border-dashed rounded-md ml-1 hover:bg-night/5">
        Upload
        <input
          type="file"
          accept="audio/*"
          onInput={handleUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
};

type BeforeAfterItemProps = {
  file: string;
  size: number;
  // length: number;
  // onPlay: () => void;
  onRemove: () => void;
};
const BeforeAfterItem = ({
  file,
  size,
  // length,
  // onPlay,
  onRemove,
}: BeforeAfterItemProps) => (
  <div className="flex flex-grow items-stretch text-sm group ">
    <div className="relative text-night/70 bg-night/10 rounded-r-md mr-0.5 flex-grow flex items-center font-mono text-xs">
      <div className="absolute inset-0 flex items-center px-1 overflow-hidden w-full whitespace-nowrap">
        <div className="flex-grow text-ellipsis">{file}</div>
        <div className="flex-grow">&nbsp;</div>
        <div className="">
          {/* {sizeInKBToMb(size)}MB {timeInSecondsToMinutesSeconds(length)} */}
          {sizeInKBToMb(size)}MB
        </div>
      </div>
    </div>
    <button
      className="w-6 bg-play-green text-antiflash flex items-center justify-center cursor-pointer rounded-l-md"
      onClick={() => console.log("TRIGGER PLAY")}
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
