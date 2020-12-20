const BASE_URL = "https://api.music.apple.com/v1";

export type AppleMusicAuth = {
  developerToken: string;
  userToken: string;
};

export async function authorizeAppleMusic(
  developerToken: string
): Promise<AppleMusicAuth> {
  // Configure
  // @ts-ignore
  const music = MusicKit.configure({
    developerToken,
    app: {
      name: "Top 2000 Stemlijst",
      icon: require("../../assets/logo.png"),
      build: "1.0.0", // TODO?
      version: "1.0.0", // TODO?
    },
  });

  // Authorize with user
  const userToken = await music.authorize();

  return {
    developerToken,
    userToken,
  };
}

export async function appleMusicFetch<T = any>(
  auth: AppleMusicAuth,
  path: string,
  body?: any,
  method?: "GET" | "PUT" | "POST"
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: method ?? "GET",
    headers: {
      Authorization: `Bearer ${auth.developerToken}`,
      "Music-User-Token": auth.userToken,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function createAppleMusicPlaylist(
  auth: AppleMusicAuth,
  name: string,
  description: string,
  ids: string[]
) {
  const json = await appleMusicFetch(
    auth,
    "/me/library/playlists",
    {
      attributes: {
        name,
        description,
      },
      relationships: {
        tracks: {
          data: ids.map((id) => ({
            id,
            type: "songs",
          })),
        },
      },
    },
    "POST"
  );
  const id = json.data[0].id;
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return `https://music.apple.com/library`;
  } else {
    return `https://music.apple.com/library/playlist/${id}`;
  }
}
