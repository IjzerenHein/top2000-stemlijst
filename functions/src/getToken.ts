import * as functions from "firebase-functions";

import cors from "./cors";
import { ArgumentError } from "./errors";
import { getAppleMusicDeveloperToken } from "./providers/applemusic";

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
    default:
      throw new ArgumentError("Invalid provider");
  }
});
