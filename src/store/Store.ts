import { observable, computed, decorate } from "mobx";
import { runInAction } from "mobx";
import * as Linking from "expo-linking";
import uniqBy from "lodash.uniqby";

import { Song } from "./Song";
import { Source } from "./Source";
import type { SourceData, SongData } from "./types";
import { analytics, firestore } from "../firebase";

import {
  authorizeSpotify,
  getSpotifyUserProfile,
  createSpotifyPlaylist,
  addSpotifyPlaylistTracks,
} from "../spotify";

const ORIGIN =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/top2000-stemlijst/us-central1"
    : "https://us-central1-top2000-stemlijst.cloudfunctions.net";

type Status = {
  isLoading: boolean;
  error?: Error;
  playlistUrl?: string;
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
      analytics.logEvent("import_url", {
        url,
        name: sourceData.name,
        songs: sourceData.songs.length,
        missingSongs: sourceData.songs.filter(
          (songData) => !songData.spotifyUri
        ).length,
      });
      return source;
    } catch (error) {
      analytics.logEvent("import_failure", {
        url,
        error: error.message,
      });
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
    return uniqBy(
      this.mutableSources.flatMap((source) =>
        source.songs.filter((song) => song.isSelected)
      ),
      (song) => song.spotifyUri
    );
  }

  toJSON() {
    return {
      sources: this.mutableSources.map((source) => source.toJSON()),
      songs: this.songs.map((song) => song.toJSON()),
    };
  }

  /**
   * 1. Stores the imported songs in Firestore
   * 2. Redirects to Spotify to authorize the user
   */
  async saveAndAuthorizeForImport() {
    runInAction(() => {
      this.mutableImportStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      const data = this.toJSON();
      const { id } = await firestore.collection("imports").add(data);
      analytics.logEvent("save_import", {
        importId: id,
        type: "spotify",
        sources: data.sources.length,
        songs: data.songs.length,
      });
      authorizeSpotify(id, true);
    } catch (error) {
      analytics.logEvent("save_failure", {
        error: error.message,
      });
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          error,
        });
      });
    }
  }

  /**
   * 1. Loads the imports songs from Firestore
   * 2. Gets user Id
   * 3. Creates playlist
   * 4. Adds tracks to playlist
   * 5. Updates playlist url
   */
  async importFromAuthorizationCallback(queryParams: any) {
    const {
      access_token,
      state: importId,
      error,
      /* token_type,
      expires_in, */
    } = queryParams;

    if (error) {
      analytics.logEvent("authorize_failure", {
        importId,
        type: "spotify",
        error,
      });
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          error: new Error(`Spotify authorisatie mislukt (${error})`),
        });
      });
      return;
    }

    runInAction(() => {
      this.mutableImportStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      // Re-initialize store with data
      const docRef = firestore.collection("imports").doc(importId);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Kan import data niet vinden");
      }
      const docData: {
        sources: SourceData[];
        songs: SongData[];
      } = doc.data() as any;
      const sources = docData.sources.map(
        (sourceData) => new Source(sourceData)
      );
      runInAction(() => this.mutableSources.replace(sources));

      // Get user-id for which to create a playlist
      const userProfile = await getSpotifyUserProfile(access_token);
      // console.log("userProfile", userProfile);

      // Create playlist
      const playlistName = sources[0].title;
      const playlist = await createSpotifyPlaylist(
        access_token,
        userProfile.id,
        playlistName,
        false
      );
      const playlistUrl = playlist.external_urls.spotify;
      // console.log("playlist", playlist);

      // Add tracks to playlist
      await addSpotifyPlaylistTracks(
        access_token,
        playlist.id,
        docData.songs.map((song) => song.spotifyUri!)
      );

      // Update url-bar
      history.replaceState("", document.title, "/");

      // Store import url
      /* docRef.update({
        spotifyUri: playlist.uri,
      }); */

      analytics.logEvent("create_playlist", {
        importId,
        type: "spotify",
        public: false,
        sources: docData.sources.length,
        songs: docData.songs.length,
      });

      // All done
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          playlistUrl,
        });
      });
    } catch (error) {
      analytics.logEvent("create_playlist_failure", {
        importId,
        type: "spotify",
        error,
      });
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

  openPlaylist() {
    const { playlistUrl } = this.importStatus;
    if (!playlistUrl) {
      return;
    }

    analytics.logEvent("open_playlist", {
      type: "spotify",
    });

    Linking.openURL(playlistUrl);
  }
}

decorate(Store, { songs: computed });
