import type { Song } from "../types";
import type { ProviderId } from "../providers";
import { getSpotifySongData } from "../providers/spotify";
import {
  getAppleMusicDeveloperToken,
  getAppleMusicSongData,
} from "../providers/applemusic";
import { getDeezerSongData } from "../providers/deezer";

// eslint-disable-next-line no-unused-vars
export type PartialSourceData<T = any> = {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  songs?: Song[];
};

export type SourceData<T = any> = {
  // eslint-disable-next-line no-unused-vars
  fetch: (sourceData: SourceData<T>) => Promise<PartialSourceData<T>>;
  url: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  customFields: T;
  songs: Song[];
};

type SourceProviderCache = {
  token?: string;
};

export class Source<T = any> {
  private _data: SourceData<T>;

  constructor(data: SourceData<T>) {
    this._data = data;
  }

  get data(): SourceData {
    return this._data;
  }

  async fetchSourceData() {
    const newData = await this.data.fetch(this._data);
    this._data = {
      ...this._data,
      ...newData,
    };
  }

  private static async resolveSongData(
    provider: ProviderId,
    title: string,
    artist: string,
    cache: SourceProviderCache
  ): Promise<{
    id: string;
    imageUrl?: string;
  }> {
    switch (provider) {
      case "spotify":
        return getSpotifySongData(title, artist);
      case "applemusic":
        cache.token = cache.token || getAppleMusicDeveloperToken();
        return getAppleMusicSongData(cache.token, title, artist);
      case "deezer":
        return getDeezerSongData(title, artist);
      default:
        throw new Error(`Provider not supported: ${provider}`);
    }
  }

  async fetchProviderData(provider: ProviderId): Promise<string | undefined> {
    const cache: SourceProviderCache = {};
    const songs = await Promise.all(
      this._data.songs.map(async (song) => {
        if (song.id) {
          // console.log("EXISTING SONG ID: ", provider, song.id, song.title);
          return song;
        }
        try {
          try {
            const result = await Source.resolveSongData(
              provider,
              song.title,
              song.artist,
              cache
            );
            // console.log("FOUND SONG ID: ", provider, result, song.title);
            return {
              ...song,
              ...result,
            };
          } catch (err) {
            const safeTitle = song.title.replace(/\([^)]*\)/g, "");
            if (safeTitle === song.title) throw err;
            const result = await Source.resolveSongData(
              provider,
              safeTitle,
              song.artist,
              cache
            );
            //console.log("FOUND SONG ID #2: ", provider, result, song.title);
            return {
              ...song,
              ...result,
            };
          }
        } catch (err) {
          console.log(
            "NOT FOUND SONG ID: ",
            provider,
            song.title,
            song.artist,
            err
          );
          return song;
        }
      })
    );
    this._data = {
      ...this._data,
      songs,
    };
    return cache.token;
  }
}
