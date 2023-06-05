"use client";
import { AbItem, initialAbItem } from "../stores";
import { arrayMove } from "@dnd-kit/sortable";
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

const ABFilesContainer = ({
  items,
  onChange,
}: {
  items: AbItem[];
  onChange: (items: AbItem[]) => void;
}) => {
  // const $abItems = useReadable(store.abItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const onPlay = (file: string) => {};
  const onUploadEnds = () => {};

  const onRemoveABFile = (i: number) => () => {
    console.log("Remove");
    const newItems = items.concat([]);
    newItems.splice(i, 1);
    onChange(newItems);
  };

  const onTitleChange = (i: number) => (newTitle: string) => {
    const updatedItem = { ...items[i], title: newTitle };
    const newItems = [...items];
    newItems.splice(i, 1, updatedItem);
    onChange(newItems);
  };

  const onAddABFile = () => {
    onChange([...items, initialAbItem()]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended", event);
    const { active, over } = event;
    if (active && over) {
      const from = items.findIndex((item) => item.uid === active.id);
      const to = items.findIndex((item) => item.uid === over.id);
      if (from !== -1 && to !== -1) {
        onChange(arrayMove(items, from, to));
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4 opacity-80">Files</h2>
      <div className="mb-4">
        {items.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map(({ uid }) => uid)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, i) => (
                <ABFile
                  key={item.uid}
                  id={item.uid}
                  title={item.title}
                  a={item.beforeFile}
                  b={item.afterFile}
                  onTitleChange={onTitleChange(i)}
                  onPlayA={() => {}}
                  onPlayB={() => {}}
                  onRemoveA={() => {}}
                  onRemoveB={() => {}}
                  onRemove={onRemoveABFile(i)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          "No items in the playlist yet"
        )}
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
