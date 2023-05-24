import ABFilesContainer from "./ABFilesContainer";

const PlayerConfigurator = () => {
  // useEffect(() => {
  //   async function loadData() {
  //     const { data, error } = await supabaseClient.from("playlists").select();
  //     console.log(user, data, error);
  //   }
  //   // Only run query once user is logged in.
  //   if (user) loadData();
  // }, [user]);

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md p-4 flex-grow lg:mr-8 mb-8 lg:mb-0">
      <h2 className="text-2xl mb-4 opacity-80">Style</h2>
      <div className="mb-4 flex">
        <div className="bg-white rounded-md flex items-center justify-center px-2 border mr-2">
          <span className="mr-2">Main</span> <input type="color" />
        </div>
        <div className="bg-white rounded-md flex items-center justify-center px-2 border mr-2">
          <span className="mr-2">Alt</span> <input type="color" />
        </div>
      </div>
      <ABFilesContainer playlistId={1} />
    </div>
  );
};

export default PlayerConfigurator;