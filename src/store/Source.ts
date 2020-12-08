import {
  IObservableArray,
  IObservableValue,
  observable,
  runInAction,
} from "mobx";
import { Song } from "./Song";

type SourceStatus = {
  isLoading?: boolean;
  error?: Error;
};

export abstract class Source<Fields = any> {
  protected readonly fields: Fields;
  private mutableTitle: IObservableValue<string>;
  private mutableDescription: IObservableValue<string>;
  private mutableImageUrl: IObservableValue<string>;
  private mutableSongs: IObservableArray<Song>;
  private mutableStatus: IObservableValue<SourceStatus>;
  private isInitialFetch: boolean = true;

  constructor(config: {
    title: string;
    description: string;
    imageUrl: string;
    fields: Fields;
  }) {
    this.fields = config.fields;
    this.mutableTitle = observable.box(config.title);
    this.mutableDescription = observable.box(config.description);
    this.mutableImageUrl = observable.box(config.imageUrl);
    this.mutableSongs = observable<Song>([]);
    this.mutableStatus = observable.box<SourceStatus>({
      isLoading: true,
      error: undefined,
    });
    this.fetch();
  }

  get title(): string {
    return this.mutableTitle.get();
  }

  get description(): string {
    return this.mutableDescription.get();
  }

  get imageUrl(): string {
    return this.mutableImageUrl.get();
  }

  get songs(): Song[] {
    return this.mutableSongs.toJS();
  }

  get status(): SourceStatus {
    return this.mutableStatus.get();
  }

  abstract fetch(): Promise<void>;

  protected onStart() {
    if (!this.isInitialFetch) {
      runInAction(() => {
        this.mutableSongs.replace([]);
        this.mutableStatus.set({
          isLoading: true,
          error: undefined,
        });
      });
    }
    this.isInitialFetch = false;
  }

  protected onComplete(
    songs: Song[],
    options?: {
      title?: string;
    }
  ) {
    runInAction(() => {
      this.mutableSongs.replace(songs);
      this.mutableStatus.set({
        isLoading: false,
        error: undefined,
      });
      if (options?.title) {
        this.mutableTitle.set(options.title);
      }
    });
  }

  protected onError(error: Error) {
    runInAction(() => {
      this.mutableStatus.set({
        isLoading: false,
        error,
      });
    });
  }
}
