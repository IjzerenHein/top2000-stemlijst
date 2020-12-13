import * as functions from "firebase-functions";

import cors from "./cors";
import { Source, getSourceFromURL } from "./sources";
import { ArgumentError } from "./errors";
import type { ProviderId } from "./providers";

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
    const provider: ProviderId =
      (request.query.provider as ProviderId) || "spotify";
    functions.logger.info("importUrl", { url, provider });

    let source: Source | undefined;
    let error: Error | undefined;
    try {
      source = getSourceFromURL(url as string, provider);
      if (!source) {
        throw new ArgumentError("Link word niet herkend");
      }
      await source.fetch();
      await source.resolveSongIds(provider);
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
