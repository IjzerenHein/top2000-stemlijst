import * as functions from "firebase-functions";

import cors from "./cors";
import { ArgumentError } from "./errors";
import { getDeezerAccessToken, createDeezerPlaylist } from "./providers/deezer";

export const createPlaylist = functions.https.onRequest(
  async (request, response) => {
    cors(request, response);

    const { provider } = request.query;

    switch (provider) {
      case "deezer":
        {
          const { code, title, songs, public: isPublic } = request.query;
          const { access_token } = await getDeezerAccessToken(code as string);
          const data = await createDeezerPlaylist(
            access_token,
            title as string,
            isPublic === "true",
            songs as string
          );
          response.send({
            provider,
            id: data.id,
            url: data.url,
          });
        }
        break;
      default:
        throw new ArgumentError("Invalid provider");
    }
  }
);
