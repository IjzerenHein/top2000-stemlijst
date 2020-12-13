import { IObservableValue, observable } from "mobx";

import type { SongData } from "./types";

export class Song {
  public readonly title: string;
  public readonly artist: string;
  public readonly imageUrl?: string;
  public readonly id?: string;
  private mutableIsSelected: IObservableValue<boolean>;

  constructor(data: SongData) {
    this.title = data.title;
    this.artist = data.artist;
    this.imageUrl = data.imageUrl;
    this.id = data.id;
    this.mutableIsSelected = observable.box(data.isSelected ?? !!data.id);
  }

  get isSelected(): boolean {
    return this.mutableIsSelected.get();
  }
  set isSelected(value: boolean) {
    this.mutableIsSelected.set(value);
  }

  toJSON(): SongData {
    return {
      title: this.title || "",
      artist: this.artist || "",
      imageUrl: this.imageUrl || "",
      id: this.id || "",
      isSelected: this.isSelected,
    };
  }
}
