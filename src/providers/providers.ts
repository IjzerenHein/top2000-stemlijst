import { useRoute } from "@react-navigation/native";

export interface MusicProvider {
  readonly id: string;
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

export function useMusicProvider() {
  const route = useRoute();
  return (
    providers.find((provider) => provider.id === route.name) || providers[0]
  );
}
