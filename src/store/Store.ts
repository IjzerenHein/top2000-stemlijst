import { observable, computed, decorate } from "mobx";
import { runInAction } from "mobx";
import * as Linking from "expo-linking";
import uniqBy from "lodash.uniqby";

import { Song } from "./Song";
import { Source } from "./Source";
import type { SourceData, DocumentData } from "./types";
import { analytics, firestore } from "../firebase";
import { MusicProvider } from "../providers";
import { t } from "../i18n";
import { FUNCTIONS_URL } from "../config";

import {
  authorizeSpotify,
  getSpotifyUserProfile,
  createSpotifyPlaylist,
  addSpotifyPlaylistTracks,
} from "../providers/spotify";
import {
  AppleMusicAuth,
  authorizeAppleMusic,
  createAppleMusicPlaylist,
} from "../providers/applemusic";

type AddSourceStatus = {
  isLoading: boolean;
  error?: Error;
  token?: string;
};

type ImportStatus = {
  isLoading: boolean;
  error?: Error;
  playlistUrl?: string;
};

export class Store {
  private mutableSources = observable<Source>([]);
  private mutableAddSourceStatus = observable.box<AddSourceStatus>({
    isLoading: false,
  });
  private mutableImportStatus = observable.box<ImportStatus>({
    isLoading: false,
  });

  reset() {
    runInAction(() => {
      this.mutableSources.replace([]);
      this.mutableAddSourceStatus.set({
        isLoading: false,
        error: undefined,
        token: undefined,
      });
      this.mutableImportStatus.set({
        isLoading: false,
        error: undefined,
        playlistUrl: undefined,
      });
    });
  }

