import type { ProviderId } from "../providers";
import { Source } from "./Source";

interface SupportedSource {
  getSourceFromURL(url: string, provider: ProviderId): Source | undefined;
}

const supportedSources: SupportedSource[] = [require("./nl.radio2.top2000")];

export { Source };

export function getSourceFromURL(
  url: string,
  provider: ProviderId
): Source | undefined {
  let source: Source | undefined;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < supportedSources.length; i++) {
    source = supportedSources[i].getSourceFromURL(url, provider);
    if (source) break;
  }
  return source;
}
