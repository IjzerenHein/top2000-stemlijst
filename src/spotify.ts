const CLIENT_ID = "66fb733b0b4d409ba0b2f091b781ed6d";

export async function authorizeSpotify(
  importId: string,
  isPublicPlaylist: boolean
) {
  const redirectUri =
    process.env.NODE_ENV === "development"
      ? "http://localhost:19006/authorize"
      : "https://www.spotify-import/authorize";
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&state=${importId}&scope=${
    isPublicPlaylist ? "playlist-modify-private" : "playlist-modify-public"
  }`;
  window.open(url);
}
