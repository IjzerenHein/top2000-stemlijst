import { useRoute } from "@react-navigation/native";

export type ProviderId = "spotify" | "applemusic";

export type MusicProvider = {
  id: ProviderId;
  name: string;
  image: any;
};

export const providers: MusicProvider[] = [
  {
    id: "spotify",
    name: "Spotify",
    image: require("../../assets/spotify-green.png"),
  },
  {
    id: "applemusic",
    name: "Apple Music",
    image: require("../../assets/apple-music.png"),
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
