"use client";
import { useState } from "react";
import { UserFile } from "../../lib/database.types";
import * as store from "../stores";
import { useReadable } from "react-use-svelte-store";

import ABFile from "./ABFile";
import Button from "./ui/Button";

// type AbItem = {
//   a?: UserFile;
//   b?: UserFile;
//   title: string;
// };

const ABFilesContainer = () => {
  const $abItems = useReadable(store.abItems);
  // const [ABFiles, setABFiles] = useState<AbItem[]>([
  //   {
  //     title: "Black Cap",
  //     a: {
  //       bucketStorageUrl: "/files/BlackCap_Before.mp3",
  //       size: 123456,
  //       length: 123,
  //     },
  //     b: {
  //       bucketStorageUrl: "/files/BlackCap_After.mp3",
  //       size: 123456,
  //       length: 123,
  //     },
  //   },
  //   {
  //     title: "Deafens Me",
  //     a: {
  //       bucketStorageUrl: "/files/Deafens Me_Before.mp3",
  //       size: 123456,
  //       length: 123,
  //     },
  //     b: undefined,
  //   },
  // ]);

  const onPlay = (file: string) => {};
  const onDragEnd = () => {};
  const onUploadEnds = () => {};

  const onRemoveABFile = (localId: string) => {
    store.deleteAbItem(localId);
    // abItems.update((prev) => {
    //   const newABFiles = [...prev];
    //   newABFiles[i].deleted = true;
    //   return newABFiles;
    // });
  };

  const onSwitchAb = (i: number) => {
    // abItems.update((prev) => {
    //   const newABFiles = [...prev];
    //   const oldB = newABFiles[i].b;
    //   newABFiles[i].b = newABFiles[i].a;
    //   newABFiles[i].a = oldB;
    //   return newABFiles;
    // });
  };

  const onTitleChange = (i: number, newTitle: string) => {
    // abItems.update((prev) => {
    //   const newABFiles = [...prev];
    //   newABFiles[i].title = newTitle;
    //   return newABFiles;
    // });
  };

  const onAddABFile = () => {
    store.addAbItem();
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 opacity-80">Files</h2>
      <div className="mb-4">
        {$abItems
          ? $abItems.length
            ? $abItems
                .filter((item) => !item.deleted)
                .map(({ abItem: { title, a, b, id }, localId }, i) => (
                  <ABFile
                    key={localId}
                    title={title}
                    a={
                      a
                        ? { ...a, name: extractNameFromUrl(a.bucketStorageUrl) }
                        : a
                    }
                    b={
                      b
                        ? { ...b, name: extractNameFromUrl(b.bucketStorageUrl) }
                        : b
                    }
                    id={id}
                    onTitleChange={onTitleChange.bind(null, i)}
                    onSwitchAb={onSwitchAb.bind(null, i)}
                    onPlayA={() => {}}
                    onPlayB={() => {}}
                    onRemoveA={() => {}}
                    onRemoveB={() => {}}
                    onRemove={onRemoveABFile.bind(null, localId)}
                  />
                ))
            : "No items in the playlist yet"
          : "Loading..."}
      </div>
      <div className="text-right">
        <Button onClick={onAddABFile}>Add file</Button>
      </div>
    </div>
  );
};

const extractNameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export default ABFilesContainer;
