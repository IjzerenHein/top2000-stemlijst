const CLIENT_ID = "66fb733b0b4d409ba0b2f091b781ed6d";
const BASE_URL = "https://api.spotify.com/v1";

export type SpotifyUserProfile = {
  id: string;
  display_name: string;
};

// See full object at https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
export type SpotifyPlaylist = {
  id: string;
  external_urls: {
    spotify: string;
  };
};

export function authorizeSpotify(importId: string, isPublicPlaylist: boolean) {
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:19006/authorize"
      : "https://www.spotify-import/authorize";
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&state=${importId}&scope=${
    isPublicPlaylist ? "playlist-modify-private" : "playlist-modify-public"
  }`;
  window.open(url);
}

export async function spotifyFetch<T>(
  accessToken: string,
  path: string,
  body?: any,
  method?: "GET" | "PUT" | "POST"
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: method ?? "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function getSpotifyUserProfile(
  accessToken: string
): Promise<SpotifyUserProfile> {
  return spotifyFetch(accessToken, "/me");
}

export async function createSpotifyPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  isPublic: boolean,
  description?: string
): Promise<SpotifyPlaylist> {
  return spotifyFetch(
    accessToken,
    `/users/${userId}/playlists`,
    {
      name,
      public: isPublic,
      ...(description ? { description } : {}),
    },
    "POST"
  );
}

export async function addSpotifyPlaylistTracks(
  accessToken: string,
  playlistId: string,
  spotifyTrackUris: string[]
): Promise<SpotifyPlaylist> {
  return spotifyFetch(
    accessToken,
    `/playlists/${playlistId}/tracks`,
    {
      uris: spotifyTrackUris,
    },
    "POST"
  );
}
