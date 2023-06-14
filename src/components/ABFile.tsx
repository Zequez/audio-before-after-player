"use client";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserFile } from "@/types";
import { user, uploadUserFile } from "@/stores";
import { useReadable } from "react-use-svelte-store";
import { sizeInBToMb } from "@/lib/utils";

import dragIcon from "@/icons/drag.svg";
import { useState } from "react";

type ABFileProps = {
  title: string;
  onTitleChange: (title: string) => void;
  onChangeA: (userFile: UserFile | null) => void;
  onChangeB: (userFile: UserFile | null) => void;
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
                className="h-6 w-6 flex items-center justify-center text-antiflash font-bold rounded-md bg-delete-red/90 hover:bg-delete-red cursor-pointer"
                onClick={onRemove}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="flex-grow pr-1 space-y-1">
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
        fileName={file.name}
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  async function handleUpload(ev: any) {
    if (ev && ev.target && $user) {
      setIsUploading(true);
      const soundFile = ev.target.files[0];
      const userFile = await uploadUserFile(soundFile);
      setIsUploading(false);
      if (userFile) {
        setUploadError(false);
        onUploaded(userFile);
      } else {
        setUploadError(true);
      }
    }
  }

  return (
    <div className="flex-grow text-xs">
      <label className="relative flex-grow flex items-center justify-center uppercase border-night/60 text-night/40 font-semibold border border-dashed rounded-md ml-1 hover:bg-night/5">
        {uploadError
          ? "Error uploading try again maybe"
          : isUploading
          ? "Uploading..."
          : "Upload"}
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
  fileName: string;
  size: number;
  onRemove: () => void;
};
const BeforeAfterItem = ({
  fileName,
  size,
  onRemove,
}: BeforeAfterItemProps) => (
  <div className="flex flex-grow items-stretch text-sm group ml-1 ">
    <div className="relative rounded-r-md mr-0.5 flex-grow flex items-center font-mono text-xs">
      <div className="absolute inset-0 flex items-center px-1 overflow-hidden w-full whitespace-nowrap border rounded-md border-night/30 text-night/40">
        <div className="flex-grow text-ellipsis text-[0.75rem] overflow-hidden mr-1">
          {fileName}
        </div>
        <div className="">{sizeInBToMb(size)}MB</div>
      </div>
    </div>
    <button
      className="font-bold w-6 ml-1 rounded-md border-solid border-2 bg-delete-red/20 border-delete-red/60 hover:bg-delete-red/30 text-delete-red cursor-pointer"
      onClick={() => onRemove()}
    >
      &minus;
    </button>
  </div>
);

export default ABFile;
