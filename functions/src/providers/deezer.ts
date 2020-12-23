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
  return await response.json();
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
