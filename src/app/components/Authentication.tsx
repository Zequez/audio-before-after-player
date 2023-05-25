import React from "react";
import Image from "next/image";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Button from "./ui/Button";

import userCheckIcon from "../icons/userCheck.svg";

interface AuthProps {}

const Authentication: React.FC<AuthProps> = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md mb-8 p-4">
      {user ? (
        <>
          <div className="flex flex-col sm:flex-row items-center text-center space-y-4 sm:space-y-0">
            <div className="w-20 h-20  flex items-center justify-center p-4 pl-6 bg-night/10 rounded-full shadow-sm">
              <Image
                src={userCheckIcon}
                alt="User check"
                className="opacity-70"
              />
            </div>
            <div className="flex-grow text-lg ml-4">
              Using the account{" "}
              <span className="bg-night/10 p-1 rounded-sm text-night/70">
                {user.email}
              </span>
            </div>
            <Button onClick={() => supabaseClient.auth.signOut()}>
              Sign out
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl flex-grow">Your account</h2>
          <div className="max-w-full w-80 mx-auto">
            <Auth
              redirectTo="http://localhost:3000/"
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#EEC643",
                      brandAccent: "#EEC643aa",
                    },
                  },
                },
              }}
              supabaseClient={supabaseClient}
              providers={[]}
              socialLayout="vertical"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
