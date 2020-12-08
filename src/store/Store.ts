import { observable } from "mobx";

import { runInAction } from "mobx";
import { Song } from "./Song";
import { Source } from "./Source";
import { getSourceFromURL } from "./sources";

type ImportStatus = {
  isLoading: boolean;
  error?: Error;
};

export class Store {
  private mutableSources = observable<Source>([]);
  private mutableImportStatus = observable.box<ImportStatus>({
    isLoading: false,
  });

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
