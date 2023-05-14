"use client";
import ABFile from "./ABFile";

const ABFilesContainer = () => {
  const ABFiles = [
    {
      title: "Black Cap",
      a: {
        name: "/files/BlackCap_Before.mp3",
        size: 123456,
        length: 123,
      },
      b: {
        name: "/files/BlackCap_After.mp3",
        size: 123456,
        length: 123,
      },
    },
    {
      title: "Deafens Me",
      a: {
        name: "/files/Deafens Me_Before.mp3",
        size: 123456,
        length: 123,
      },
      b: undefined,
    },
  ];

  const onPlay = (file: string) => {};

  const onRemove = (file: string) => {};

  const onSwitchAb = () => {};

  const onDragEnd = () => {};

  const onTitleChange = () => {};

  return (
    <div>
      <h2 className="text-2xl mb-4 opacity-80">Files</h2>
      <div className="mb-4">
        {ABFiles.map(({ title, a, b }, i) => (
          <ABFile
            key={i}
            title={title}
            a={a}
            b={b}
            onTitleChange={() => {}}
            onSwitchAb={() => {}}
            onPlayA={() => {}}
            onPlayB={() => {}}
            onRemoveA={() => {}}
            onRemoveB={() => {}}
          />
        ))}
      </div>
      <div className="text-right">
        <button className="bg-[#EEC643] text-white font-bold uppercase rounded-md p-2">
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
