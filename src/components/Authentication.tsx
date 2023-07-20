import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Auth } from "@supabase/auth-ui-react";
import {
  useUser,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import Button from "./ui/Button";
import Spinner from "./ui/Spinner";
import cx from "classnames";

import userCheckIcon from "../icons/userCheck.svg";

interface AuthProps {}

const Authentication: React.FC<AuthProps> = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const { session, error, isLoading } = useSessionContext();

  console.log("Is loading", isLoading);

  useEffect(() => {
    if (session) {
      document.location.href = "/";
    }
  }, [session]);

  return (
    <div className="">
      <h2 className="text-3xl font-light mb-8 text-center text-antiflash">
        Let&apos;s get you set up
      </h2>
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <Spinner />
        </div>
      ) : null}
      <div
        className={cx("rounded-md bg-[#EEF0F2] shadow-md mb-8 p-4", {
          hidden: isLoading,
        })}
      >
        <div className="text-center">
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
                      inputBackground: "#fff",
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
      </div>
    </div>
  );
};

export default Authentication;
