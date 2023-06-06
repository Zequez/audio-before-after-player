import { useEffect } from "react";
import ABFilesContainer from "./ABFilesContainer";
import {
  // playlist,
  // updatePlaylist,
  userDoc,
  // buildPlaylist2,
  Playlist,
  AbItem,
} from "../stores";
import { useReadable } from "react-use-svelte-store";

const PlayerConfigurator = ({
  playlist,
  onChange,
}: {
  playlist: Playlist;
  onChange: (playlist: Playlist) => void;
}) => {
  const updateMainColor = (color: string) => {
    onChange({ ...playlist, mainColor: color });
  };

  const updateAltColor = (color: string) => {
    onChange({ ...playlist, altColor: color });
  };

  const updateItems = (items: AbItem[]) => {
    onChange({ ...playlist, items });
  };

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md p-4 flex-grow lg:mr-8 mb-8 lg:mb-0">
      <h2 className="text-2xl mb-4 opacity-80">Style</h2>
      <div className="mb-4 flex text-night/80">
        {ColorInput("Main", playlist.mainColor, updateMainColor)}
        {ColorInput("Accent", playlist.altColor, updateAltColor)}
      </div>
      <ABFilesContainer items={playlist.items} onChange={updateItems} />
    </div>
  );
};

const ColorInput = (
  name: string,
  value: string,
  onChange: (value: string) => void
) => (
  <label className="bg-white rounded-md flex items-center justify-center p-2  border border-night/50 mr-2 cursor-pointer relative">
    <div className="mr-2">{name} color</div>{" "}
    <div
      style={{ backgroundColor: value }}
      className="rounded-md border border-night/40 w-20 h-6 shadow-inset"
    ></div>
    <input
      className="absolute inset-0 opacity-0"
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

export default PlayerConfigurator;
