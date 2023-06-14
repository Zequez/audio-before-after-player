export type UserFile = {
  url: string;
  name: string;
  size: number;
};

export type AbItem = {
  title: string;
  beforeFile: null | UserFile;
  afterFile: null | UserFile;
  uid: string;
};

export type Playlist = {
  mainColor: string;
  altColor: string;
  items: AbItem[];
};

export type ContextUserDoc = {
  id: string;
  context: string;
  ownerId: string;
  doc: Doc;
  restricted: RestrictedDoc;
};

export type Doc = {
  playlists: Playlist[];
};

export type RestrictedDoc =
  | {
      subscription: {
        tier: "100mb" | "1000mb";
        paymentDueAt: Date;
        stripeId: string;
      };
    }
  | {
      subscription: null;
    };
