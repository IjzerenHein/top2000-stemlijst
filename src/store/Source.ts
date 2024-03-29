import { IObservableArray, IObservableValue, observable, toJS } from "mobx";

import { Song } from "./Song";
import type { SourceData } from "./types";

export class Source {
  public readonly url: string;
  public readonly name: string;
  public readonly imageUrl?: string;
  private mutableTitle: IObservableValue<string>;
  private mutableDescription: IObservableValue<string>;
  private mutableSongs: IObservableArray<Song>;

  constructor(data: SourceData) {
    this.url = data.url;
    this.name = data.name;
    this.imageUrl = data.imageUrl;
    this.mutableTitle = observable.box(data.title);
    this.mutableDescription = observable.box(data.description);
    this.mutableSongs = observable<Song>(
      data.songs?.map((songData) => new Song(songData)) ?? []
    );
  }

  get title(): string {
    return this.mutableTitle.get();
  }

  get description(): string {
    return this.mutableDescription.get();
  }

  get songs(): Song[] {
    return toJS(this.mutableSongs);
  }

  get failedSongs(): Song[] {
    return this.mutableSongs.filter((song) => !song.id);
  }

  toJSON(): SourceData {
    return {
      url: this.url,
      name: this.name,
      imageUrl: this.imageUrl || "",
      title: this.title,
      description: this.description,
      songs: this.mutableSongs.map((song) => song.toJSON()),
    };
  }
}
