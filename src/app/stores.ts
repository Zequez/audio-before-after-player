import { createClient, User } from "@supabase/supabase-js";
import { writable, readable, derived, get } from "svelte/store";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

import { AbItem, Playlist } from "@/lib/database.types";
import { debounce } from "lodash";

export const supabase = createBrowserSupabaseClient();

export const user = writable<User | null>(null);

// ██████╗ ██╗      █████╗ ██╗   ██╗██╗     ██╗███████╗████████╗
// ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝██║     ██║██╔════╝╚══██╔══╝
// ██████╔╝██║     ███████║ ╚████╔╝ ██║     ██║███████╗   ██║
// ██╔═══╝ ██║     ██╔══██║  ╚██╔╝  ██║     ██║╚════██║   ██║
// ██║     ███████╗██║  ██║   ██║   ███████╗██║███████║   ██║
// ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚══════╝   ╚═╝

export const BLANK_PLAYLIST: Playlist = {
  slug: "",
  mainColor: "",
  altColor: "",
  ownerId: "",
};

export const playlist = writable<Playlist>(BLANK_PLAYLIST);

export const loadUserPlaylist = async (user: User) => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("ownerId", user.id);
  const playlists = data as Playlist[];

  if (!error) {
    console.log("PLAYLISTS LOADED", playlists);
    let currentPlaylist = playlists[0];
    if (!currentPlaylist) {
      // We create a new playlist
      const newPlaylist: Playlist = {
        slug: "my-new-playlist",
        mainColor: "#ff0000",
        altColor: "#00ff00",
        ownerId: user.id,
      };
      const { data: createdPlaylist, error } = await supabase
        .from("playlists")
        .insert(newPlaylist)
        .single();
      if (error) {
        console.error("Error creating playlist", error);
      } else {
        currentPlaylist = createdPlaylist;
        playlist.update(() => createdPlaylist);
      }
    }

    if (currentPlaylist) {
      playlist.update(() => currentPlaylist);
      loadAbItems(currentPlaylist.id as string);
    }
  } else {
    console.error("Error fetching user playlists", error);
  }
};

export const updatePlaylist = (newPlaylist: Playlist) => {
  playlist.update(() => newPlaylist);
  debouncedSubmitPlaylist(newPlaylist);
};

const submitPlaylist = async (playlistToSubmit: Playlist) => {
  const { data, error } = await supabase
    .from("playlists")
    .update(playlistToSubmit)
    .eq("id", playlistToSubmit.id);
  if (error) {
    console.error("Error updating playlist", error);
  } else {
    console.log("Playlist updated", data);
  }
};

export const debouncedSubmitPlaylist = debounce(submitPlaylist, 1000);

//  █████╗ ██████╗     ██╗████████╗███████╗███╗   ███╗███████╗
// ██╔══██╗██╔══██╗    ██║╚══██╔══╝██╔════╝████╗ ████║██╔════╝
// ███████║██████╔╝    ██║   ██║   █████╗  ██╔████╔██║███████╗
// ██╔══██║██╔══██╗    ██║   ██║   ██╔══╝  ██║╚██╔╝██║╚════██║
// ██║  ██║██████╔╝    ██║   ██║   ███████╗██║ ╚═╝ ██║███████║
// ╚═╝  ╚═╝╚═════╝     ╚═╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝

type WrappedAbItem = {
  abItem: AbItem;
  dirty: boolean;
  deleted: boolean;
  localId: string;
};

export const BLANK_AB_ITEM: AbItem = {
  a: undefined,
  b: undefined,
  title: "",
  playlistId: "",
  playlistOrder: 0,
};

const wrapAbItem = (abItem: AbItem): WrappedAbItem => {
  return {
    abItem,
    dirty: false,
    deleted: false,
    localId: abItem.id || generateRandomString(),
  };
};

export const abItems = writable<WrappedAbItem[] | null>(null);

async function loadAbItems(playlistId: string) {
  const { data, error } = await supabase
    .from("ab_items")
    .select("*")
    .eq("playlistId", playlistId);
  const items = data as AbItem[];
  if (error) {
    console.error("Error fetching AB items", error);
  } else {
    console.log("ITEMS LOADED", items);
    abItems.set(items.map(wrapAbItem));
  }
}

// const playlistId = derived(playlist, ($playlist) => $playlist.id);
// export const abItems = derived<typeof playlistId, AbItem[]>(
//   playlistId,
//   ($playlistId, set) => {
//     console.log("PLAYLIST ID CHANGED", $playlistId);
//     if ($playlistId) {
//       (async () => {
//         const { data, error } = await supabase
//           .from("ab_items")
//           .select("*")
//           .eq("playlistId", $playlistId);
//         const items = data as AbItem[];
//         if (error) {
//           console.error("Error fetching AB items", error);
//         } else {
//           console.log("ITEMS LOADED", items);
//           set(items);
//         }
//       })();
//     }
//   },
//   []
// );
// const $abItems = writable(abItems);

export const addAbItem = async () => {
  const $playlist = get(playlist);

  if ($playlist && $playlist.id) {
    const itemToInsert: AbItem = { ...BLANK_AB_ITEM, playlistId: $playlist.id };
    const wrappedItem = wrapAbItem(itemToInsert);
    abItems.update((items) => [...(items || []), wrappedItem]);

    const { data: inserted, error } = await supabase
      .from("ab_items")
      .insert(itemToInsert)
      .select();
    if (!error) {
      const insertedItem = inserted[0] as AbItem;
      console.log("AB ITEM INSERTED", insertedItem);
      abItems.update((items) => {
        // Update local AB Item ID with newly inserted database ID
        return (items || []).map((item) => {
          if (item.localId === wrappedItem.localId) {
            return { ...item, abItem: { ...item.abItem, id: insertedItem.id } };
          } else {
            return item;
          }
        });
      });
    } else {
      console.error("Error inserting AB item", error);
    }
  }
};

// Load ABItems
// playlist.subscribe(async (playlist) => {
//   if (playlist && playlist.id) {
//     const { data, error } = await supabase
//       .from("ab_items")
//       .select("*")
//       .eq("playlist", playlist.id);
//     const items = data as AbItem[];

//     if (error) {
//       console.error("Error fetching AB items", error);
//     } else {
//       const updatableItems = items.map((item) => ({
//         ...item,
//         dirty: false,
//         deleted: false,
//       }));
//       abItems.update(() => updatableItems);
//     }
//   }
// });

// abItems.subscribe((newItems) => {
//   console.log("AB ITEMS STORE CHANGED", newItems);
// });

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