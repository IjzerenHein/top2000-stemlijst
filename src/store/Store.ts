import { observable } from "mobx";

import { runInAction } from "mobx";
import { Song } from "./Song";
import { Source } from "./Source";
import type { SourceData } from "./types";

type ImportStatus = {
  isLoading: boolean;
  error?: Error;
};

export class Store {
  private mutableSources = observable<Source>([]);
  private mutableImportStatus = observable.box<ImportStatus>({
    isLoading: false,
  });

  async addSourceFromURL(url: string) {
    const response = await fetch(
      `https://us-central1-spotify-import-957dd.cloudfunctions.net/importUrl?url=${encodeURIComponent(
        url
      )}`
    );
    const json: any = await response.json();
    if (json.error) {
      throw new Error(json.error);
    }
    const sourceData: SourceData = json;
    const source = new Source(sourceData);
    runInAction(() => this.mutableSources.push(source));
    return source;
  }

  get sources(): Source[] {
    return this.mutableSources.toJS();
  }

  get songs(): Song[] {
    return this.mutableSources.flatMap((source) => source.songs);
  }

  import() {
    runInAction(() => {
      this.mutableImportStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
  }

  get importStatus(): ImportStatus {
    return this.mutableImportStatus.get();
  }
}
