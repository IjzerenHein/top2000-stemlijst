import fetch from "node-fetch";
import * as functions from "firebase-functions";

const DEEZER_APP_ID = functions.config().deezer.app.id;
const DEEZER_APP_SECRET = functions.config().deezer.app.secret;

export async function getDeezerAccessToken(
  code: string
): Promise<{
  access_token: string;
  expires: number;
}> {
  const response = await fetch(
    `https://connect.deezer.com/oauth/access_token.php?app_id=${DEEZER_APP_ID}&secret=${DEEZER_APP_SECRET}&code=${code}&output=json`
  );
  if (!response.ok) {
    throw new Error("Invalid code");
  }
  const json = await response.json();
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
  const json = await response.json();
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
  body?: any,
  method?: "GET" | "PUT" | "POST"
): Promise<T> {
  console.log("ACCESSTOKEN: ", accessToken);
  const response = await fetch(`https://api.deezer.com${path}`, {
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
  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json;
}

export async function createDeezerPlaylist(
  accessToken: string,
  title: string,
  songIds: string
): Promise<{ id: string }> {
  // Get user id
  // const user = await deezerAPIFetch(accessToken, "/user/me?output=json");
  // console.log("USER", user);
  // const user = {id: 'me'}

  // Create playlist
  const playlist = await deezerAPIFetch(
    accessToken,
    `/user/me/playlists?output=json`,
    { title },
    "POST"
  );
  console.log("PLAYLIST", playlist);

  // Add tracks to playlist
  const result = await deezerAPIFetch(
    accessToken,
    `/playlist/${playlist.id}/tracks?output=json`,
    { songs: songIds },
    "POST"
  );
  console.log("RESULT", result);

  return { id: playlist.id };
}
