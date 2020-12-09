import { Source } from "../Source";
import { Song } from "../Song";
import fetch from "node-fetch";

const TITLE = "Top 2000 Stemlijst";

export function getSourceFromURL(url: string): Source | null {
  // eg. https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53
  const match = url.match(
    /^https\:\/\/stem.nporadio2.nl\/top2000-(\d+)\/share\/(.*)$/
  );
  if (!match) return null;

  return new Source<{
    year: string;
    id: string;
  }>({
    fetch: async (data) => {
      const { year, id } = data.customFields;
      const response = await fetch(
        `https://stem-backend.npo.nl/api/form/top2000-${year}/${id}`
      );
      const text = await response.text();
      const json = JSON.parse(text);
      const { name, shortlist } = json;
      // @ts-ignore
      const songs: Song[] = shortlist.map((item) => {
        const { _source /* _id */ } = item;
        const { image, title, artist /*, audio */ } = _source;
        return {
          title,
          artist,
          imageUrl: image,
        };
      });
      return {
        songs,
        title: `${TITLE} van ${name} (${year})`,
      };
    },
    url,
    name: "nl.radio2.top2000",
    title: TITLE,
    description: url,
    imageUrl:
      "https://images4.persgroep.net/rcs/-9DviUQUw27j0AkMm_CUQjRXtu8/diocontent/162917285/_fitwidth/128/?appId=21791a8992982cd8da851550a453bd7f&quality=0.9",
    customFields: {
      year: match[1],
      id: match[2],
    },
    songs: [],
  });
}
