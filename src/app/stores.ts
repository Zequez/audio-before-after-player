import { createClient, User } from "@supabase/supabase-js";
import { writable, readable, derived, get } from "svelte/store";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { arrayMove } from "@dnd-kit/sortable";

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
        slug: generateRandomString(),
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

export type WrappedAbItem = {
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
    localId: (abItem.id && abItem.id.toString()) || generateRandomString(),
  };
};

export const abItems = writable<WrappedAbItem[] | null>(null);

async function loadAbItems(playlistId: string) {
  const { data, error } = await supabase
    .from("ab_items")
    .select("*")
    .order("playlistOrder", { ascending: true })
    .eq("playlistId", playlistId);
  const items = data as AbItem[];
  if (error) {
    console.error("Error fetching AB items", error);
  } else {
    console.log("ITEMS LOADED", items);
    abItems.set(items.map(wrapAbItem));
  }
}

export const addAbItem = async () => {
  const $playlist = get(playlist);

  if ($playlist && $playlist.id) {
    const nextPlaylistOrder = (get(abItems) || []).length;
    const itemToInsert: AbItem = {
      ...BLANK_AB_ITEM,
      playlistId: $playlist.id,
      playlistOrder: nextPlaylistOrder,
    };
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

const _abItems = {
  getByLocalId: (localId: string) => {
    return (get(abItems) || []).find((item) => item.localId === localId);
  },
  getIndexByLocalId: (localId: string) => {
    return (get(abItems) || []).findIndex((item) => item.localId === localId);
  },
  updateItem: (
    localId: string,
    updater: (item: WrappedAbItem) => WrappedAbItem
  ): WrappedAbItem | undefined => {
    const toUpdate = _abItems.getByLocalId(localId);
    if (toUpdate) {
      const newItem = updater(toUpdate);
      if (newItem) {
        abItems.update((items) =>
          (items || []).map((i) => (i.localId === localId ? newItem : i))
        );
        return newItem;
      }
    }
  },
};

export const deleteAbItem = async (localId: string) => {
  const toDelete = _abItems.updateItem(localId, (item) => ({
    ...item,
    deleted: true,
  }));

  if (toDelete && toDelete.abItem.id) {
    const { error } = await supabase
      .from("ab_items")
      .delete()
      .eq("id", toDelete.abItem.id);
    if (error) {
      console.error("Error deleting AB item", error);
    }
  }
};

export const updateAbItemTitle = async (localId: string, title: string) => {
  const updated = _abItems.updateItem(localId, (item) => ({
    ...item,
    abItem: { ...item.abItem, title },
  }));
  if (updated) {
    submitAbItem(updated);
  }
};

export const moveAbItemTo = async (
  activeLocalId: string,
  overLocalId: string
) => {
  console.log("MOIVE!");
  const currentItems = get(abItems);
  if (currentItems && activeLocalId !== overLocalId) {
    console.log(
      "Switching active item",
      get(abItems),
      activeLocalId,
      overLocalId
    );
    const activeIndex = _abItems.getIndexByLocalId(activeLocalId);
    const overIndex = _abItems.getIndexByLocalId(overLocalId);
    const newItems = arrayMove(currentItems, activeIndex, overIndex);
    abItems.update(() => newItems);
    updateAbItemsOrder();
  }
};

const updateAbItemsOrder = () => {
  abItems.update((items) => {
    console.log("Updating AB ITEMS ORDER!");
    if (items) {
      const toSubmit: WrappedAbItem[] = [];
      const newItems = items.map((item, i) => {
        if (item.abItem.playlistOrder !== i) {
          const updatedItem = {
            ...item,
            abItem: { ...item.abItem, playlistOrder: i },
          };
          if (item.abItem.id) toSubmit.push(updatedItem);
          return updatedItem;
        } else {
          return item;
        }
      });
      console.log("TO SUBMIT", toSubmit);
      const updatePairs = toSubmit.map((item) => [
        item.abItem.id,
        item.abItem.playlistOrder,
      ]);
      (async () => {
        const promises = updatePairs.map(([id, order]) => {
          return supabase
            .from("ab_items")
            .update({ playlistOrder: order })
            .eq("id", id)
            .single();
        });
        const updateResults = await Promise.all(promises);
        console.log(updateResults);
      })();
      return newItems;
    } else {
      return items;
    }
  });
};

const submitAbItem = debounce(async (toSubmit: WrappedAbItem) => {
  if (toSubmit && toSubmit.abItem.id) {
    const { error } = await supabase
      .from("ab_items")
      .update(toSubmit.abItem)
      .eq("id", toSubmit.abItem.id);
    if (error) {
      console.error("Error updating AB item", error);
    }
  }
}, 1000);

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
