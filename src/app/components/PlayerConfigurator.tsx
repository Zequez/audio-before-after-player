import ABFilesContainer from "./ABFilesContainer";
import { playlist, updatePlaylist } from "../stores";
import { useReadable } from "react-use-svelte-store";

const PlayerConfigurator = () => {
  const $playlist = useReadable(playlist);
  const updateMainColor = (color: string) => {
    updatePlaylist({ ...$playlist, mainColor: color });
  };

  const updateAltColor = (color: string) => {
    updatePlaylist({ ...$playlist, altColor: color });
  };

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md p-4 flex-grow lg:mr-8 mb-8 lg:mb-0">
      <h2 className="text-2xl mb-4 opacity-80">Style</h2>
      <div className="mb-4 flex text-night/80">
        <div className="bg-white rounded-md flex items-center justify-center px-2 border border-night/50 mr-2">
          <span className="mr-2">Main</span>{" "}
          <input
            type="color"
            value={$playlist.mainColor}
            onChange={(e) => updateMainColor(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-md flex items-center justify-center px-2  border border-night/50 mr-2">
          <span className="mr-2">Alt</span>{" "}
          <input
            type="color"
            value={$playlist.altColor}
            onChange={(e) => updateAltColor(e.target.value)}
          />
        </div>
      </div>
      <ABFilesContainer />
    </div>
  );
};

export default PlayerConfigurator;
