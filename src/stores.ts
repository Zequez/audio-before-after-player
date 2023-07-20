import { User } from "@supabase/supabase-js";
import { writable, get, derived } from "svelte/store";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { debounce } from "lodash";
import { extractNameFromUrl } from "@/lib/utils";

import { ContextUserDoc, RestrictedDoc, Doc, AbItem, UserFile } from "./types";

export const supabase = createPagesBrowserClient();

export const user = writable<User | null>(null);

// ██████╗  ██████╗  ██████╗
// ██╔══██╗██╔═══██╗██╔════╝
// ██║  ██║██║   ██║██║
// ██║  ██║██║   ██║██║
// ██████╔╝╚██████╔╝╚██████╗
// ╚═════╝  ╚═════╝  ╚═════╝

const initialContextUserDoc = (userId: string): ContextUserDoc => ({
  id: "",
  context: "soundtoggle",
  ownerId: userId,
  doc: initialDoc(),
  restricted: initialRestrictedDoc(),
});

const initialRestrictedDoc = (): RestrictedDoc => ({ subscription: null });

const initialDoc = (): Doc => ({
  playlists: [buildPlaylist()],
});

export const buildPlaylist = () => ({
  mainColor: "#004f6b",
  altColor: "#f4741f",
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
    fetch(`/api/revalidate?path=/embed/${userDocToSave.ownerId}`, {
      method: "POST",
    });
  }

  cleanUpBucket();
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

export const usedStorage = derived(bucketFiles, ($bucketFiles) => {
  return $bucketFiles.reduce((acc, file) => {
    return acc + file.metadata.size;
  }, 0);
});

export async function loadUserFiles(user: User) {
  const { data, error } = await supabase.storage.from(BUCKET).list(user.id, {
    limit: 200,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (!error) {
    const loadedBucketFiles = data as any as BucketFile[];
    bucketFiles.set(loadedBucketFiles);
    cleanUpBucket();
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
          name: file.name,
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
      url: data.publicUrl,
      name: bucketFile.name,
      size: bucketFile.metadata.size,
    };
  }
  throw new Error("User not logged in");
}

function findExistingFile(fileName: string) {
  return get(bucketFiles).find((file) => file.name === fileName);
}

function cleanUpBucket() {
  const $user = get(user);
  const $userDoc = get(userDoc);
  const $bucketFiles = get(bucketFiles);

  if ($user && $userDoc.id) {
    const usedFiles = $userDoc.doc.playlists.reduce((acc, playlist) => {
      return acc.concat(
        playlist.items.reduce((acc2, item) => {
          item.afterFile;
          item.beforeFile;
          if (item.afterFile) acc2.push(item.afterFile.name);
          if (item.beforeFile) acc2.push(item.beforeFile.name);
          return acc2;
        }, [] as string[])
      );
    }, [] as string[]);

    // Checks for non-used files and deletes them from the bucket
    $bucketFiles.forEach((file) => {
      if (!usedFiles.includes(file.name)) {
        supabase.storage.from(BUCKET).remove([`${$user.id}/${file.name}`]);
      }
    });
  }
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
