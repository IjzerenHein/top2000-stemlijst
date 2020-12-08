import { IObservableValue, observable } from "mobx";

import type { SongData } from "./types";

export class Song {
  public readonly title: string;
  public readonly artist: string;
  public readonly imageUrl?: string;
  private mutableSpotifyId: IObservableValue<string>;

  constructor(data: SongData) {
    this.title = data.title;
    this.artist = data.artist;
    this.imageUrl = data.imageUrl;
    this.mutableSpotifyId = observable.box(data.spotifyId || "");
    /* if (!config.spotifyId) {
      this.fetchSpotifyId();
    }*/
  }

  get spotifyId(): string {
    return this.mutableSpotifyId.get();
  }

  /* private async fetchSpotifyId() {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(this.title + ' ' + this.artist)}&type='track`, {
        headers: {

        }
    });


  }*/
}
