"client only";
import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import cx from "classnames";
import Authentication from "./Authentication";
import PlayerConfigurator from "./PlayerConfigurator";
import Button from "./ui/Button";

export default function ConfigPage() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabaseClient.from("playlists").select();
      console.log(user, data, error);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/abst3t3" sandbox="allow-scripts" width="500px" height="815px"/>`;
  return (
    <main className="min-h-screen p-12 max-w-6xl mx-auto items-center">
      <Authentication />
      <div className="relative">
        {!user ? (
          <div className="absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] rounded bg-antiflash/20 z-40"></div>
        ) : null}
        <div className={cx({ "blur-sm": !user })}>
          <div className="flex mb-8 flex-col lg:flex-row">
            <PlayerConfigurator />
            <iframe
              className="rounded-md bg-[#EEF0F2] shadow-md w-full lg:w-[500px] h-[810px] flex-shrink-0"
              src="/matt.html"
            ></iframe>
          </div>
          <div className="rounded-md bg-[#EEF0F2] shadow-md p-4">
            <h2 className="text-2xl mb-4 opacity-80">Embed playlist player</h2>
            <div className="flex">
              <input
                type="text"
                className="w-full p-2 rounded-l-md border border-r-0 text-black/50"
                value={embedValue}
                onChange={() => {}}
              />
              <Button className="rounded-l-none">COPY</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
