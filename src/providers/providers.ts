import { useRoute } from "@react-navigation/native";
import { Colors } from "../theme";

export type ProviderId = "spotify" | "applemusic";

export type MusicProvider = {
  id: ProviderId;
  name: string;
  image: any;
  color: string;
};

export const providers: MusicProvider[] = [
  {
    id: "spotify",
    name: "Spotify",
    image: require("../../assets/spotify-green.png"),
    color: Colors.spotifyGreen,
  },
  {
    id: "applemusic",
    name: "Apple Music",
    image: require("../../assets/apple-music.png"),
    color: Colors.appleMusicRed,
  },
];

export function getProvider(providerId: string) {
  return (
    providers.find((provider) => provider.id === providerId) || providers[0]
  );
}

export function useMusicProvider() {
  // @ts-ignore
  return getProvider(useRoute().params?.provider);
}
