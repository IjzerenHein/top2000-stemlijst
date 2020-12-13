import { useRoute } from "@react-navigation/native";

export interface MusicProvider {
  readonly id: string;
  readonly name: string;
  readonly image: any;
}

const spotifyProvider: MusicProvider = {
  id: "spotify",
  name: "Spotify",
  image: require("../assets/spotify-green.png"),
};

const appleMusicProvider: MusicProvider = {
  id: "applemusic",
  name: "Apple Music",
  image: require("../assets/apple-music.png"),
};

export const providers: { [name: string]: MusicProvider } = {
  spotify: spotifyProvider,
  applemusic: appleMusicProvider,
};

export function useMusicProvider() {
  const route = useRoute();
  return providers[route.name] || providers.spotify;
}
