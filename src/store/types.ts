export type SongData = {
  title: string;
  artist: string;
  imageUrl?: string;
  isSelected?: boolean;
  id?: string;
};

export type SourceData = {
  url: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  songs: SongData[];
};

export type DocumentData = {
  sources: SourceData[];
  songs: SongData[];
};