  async addSource(url: string, provider: MusicProvider) {
    runInAction(() => {
      this.mutableAddSourceStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      const response = await fetch(
        `${FUNCTIONS_URL}/importUrl?url=${encodeURIComponent(url)}&provider=${
          provider.id
        }`
      );
      const { error, token, ...rest } = await response.json();
      if (error) {
        throw new Error(error);
      }
      const sourceData: SourceData = rest;
      const source = new Source(sourceData);
      runInAction(() => {
        this.mutableSources.push(source);
        this.mutableAddSourceStatus.set({
          isLoading: false,
          token,
        });
      });
      analytics.logEvent("import_url", {
        url,
        provider: provider.id,
        name: sourceData.name,
        songs: sourceData.songs.length,
        missingSongs: sourceData.songs.filter((songData) => !songData.id)
          .length,
      });
      return source;
    } catch (error) {
      analytics.logEvent("import_failure", {
        url,
        provider: provider.id,
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

  get addSourceStatus(): AddSourceStatus {
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
      (song) => song.id
    );
  }

  toJSON(): DocumentData {
    return {
      sources: this.mutableSources.map((source) => source.toJSON()),
      songs: this.songs.map((song) => song.toJSON()),
    };
  }

  /**
   * 1. Stores the imported songs in Firestore
   * 2. Redirects to Spotify to authorize the user
   */
  async saveAndAuthorizeForImport(provider: MusicProvider, linkTo: any) {
    runInAction(() => {
      this.mutableImportStatus.set({
        isLoading: true,
        error: undefined,
      });
    });
    try {
      let playlistUrl: string;
      switch (provider.id) {
        case "spotify":
          playlistUrl = await this.importToSpotify(provider);
          break;
        case "applemusic":
          playlistUrl = await this.importToAppleMusic(provider, linkTo);
          break;
        default:
          throw new Error(`Provider not supported: "${provider.id}"`);
      }
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          playlistUrl,
        });
      });
    } catch (error) {
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          error,
        });
      });
    }
  }

  async saveImportData(provider: MusicProvider): Promise<string> {
    try {
      const data = this.toJSON();
      const { id } = await firestore.collection("imports").add(data);
      analytics.logEvent("save_import", {
        importId: id,
        provider: provider.id,
        sources: data.sources.length,
        songs: data.songs.length,
      });
      return id;
    } catch (error) {
      analytics.logEvent("save_failure", {
        error: error.message,
        provider: provider.id,
      });
      throw error;
    }
  }

  /**
   * Saves the import data and authorizes Spotify.
   * The promise of this function never resolves, but instead
   * a new web page is opened in which the user can authorize
   * Spotify. After succesful authorization, the web-browser
   * is redirected back to this app, after which it continues
   * the import to Spotify process (importFromAuthorizationCallback)
   */
  async importToSpotify(provider: MusicProvider): Promise<string> {
    const importId = await this.saveImportData(provider);
    return new Promise(() => authorizeSpotify(importId, true));
  }

  /**
   * 1. Authorizes Apple Music (this needs to be the first action
   *    that is performed because it opens a popup, which is only
   *    allowed when executed from a user event.
   * 2. Imports data
   * 3. Navigate to import screen
   * 4. Create the playlist in Apple Music
   */
  async importToAppleMusic(provider: MusicProvider, linkTo: any) {
    // Authorize
    let auth: AppleMusicAuth;
    try {
      auth = await authorizeAppleMusic(
        this.mutableAddSourceStatus.get().token!
      );
    } catch (error) {
      analytics.logEvent("authorize_failure", {
        provider: provider.id,
        error,
      });
      throw new Error(t("$1 authorisatie mislukt ($2)", provider.name, error));
    }

    // Save import data
    const importId = await this.saveImportData(provider);

    // Show import screen
    linkTo(`/${provider.id}/import`);

    // Create playlist
    try {
      const docData = this.toJSON();
      const playlistName = docData.sources[0].title;
      const playlistUrl = await createAppleMusicPlaylist(
        auth,
        playlistName,
        "",
        docData.songs.map((song) => song.id!)
      );

      analytics.logEvent("create_playlist", {
        importId,
        provider: provider.id,
        public: false,
        sources: docData.sources.length,
        songs: docData.songs.length,
      });

      return playlistUrl;
    } catch (error) {
      analytics.logEvent("create_playlist_failure", {
        importId,
        provider: provider.id,
        error,
      });
      throw error;
    }
  }

  /**
   * 1. Loads the imports songs from Firestore
   * 2. Gets user Id
   * 3. Creates playlist
   * 4. Adds tracks to playlist
   * 5. Updates playlist url
   */
  async importFromAuthorizationCallback(
    queryParams: any,
    provider: MusicProvider
  ) {
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
        provider: provider.id,
        error,
      });
      runInAction(() => {
        this.mutableImportStatus.set({
          isLoading: false,
          error: new Error(
            t("$1 authorisatie mislukt ($2)", provider.name, error)
          ),
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
      const docData: DocumentData = doc.data() as any;
      const sources = docData.sources.map(
        (sourceData) => new Source(sourceData)
      );
      runInAction(() => this.mutableSources.replace(sources));

      let playlistUrl: string;
      if (provider.id === "spotify") {
        // Get user-id for which to create a playlist
        const userProfile = await getSpotifyUserProfile(access_token);

        // Create playlist
        const playlistName = sources[0].title;
        const playlist = await createSpotifyPlaylist(
          access_token,
          userProfile.id,
          playlistName,
          false
        );
        playlistUrl = playlist.external_urls.spotify;

        // Add tracks to playlist
        await addSpotifyPlaylistTracks(
          access_token,
          playlist.id,
          docData.songs.map((song) => song.id!)
        );
      } else {
        throw new Error("Provider not supported");
      }

      analytics.logEvent("create_playlist", {
        importId,
        provider: provider.id,
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
        provider: provider.id,
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

  get importStatus(): ImportStatus {
    return this.mutableImportStatus.get();
  }

  openPlaylist(provider: MusicProvider) {
    const { playlistUrl } = this.importStatus;
    if (!playlistUrl) {
      return;
    }

    analytics.logEvent("open_playlist", {
      provider: provider.id,
    });

    Linking.openURL(playlistUrl);
  }
}

decorate(Store, { songs: computed });
