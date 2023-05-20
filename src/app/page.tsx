"use client";
import Authentication from "./components/Authentication";
import ABFilesContainer from "./components/ABFilesContainer";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider, Session } from "@supabase/auth-helpers-react";
import { useState } from "react";
import PlayerConfigurator from "./components/PlayerConfigurator";

const Provider = ({
  children,
}: {
  children: React.ReactNode;
  // initialSession: Session;
}) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};

export default function Home() {
  const embedValue = `<iframe src="https://app.soundtoggle.io/embed/abst3t3" sandbox="allow-scripts" width="500px" height="815px"/>`;
  return (
    <Provider>
      <main className="min-h-screen p-12 max-w-6xl mx-auto items-center">
        <Authentication />
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
            <button className="bg-[#EEC643] text-white font-bold rounded-r-md p-2">
              COPY
            </button>
          </div>
        </div>
      </main>
    </Provider>
  );
}
