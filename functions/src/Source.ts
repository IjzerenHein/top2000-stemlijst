import type { Song } from "./Song";

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
}
