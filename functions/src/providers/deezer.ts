import fetch from "node-fetch";
import * as functions from "firebase-functions";

const DEEZER_APP_ID = functions.config().deezer.app.id;
const DEEZER_APP_SECRET = functions.config().deezer.app.secret;

export async function getDeezerAccessToken(code: string): Promise<{
  access_token: string;
  expires: number;
}> {
  const response = await fetch(
    `https://connect.deezer.com/oauth/access_token.php?app_id=${DEEZER_APP_ID}&secret=${DEEZER_APP_SECRET}&code=${code}&output=json`
  );
  if (!response.ok) {
    throw new Error("Invalid code");
  }
  const json: any = await response.json();
  return json;
}

export async function getDeezerSongData(
  title: string,
  artist: string
): Promise<{
  id: string;
  imageUrl?: string;
}> {
  const response = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(
      artist + " " + title
    )}`
  );
  const json: any = await response.json();
  if (!json.data?.length) {
    throw new Error("Not found");
  }
  return {
    id: json.data[0].id + "",
  };
}

async function deezerAPIFetch<T = any>(
  accessToken: string,
  path: string,
  queryParams: object,
  method?: "GET" | "PUT" | "POST"
): Promise<T> {
  const url = `https://api.deezer.com${path}?access_token=${accessToken}&request_method=${method?.toLowerCase()}&output_method=json&${Object.entries(
    queryParams
  )
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const json: any = await response.json();
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json;
}

export async function createDeezerPlaylist(
  accessToken: string,
  title: string,
  _isPublic: boolean,
  songIds: string
): Promise<{ id: string; url: string }> {
  // Create playlist
  const playlist = await deezerAPIFetch(
    accessToken,
    `/user/me/playlists`,
    { title },
    "POST"
  );
  // TODO: isPublic

  // Add tracks to playlist
  await deezerAPIFetch(
    accessToken,
    `/playlist/${playlist.id}/tracks`,
    { songs: songIds },
    "POST"
  );

  return {
    id: playlist.id,
    url: `https://www.deezer.com/playlist/${playlist.id}`,
  };
}
