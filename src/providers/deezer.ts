import * as config from "../config";

/* const BASE_URL = "https://api.spotify.com/v1";

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
};*/

export async function getDeezerAccessToken(code: string): Promise<string> {
  const response = await fetch(
    `${config.FUNCTIONS_URL}/token?provider=deezer&code=${code}`
  );
  const json: any = await response.json();
  if (json.error) {
    throw new Error(json.error);
  }
  return json.token;
}

export function authorizeDeezer(importId: string) {
  localStorage.setItem("nl.top2000stemlijst.deezer.importId", importId);
  const redirectUri = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:19006/deezer/authorize-createplaylist"
      : "https://top2000stemlijst.nl/deezer/authorize-createplaylist"
  }`;
  const url = `https://connect.deezer.com/oauth/auth.php?app_id=${
    config.DEEZER_APP_ID
  }&redirect_uri=${encodeURIComponent(redirectUri)}&perms=manage_library`;
  window.location.href = url;
}
