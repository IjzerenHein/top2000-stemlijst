import { Store } from "./Store";
import { Source } from "./Source";
import { Song } from "./Song";

export type { Store, Source, Song };

export const store = new Store();

store.addSourceFromURL(
  "https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53"
);
