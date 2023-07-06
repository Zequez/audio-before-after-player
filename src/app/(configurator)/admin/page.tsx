"use server";

import { User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_SUPABASE_SERVICE_ROLE
  );
  const { data: users, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  console.log(error);

  if (error) {
    throw new Error(
      `Error connecting to the database. Error code: ${error.code}`
    );
  }

  return users.users;
}

export default async function Page({ mmm }: { mmm: string }) {
  const users = await getData();
  console.log(users);
  // const [users, setUsers] = useState<User[]>([]);
  // useEffect(() => {
  //   (async function fetchUsers() {
  //     const {
  //       data: { users },
  //       error,
  //     } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  //     setUsers(users);
  //   })();
  // }, []);
  return (
    <div className="bg-antiflash rounded-md p-8">
      <table className="border border-black/20 w-full rounded-md">
        <thead>
          <tr className="border-b border-black/20">
            <th className="border-r border-black/20">Email</th>
            <th className="border-r border-black/20">Created At</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-black/5">
              <td className="border-r border-black/20 p-1">{user.email}</td>
              <td className="border-r border-black/20">{user.created_at}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
