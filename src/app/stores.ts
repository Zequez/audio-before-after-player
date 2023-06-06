import { User } from "@supabase/supabase-js";
import { writable, get } from "svelte/store";
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
  mainColor: "#000000",
  altColor: "#555555",
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

// ██████╗ ██╗   ██╗ ██████╗██╗  ██╗███████╗████████╗███████╗
// ██╔══██╗██║   ██║██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
// ██████╔╝██║   ██║██║     █████╔╝ █████╗     ██║   ███████╗
// ██╔══██╗██║   ██║██║     ██╔═██╗ ██╔══╝     ██║   ╚════██║
// ██████╔╝╚██████╔╝╚██████╗██║  ██╗███████╗   ██║   ███████║
// ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

const BUCKET = "soundtoggle";

type BucketFile = {
  name: string;
  metadata: {
    size: number;
  };
};

export const bucketFiles = writable<BucketFile[]>([]);

export async function loadUserFiles(user: User) {
  const { data, error } = await supabase.storage.from(BUCKET).list(user.id, {
    limit: 200,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (!error) {
    bucketFiles.set(data as any as BucketFile[]);
  } else {
    console.error("Error fetching user files", error);
  }
}

export async function uploadUserFile(file: File): Promise<UserFile | null> {
  const $user = get(user);
  if ($user) {
    const existingFile = findExistingFile(file.name);
    if (!existingFile) {
      const filePath = `${$user.id}/${file.name}`;
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file");
        return null;
      } else {
        const newBucketFile: BucketFile = {
          name: data.path,
          metadata: { size: file.size },
        };
        console.log("Uploaded file", newBucketFile);
        bucketFiles.update((bucketFiles) => [...bucketFiles, newBucketFile]);
        return bucketToUserFile(newBucketFile);
      }
    } else {
      console.log("File already exists, returning loaded one", existingFile);
      return bucketToUserFile(existingFile);
    }
  }
  throw new Error("User not logged in");
}

function bucketToUserFile(bucketFile: BucketFile): UserFile {
  const $user = get(user);
  if ($user) {
    const filePath = `${$user.id}/${bucketFile.name}`;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return {
      path: data.publicUrl,
      size: bucketFile.metadata.size,
    };
  }
  throw new Error("User not logged in");
}

function findExistingFile(fileName: string) {
  return get(bucketFiles).find((file) => file.name === fileName);
}

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
