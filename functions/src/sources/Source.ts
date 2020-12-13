import type { Song } from "../types";
import { getSpotifySongData } from "../providers/spotify";
import {
  getAppleMusicDeveloperToken,
  getAppleMusicSongData,
} from "../providers/applemusic";
import type { ProviderId } from "../providers";

export type PartialSourceData<T = any> = {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  songs?: Song[];
};

export type SourceData<T = any> = {
  fetch: (sourceData: SourceData<T>) => Promise<PartialSourceData<T>>;
  url: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  customFields: T;
  songs: Song[];
};

export class Source<T = any> {
  private _data: SourceData<T>;

  constructor(data: SourceData<T>) {
    this._data = data;
  }

  get data(): SourceData {
    return this._data;
  }

  async fetch() {
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
    cache: any
  ): Promise<{
    id: string;
    imageUrl?: string;
  }> {
    switch (provider) {
      case "spotify":
        return getSpotifySongData(title, artist);
      case "applemusic":
        cache.appleMusicDeveloperToken =
          cache.appleMusicDeveloperToken || getAppleMusicDeveloperToken();
        return getAppleMusicSongData(
          cache.appleMusicDeveloperToken!,
          title,
          artist
        );
        break;
      default:
        throw new Error("Provider not supported");
    }
  }

  async resolveSongIds(provider: ProviderId) {
    const cache: any = {};
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
            // console.log("FOUND SONG ID #2: ", provider, result, song.title);
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
  }
}
