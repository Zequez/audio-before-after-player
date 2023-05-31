"use client";
import { useState } from "react";
import { UserFile } from "../../lib/database.types";
import * as store from "../stores";
import { useReadable } from "react-use-svelte-store";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import ABFile from "./ABFile";
import Button from "./ui/Button";

const ABFilesContainer = () => {
  const $abItems = useReadable(store.abItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const onPlay = (file: string) => {};
  const onDragEnd = () => {};
  const onUploadEnds = () => {};

  const onRemoveABFile = (localId: string) => {
    store.deleteAbItem(localId);
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

  const onTitleChange = (localId: string, newTitle: string) => {
    store.updateAbItemTitle(localId, newTitle);
  };

  const onAddABFile = () => {
    store.addAbItem();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DRAG ENDED!", event);
    const { active, over } = event;
    if (active && over) {
      store.moveAbItemTo(active.id as string, over.id as string);
    }
  };

  const undeletedItems = $abItems && $abItems.filter((item) => !item.deleted);

  return (
    <div>
      <h2 className="text-2xl mb-4 opacity-80">Files</h2>
      <div className="mb-4">
        {undeletedItems ? (
          undeletedItems.length ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={undeletedItems.map((item) => item.localId)}
                strategy={verticalListSortingStrategy}
              >
                {undeletedItems.map(renderAbFile)}
              </SortableContext>
            </DndContext>
          ) : (
            "No items in the playlist yet"
          )
        ) : (
          "Loading..."
        )}
      </div>
      <div className="text-right">
        <Button onClick={onAddABFile}>Add file</Button>
      </div>
    </div>
  );

  function renderAbFile(
    { abItem: { title, a, b }, localId }: store.WrappedAbItem,
    i: number
  ) {
    return (
      <ABFile
        key={localId}
        title={title}
        a={a ? { ...a, name: extractNameFromUrl(a.bucketStorageUrl) } : a}
        b={b ? { ...b, name: extractNameFromUrl(b.bucketStorageUrl) } : b}
        id={localId}
        localId={localId}
        onTitleChange={onTitleChange.bind(null, localId)}
        onSwitchAb={onSwitchAb.bind(null, i)}
        onPlayA={() => {}}
        onPlayB={() => {}}
        onRemoveA={() => {}}
        onRemoveB={() => {}}
        onRemove={onRemoveABFile.bind(null, localId)}
      />
    );
  }
};

const extractNameFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export default ABFilesContainer;
