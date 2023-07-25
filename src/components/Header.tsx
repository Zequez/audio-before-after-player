"use client";
import { useEffect } from "react";
import Image from "next/image";
import logo from "@/logo.svg";
import {
  useUser,
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import Button from "./ui/Button";

export default function Header() {
  const { isLoading, session, error } = useSessionContext();
  const supabaseClient = useSupabaseClient();

  console.log(session);

  useEffect(() => {
    if (!isLoading && !session && document.location.pathname !== "/auth") {
      document.location.href = "/auth";
    }
  }, [isLoading, session]);

  return (
    <header className="h-16 w-full bg-oxfordblue py-2">
      <div className="sm:max-w-6xl sm:px-12 px-4 mx-auto flex justify-start h-full">
        <a href="/" className="block h-full">
          <Image
            src={logo}
            className="max-h-full w-auto block"
            alt="SoundToggle - Before and after audio player"
          />
        </a>
        <div className="flex-grow">
          {isLoading ? null : session ? (
            <div className="flex h-full items-center justify-end">
              <Button onClick={() => supabaseClient.auth.signOut()}>
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
