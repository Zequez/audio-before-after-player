"use client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import ConfigPage from "@/components/ConfigPage";
import { supabase } from "@/stores";

const Provider = ({
  children,
}: {
  children: React.ReactNode;
  // initialSession: Session;
}) => {
  return (
    <>
      <SessionContextProvider supabaseClient={supabase}>
        {children}
      </SessionContextProvider>
    </>
  );
};

export default function Home() {
  return (
    <Provider>
      <ConfigPage />
    </Provider>
  );
}
