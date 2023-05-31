import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableListProps {}

const SortableList: React.FC<SortableListProps> = () => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));
  const [items, setItems] = useState(["apple", "banana", "orange"]);

  return (
    <div className="bg-antiflash rounded-md mb-8 p-4 space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <Item key={item} name={item} id={item} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
};

const Item: React.FC<{ name: string; id: string }> = ({ name, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="flex p-2 border border-solid border-night/20 rounded-md bg-antiflash"
      ref={setNodeRef}
      style={style}
    >
      <div
        {...listeners}
        {...attributes}
        className="flex-shrink-0 bg-saffron rounded-sm cursor-ns-resize"
      >
        [DRAG]
      </div>
      <div className="flex-grow ml-2">{name}</div>
    </div>
  );
};

export default SortableList;
