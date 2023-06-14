"use client";
import Script from "next/script";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
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
      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
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
