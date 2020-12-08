export type SongData = {
  title: string;
  artist: string;
  imageUrl?: string;
  spotifyId?: string;
};

export type SourceData = {
  url: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  songs: SongData[];
};
