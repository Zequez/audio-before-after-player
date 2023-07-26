"use client";

import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import cx from "classnames";
import { sizeInBToMb } from "@/lib/utils";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

// async function getData() {
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL || "",
//     process.env.NEXT_SUPABASE_SERVICE_ROLE || ""
//   );
//   const { data: users, error } = await supabase.auth.admin.listUsers({
//     page: 1,
//     perPage: 1000,
//   });

//   if (error) {
//     throw new Error(`Error connecting to the database`);
//   }

//   return users.users;
// }

export default function Page() {
  // const users = await getData();
  const supabase = useSupabaseClient();
  const { session, error, isLoading } = useSessionContext();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    if (session && status !== "success") {
      (async () => {
        const response = await fetch(
          `/api/users?token=${session.access_token}`
        );
        if (response.status === 200) {
          const { users } = await response.json();

          // Add total bucket usage to test user
          // Gotta do this on the server-side
          // on demand and cache the values
          const testUser = users[users.length - 1];
          console.log("User", testUser);
          const { data: bucketFiles, error } = await supabase.storage
            .from("soundtoggle")
            .list(testUser.id, { limit: 200 });
          if (bucketFiles) {
            console.log("Bucket for user", bucketFiles);
            const totalUsage = bucketFiles.reduce((acc, file) => {
              return acc + file.metadata.size;
            }, 0);
            testUser.restrictedDoc = { totalUsage };
            console.log(testUser);
          }

          const sortedUsers = (users as any[]).sort((a, b) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });
          setUsers(sortedUsers);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })();
      (async () => {})();
    }
  }, [session]);

  return (
    <div className="bg-antiflash rounded-md p-8">
      {status === "loading" ? (
        "Loading..."
      ) : status === "error" ? (
        "Error. Are you admin?"
      ) : (
        <table className="w-full">
          <thead>
            <tr className="">
              <Th className="text-left">Email</Th>
              <Th>Created At</Th>
              <Th>Last Sign In</Th>
              <Th>Storage Usage</Th>
              <Th>Embed Link</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b last:border-b-0 border-night/10 odd:bg-night/10 even:bg-night/5 group"
              >
                <Td className="!text-left">{user.email}</Td>
                <Td>
                  <TimeAgoString dateString={user.created_at} />
                </Td>
                <Td>
                  <TimeAgoString dateString={user.last_sign_in_at} />
                </Td>
                <Td>
                  {user.restrictedDoc ? (
                    `${sizeInBToMb(user.restrictedDoc.totalUsage)} MB`
                  ) : (
                    <NA />
                  )}
                </Td>
                <Td>
                  {user.doc ? (
                    <a
                      className="text-blue-400 underline"
                      href={`/embed/${user.id}/0`}
                    >
                      Embed
                    </a>
                  ) : (
                    <NA />
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function NA() {
  return <span className="text-night/30">N/A</span>;
}

function Th({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      className={cx(
        "border-r border-night/20 last:border-0 p-2 bg-oxfordblue/50 text-white first:rounded-tl-md last:rounded-tr-md ",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <td
      className={cx(
        "border-r last:border-r-0 border-night/20 text-center px-2 group-last:first:rounded-bl-md group-last:last:rounded-br-md",
        className
      )}
    >
      {children}
    </td>
  );
}

function TimeAgoString({ dateString }: { dateString: string }) {
  const date = new Date(dateString);
  return <span title={date.toTimeString()}>{timeAgo.format(date)}</span>;
}
