import fetch from "node-fetch";
import * as functions from "firebase-functions";

const CLIENT_ID = functions.config().spotify.client.id;
const CLIENT_SECRET = functions.config().spotify.client.secret;

type TokenData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  time: number;
};

let tokenData: TokenData | undefined;
let getAccessTokenPromise: Promise<string> | undefined;

async function getAccessToken(): Promise<string> {
  if (getAccessTokenPromise) {
    return getAccessTokenPromise;
  }
  async function func() {
    if (tokenData) {
      const timeExpired = Math.ceil((Date.now() - tokenData.time) / 1000);
      if (timeExpired < tokenData.expires_in) {
        return tokenData.access_token;
      }
      tokenData = undefined;
    }
    const time = Date.now();
    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          CLIENT_ID + ":" + CLIENT_SECRET
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body:
        encodeURIComponent("grant_type") +
        "=" +
        encodeURIComponent("client_credentials"),
    });
    const json = await response.json();
    json.time = time;
    tokenData = json;
    return tokenData?.access_token!;
  }
  const promise = func();
  getAccessTokenPromise = promise;
  await promise;
  getAccessTokenPromise = undefined;
  return promise;
}

export async function getSpotifyTrackUri(
  title: string,
  artist: string
): Promise<string> {
  const accessToken = await getAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artist + " " + title
    )}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await response.json();
  if (!json.tracks?.items?.length) {
    throw new Error("Not found");
  }
  return json.tracks.items[0].uri;
}
