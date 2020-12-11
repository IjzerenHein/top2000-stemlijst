import * as config from "./config";

const BASE_URL = "https://api.spotify.com/v1";

export type SpotifyUserProfile = {
  id: string;
  display_name: string;
};

// See full object at https://developer.spotify.com/documentation/web-api/reference/playlists/create-playlist/
export type SpotifyPlaylist = {
  id: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
};

export function authorizeSpotify(importId: string, isPublicPlaylist: boolean) {
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:19006/authorize-spotify-createplaylist"
      : "https://top2000stemlijst.nl/authorize-spotify-createplaylist";
  const url = `https://accounts.spotify.com/authorize?client_id=${
    config.SPOTIFY_CLIENT_ID
  }&response_type=token&redirect_uri=${redirectUri}&state=${importId}&scope=${
    isPublicPlaylist ? "playlist-modify-private" : "playlist-modify-public"
  }`;
  window.location.href = url;
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
