import * as functions from "firebase-functions";

import cors from "./cors";
import { Source, getSourceFromURL } from "./sources";
import { ArgumentError } from "./errors";

/**
 * 1. Find source
 * 2. Fetch source data
 * 3. Resolve Spotify songs
 * 4. Return result
 */
export const importUrl = functions.https.onRequest(
  async (request, response) => {
    cors(request, response);

    const url = request.query?.url;
    functions.logger.info("importUrl", { url });

    let source: Source | undefined;
    let error: Error | undefined;
    try {
      source = getSourceFromURL(url as string);
      if (!source) {
        throw new ArgumentError("Link word niet herkend");
      }
      await source.fetch();
      await source.resolveSpotifySongs();
    } catch (err) {
      error = err;
    }

    response.send({
      url,
      ...(source
        ? {
            name: source.data.name,
            title: source.data.title,
            description: source.data.description,
            imageUrl: source.data.imageUrl,
            songs: source.data.songs,
          }
        : {}),
      ...(error ? { error: error.message } : {}),
    });

    // functions.logger.info("Hello logs!", {structuredData: true});
  }
);