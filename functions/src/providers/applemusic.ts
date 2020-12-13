import * as jwt from "jsonwebtoken";

import * as functions from "firebase-functions";

const PRIVATE_KEY = functions.config().applemusic.private_key;
const TEAM_ID = functions.config().applemusic.team_id;
const KEY_ID = functions.config().applemusic.key_id;

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
