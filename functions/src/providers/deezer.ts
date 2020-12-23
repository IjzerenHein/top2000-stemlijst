import fetch from "node-fetch";

export async function getDeezerSongData(
  title: string,
  artist: string
): Promise<{
  id: string;
  imageUrl?: string;
}> {
  const response = await fetch(
    `https://api.deezer.com/search?q=${encodeURIComponent(
      artist + " " + title
    )}`
  );
  const json = await response.json();
  if (!json.data?.length) {
    throw new Error("Not found");
  }
  return {
    id: json.data[0].id + "",
  };
}
