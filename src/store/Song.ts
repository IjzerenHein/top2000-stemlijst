import { IObservableValue, observable } from "mobx";

import type { SongData } from "./types";

export class Song {
  public readonly title: string;
  public readonly artist: string;
  public readonly imageUrl?: string;
  public readonly spotifyUri?: string;
  private mutableIsSelected: IObservableValue<boolean>;

  constructor(data: SongData) {
    this.title = data.title;
    this.artist = data.artist;
    this.imageUrl = data.imageUrl;
    this.spotifyUri = data.spotifyUri;
    this.mutableIsSelected = observable.box(!!data.spotifyUri);
  }

  get isSelected(): boolean {
    return this.mutableIsSelected.get();
  }
  set isSelected(value: boolean) {
    this.mutableIsSelected.set(value);
  }
}
