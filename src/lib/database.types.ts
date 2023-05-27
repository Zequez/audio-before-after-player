export type Playlist = {
  id?: string;
  slug: string;
  mainColor: string;
  altColor: string;
  ownerId: string;
};

export type AbItem = {
  id?: string;
  a?: UserFile;
  b?: UserFile;
  title: string;
  playlistId: string;
  playlistOrder: number;
};

export type UserFile = {
  bucketStorageUrl: string;
  size: number;
  length: number;
  user?: string;
};
