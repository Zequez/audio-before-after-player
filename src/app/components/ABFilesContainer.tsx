"use client";
import { useState } from "react";
import ABFile from "./ABFile";

type User = {
  name: string;
  email: string;
};

type Playlist = {
  slug: string;
  name: string;
  mainColor: string;
  altColor: string;
  user: string;
};

type UserFile = {
  bucketStorageURL: string;
  size: number;
  length: number;
};

type ABItem = {
  a?: UserFile;
  b?: UserFile;
  title: string;
  playlistId: number;
  playlistOrder: number;
};

const ABFilesContainer = ({ playlistId }: { playlistId: number }) => {
  const [ABFiles, setABFiles] = useState<ABItem[]>([
    {
      title: "Black Cap",
      a: {
        bucketStorageURL: "/files/BlackCap_Before.mp3",
        size: 123456,
        length: 123,
      },
      b: {
        bucketStorageURL: "/files/BlackCap_After.mp3",
        size: 123456,
        length: 123,
      },
      playlistId: 1,
      playlistOrder: 1,
    },
    {
      title: "Deafens Me",
      a: {
        bucketStorageURL: "/files/Deafens Me_Before.mp3",
        size: 123456,
        length: 123,
      },
      b: undefined,
      playlistId: 1,
      playlistOrder: 2,
    },
  ]);

  const onPlay = (file: string) => {};
  const onDragEnd = () => {};
  const onUploadEnds = () => {};

  const onRemoveABFile = (i: number) => {
    setABFiles((prev) => {
      const newABFiles = [...prev];
      newABFiles.splice(i, 1);
      return newABFiles;
    });
  };

  const onSwitchAb = (i: number) => {
    setABFiles((prev) => {
      const newABFiles = [...prev];
      const oldB = newABFiles[i].b;
      newABFiles[i].b = newABFiles[i].a;
      newABFiles[i].a = oldB;
      return newABFiles;
    });
  };

  const onTitleChange = (i: number, newTitle: string) => {
    setABFiles((prev) => {
      const newABFiles = [...prev];
      newABFiles[i].title = newTitle;
      return newABFiles;
    });
  };

  const onAddABFile = () => {
    setABFiles((prev) => [
      ...prev,
      {
        title: "",
        a: undefined,
        b: undefined,
        playlistId: playlistId,
        playlistOrder: prev.length + 1,
      },
    ]);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 opacity-80">Files</h2>
      <div className="mb-4">
        {ABFiles.map(({ title, a, b }, i) => (
          <ABFile
            key={i}
            title={title}
            a={a ? { ...a, name: extractNameFromUrl(a.bucketStorageURL) } : a}
            b={b ? { ...b, name: extractNameFromUrl(b.bucketStorageURL) } : b}
            onTitleChange={onTitleChange.bind(null, i)}
            onSwitchAb={onSwitchAb.bind(null, i)}
            onPlayA={() => {}}
            onPlayB={() => {}}
            onRemoveA={() => {}}
            onRemoveB={() => {}}
            onRemove={onRemoveABFile.bind(null, i)}
          />
        ))}
      </div>
      <div className="text-right">
        <button
          className="bg-[#EEC643] text-white font-bold uppercase rounded-md p-2"
          onClick={onAddABFile}
        >
          Add file
        </button>
      </div>
    </div>
  );
};

const extractNameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export default ABFilesContainer;
