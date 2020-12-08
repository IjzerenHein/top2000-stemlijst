import { autorun, IObservableValue, observable, runInAction } from "mobx";

export class Song {
  public readonly title: string;
  public readonly artist: string;
  public readonly imageUrl?: string;
  private mutableSpotifyId: IObservableValue<string>;

  constructor(config: {
    title: string;
    artist: string;
    imageUrl?: string;
    spotifyId?: string;
  }) {
    this.title = config.title;
    this.artist = config.artist;
    this.imageUrl = config.imageUrl;
    this.mutableSpotifyId = observable.box(config.spotifyId || "");
  }

  get spotifyId(): string {
    return this.mutableSpotifyId.get();
  }
}
