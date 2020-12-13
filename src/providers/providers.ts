import { useRoute } from "@react-navigation/native";

export type ProviderId = "spotify" | "applemusic";

export interface MusicProvider {
  readonly id: ProviderId;
  readonly name: string;
  readonly image: any;
}

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
  return providers.find((provider) => provider.id === providerId);
}

export function useMusicProvider() {
  const route = useRoute();
  return getProvider(route.name) || providers[0];
}
