import { observable } from "mobx";

import { runInAction } from "mobx";
import { Song } from "./Song";
import { Source } from "./Source";
import { getSourceFromURL } from "./sources";

export class Store {
  private mutableSources = observable<Source>([]);

  addSourceFromURL(url: string) {
    const source = getSourceFromURL(url);
    if (source) {
      runInAction(() => this.mutableSources.push(source));
    }
    return source;
  }

  get sources(): Source[] {
    return this.mutableSources.toJS();
  }

  get songs(): Song[] {
    return this.mutableSources.flatMap((source) => source.songs);
  }
}
