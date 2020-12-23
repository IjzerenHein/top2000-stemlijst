import * as functions from "firebase-functions";

import cors from "./cors";
import { ArgumentError } from "./errors";
import { getAppleMusicDeveloperToken } from "./providers/applemusic";
import { getDeezerAccessToken } from "./providers/deezer";

export const getToken = functions.https.onRequest(async (request, response) => {
  cors(request, response);

  const { provider } = request.query;

  switch (provider) {
    case "applemusic":
      {
        const token = getAppleMusicDeveloperToken();
        response.send({
          provider: "applemusic",
          token,
          // TODO expires in?
        });
      }
      break;
    case "deezer":
      {
        const { code } = request.query;
        const { access_token } = await getDeezerAccessToken(code as string);
        response.send({
          provider: "deezer",
          token: access_token,
          // TODO expires in?
        });
      }
      break;
    default:
      throw new ArgumentError("Invalid provider");
  }
});
