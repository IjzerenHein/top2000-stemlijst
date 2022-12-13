import { useRoute, RouteProp } from "@react-navigation/native";
import { Colors } from "../theme";
import { StackParamList } from "../routing/types";

export type ProviderId = "spotify" | "applemusic" | "deezer";

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
  {
    id: "deezer",
    name: "Deezer",
    image: require("../../assets/deezer.png"),
    color: Colors.deezerBlack,
  },
];

export function getProvider(providerId: string) {
  return (
    providers.find((provider) => provider.id === providerId) || providers[0]
  );
}

export function useMusicProvider() {
  const route = useRoute<RouteProp<StackParamList, "Import">>();
  return getProvider(route.params?.provider);
}
