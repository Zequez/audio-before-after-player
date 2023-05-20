import React from "react";
import Image from "next/image";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import userCheckIcon from "../icons/userCheck.svg";

interface AuthProps {}

const Authentication: React.FC<AuthProps> = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();

  return (
    <div className="rounded-md bg-[#EEF0F2] shadow-md mb-8 p-4">
      {user ? (
        <>
          <div className="flex items-center">
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
            <button
              className="bg-saffron text-antiflash text-shadow-px uppercase px-4 py-2 rounded-md font-bold hover:bg-saffron/80"
              onClick={() => supabaseClient.auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center">
          {/* <h2 className="text-lg flex-grow">Sign up</h2> */}
          <div className="w-80">
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
