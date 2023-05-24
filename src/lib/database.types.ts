export type Playlist = {
  id?: string;
  slug: string;
  mainColor: string;
  altColor: string;
  admin: string;
};

export const BLANK_PLAYLIST = {
  slug: "",
  mainColor: "",
  altColor: "",
  admin: "",
};
