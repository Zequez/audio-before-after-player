"use client";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/stores";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionContextProvider supabaseClient={supabase}>
        {children}
      </SessionContextProvider>
    </>
  );
};

export default AuthProvider;
