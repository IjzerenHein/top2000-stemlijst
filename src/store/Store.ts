import { observable, computed, decorate } from "mobx";

import { runInAction } from "mobx";
import { Song } from "./Song";
import { Source } from "./Source";
import type { SourceData } from "./types";
import { firestore } from "../firebase";
import { authorizeSpotify } from "../spotify";

const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/spotify-import-957dd/us-central1"
    : "https://us-central1-spotify-import-957dd.cloudfunctions.net";

type Status = {
  isLoading: boolean;
  error?: Error;
};

export class Store {
  private mutableSources = observable<Source>([]);
  private mutableAddSourceStatus = observable.box<Status>({
    isLoading: false,
  });
  private mutableImportStatus = observable.box<Status>({
    isLoading: false,
  });

  async addSource(url: string) {
    runInAction(() => {
      this.mutableAddSourceStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      const response = await fetch(
        `${ORIGIN}/importUrl?url=${encodeURIComponent(url)}`
      );
      const json: any = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      const sourceData: SourceData = json;
      const source = new Source(sourceData);
      runInAction(() => {
        this.mutableSources.push(source);
        this.mutableAddSourceStatus.set({
          isLoading: false,
        });
      });
      return source;
    } catch (error) {
      runInAction(() => {
        this.mutableAddSourceStatus.set({
          isLoading: false,
          error,
        });
      });
    }
  }

  get addSourceStatus(): Status {
    return this.mutableAddSourceStatus.get();
  }

  get sources(): Source[] {
    return this.mutableSources.toJS();
  }

  get songs(): Song[] {
    return this.mutableSources.flatMap((source) =>
      source.songs.filter((song) => song.isSelected)
    );
  }

  toJSON() {
    return {
      sources: this.mutableSources.map((source) => source.toJSON()),
      songs: this.songs.map((song) => song.toJSON()),
    };
  }

  /**
   * 1. Authenticate app with Spotify
   * 2.
   */
  async import() {
    runInAction(() => {
      this.mutableImportStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      const data = this.toJSON();
      const { id } = await firestore.collection("imports").add(data);
      authorizeSpotify(id, true);
    } catch (error) {
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          error,
        });
      });
    }
  }

  get importStatus(): Status {
    return this.mutableImportStatus.get();
  }
}

decorate(Store, { songs: computed });
