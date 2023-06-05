import { User } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { debounce } from "lodash";

export const supabase = createBrowserSupabaseClient();

export const user = writable<User | null>(null);

// ██████╗  ██████╗  ██████╗
// ██╔══██╗██╔═══██╗██╔════╝
// ██║  ██║██║   ██║██║
// ██║  ██║██║   ██║██║
// ██████╔╝╚██████╔╝╚██████╗
// ╚═════╝  ╚═════╝  ╚═════╝

export type UserFile = {
  path: string;
  size: number;
};

export type AbItem = {
  title: string;
  beforeFile: null | UserFile;
  afterFile: null | UserFile;
  uid: string;
};

export type Playlist = {
  slug: string;
  mainColor: string;
  altColor: string;
  items: AbItem[];
};

export type ContextUserDoc = {
  id: string;
  context: string;
  ownerId: string;
  doc: Doc;
};

export type Doc = {
  playlists: Playlist[];
};

const initialContextUserDoc = (userId: string): ContextUserDoc => ({
  id: "",
  context: "soundtoggle",
  ownerId: userId,
  doc: initialDoc(),
});

const initialDoc = (): Doc => ({
  playlists: [buildPlaylist()],
});

export const buildPlaylist = () => ({
  slug: generateRandomString(),
  mainColor: "hsl(0, 50%, 90%)",
  altColor: "hsl(180, 50%, 90%)",
  items: [],
});

export const initialAbItem = (): AbItem => ({
  title: "",
  beforeFile: null,
  afterFile: null,
  uid: generateRandomString(),
});

export const userDoc = writable<ContextUserDoc>(initialContextUserDoc(""));

export const loadUserDoc = async (user: User) => {
  const { data, error } = await supabase
    .from("docs")
    .select("*")
    .eq("context", "soundtoggle")
    .eq("ownerId", user.id);

  const userDocs = data as ContextUserDoc[];

  if (!error) {
    console.log("Docs for user loaded", userDocs);
    let loadedUserDoc = userDocs[0];
    if (!loadedUserDoc) {
      console.log("No docs for user in DB, creating initial doc");
      const { data: createdDoc, error } = await supabase
        .from("docs")
        .insert(initialContextUserDoc(user.id))
        .single();
      if (error) {
        console.error("Error creating doc", error);
      } else {
        loadedUserDoc = createdDoc; // Now it has an ID
        userDoc.update(() => createdDoc);
      }
    }

    // Schema validation
    if (!loadedUserDoc.doc.playlists) {
      loadedUserDoc.doc = initialDoc();
      saveDoc(loadedUserDoc);
    }

    if (loadedUserDoc) {
      userDoc.update(() => loadedUserDoc);
    }
  } else {
    console.error("Error fetching user docs", error);
  }
};

export async function saveDoc(userDocToSave: ContextUserDoc) {
  const { data, error } = await supabase
    .from("docs")
    .update(userDocToSave)
    .eq("id", userDocToSave.id);
  if (error) {
    console.error("Error updating doc", error);
  } else {
    console.log("doc updated", data);
  }
}

export const debouncedSaveDoc = debounce(saveDoc, 1000);

// ██╗   ██╗████████╗██╗██╗     ███████╗
// ██║   ██║╚══██╔══╝██║██║     ██╔════╝
// ██║   ██║   ██║   ██║██║     ███████╗
// ██║   ██║   ██║   ██║██║     ╚════██║
// ╚██████╔╝   ██║   ██║███████╗███████║
//  ╚═════╝    ╚═╝   ╚═╝╚══════╝╚══════╝

function generateRandomString() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
