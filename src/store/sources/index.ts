import { Source } from "../Source";

interface SupportedSource {
  getSourceFromURL(url: string): Source | undefined;
}

const supportedSources: SupportedSource[] = [require("./nl.radio2.top2000")];

export function getSourceFromURL(url: string): Source | undefined {
  let source: Source | undefined;
  for (let i = 0; i < supportedSources.length; i++) {
    source = supportedSources[i].getSourceFromURL(url);
    if (source) break;
  }
  return source;
}
