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
        <div className="bg-white rounded-md flex items-center justify-center px-2 border border-night/50 mr-2">
          <span className="mr-2">Main</span>{" "}
          <input
            type="color"
            value={playlist.mainColor}
            onChange={(e) => updateMainColor(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-md flex items-center justify-center px-2  border border-night/50 mr-2">
          <span className="mr-2">Alt</span>{" "}
          <input
            type="color"
            value={playlist.altColor}
            onChange={(e) => updateAltColor(e.target.value)}
          />
        </div>
      </div>
      <ABFilesContainer items={playlist.items} onChange={updateItems} />
    </div>
  );
};

export default PlayerConfigurator;
