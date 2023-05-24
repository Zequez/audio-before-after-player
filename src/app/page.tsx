"use client";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import ConfigPage from "./components/ConfigPage";

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
  return (
    <Provider>
      <ConfigPage />
    </Provider>
  );
}
