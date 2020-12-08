export type SongData = {
  title: string;
  artist: string;
  imageUrl?: string;
  spotifyUri?: string;
};

export type SourceData = {
  url: string;
  name: string;
  title: string;
  description: string;
  imageUrl?: string;
  songs: SongData[];
};
