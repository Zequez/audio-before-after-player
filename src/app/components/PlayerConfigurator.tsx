import { useState, useEffect } from "react";
import ABFilesContainer from "./ABFilesContainer";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

const PlayerConfigurator = () => {
  const [data, setData] = useState();
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function loadData() {
      // const { data } = await supabaseClient.from("test").select("*");
      // setData(data);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

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
