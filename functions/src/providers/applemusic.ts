import * as jwt from "jsonwebtoken";
import * as functions from "firebase-functions";
import fetch from "node-fetch";

const PRIVATE_KEY = functions.config().applemusic.private_key;
const TEAM_ID = functions.config().applemusic.team_id;
const KEY_ID = functions.config().applemusic.key_id;

const STORE_FRONT = "nl";

export function getAppleMusicDeveloperToken() {
  const token = jwt.sign({}, PRIVATE_KEY, {
    algorithm: "ES256",
    expiresIn: "60m",
    issuer: TEAM_ID, // your 10 character apple team id, found in https://developer.apple.com/account/#/membership/
    header: {
      alg: "ES256",
      kid: KEY_ID, // your 10 character generated music key id. more info https://help.apple.com/developer-account/#/dev646934554
    },
  });
  return token;
}

export async function getAppleMusicSongData(
  developerToken: string,
  title: string,
  artist: string
): Promise<{
  id: string;
  imageUrl?: string;
}> {
  const response = await fetch(
    `https://api.music.apple.com/v1/catalog/${STORE_FRONT}/search?term=${encodeURIComponent(
      artist + " " + title
    )}&limit=1&types=songs`,
    {
      headers: {
        Authorization: `Bearer ${developerToken}`,
      },
    }
  );
  const json: any = await response.json();
  const data = json.results?.songs?.data?.[0];
  if (!data) {
    throw new Error("Not found");
  }

  // console.log("SEARCH: ", data);

  return {
    id: data.id,
    // TODO: imageUrl?
  };
}
