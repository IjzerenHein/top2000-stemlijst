import { Source } from "../Source";
import { Song } from "../Song";
import fetch from "node-fetch";

const TITLE = "Top 2000 Stemlijst";

export function getSourceFromURL(url: string): Source | null {
  const customFields: any = {};

  // eg. https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2b95ee3d411711b53
  // or 2019 https://stem.nporadio2.nl/top-2000/share/e7e3efde0d8d6a92c0fccac24248325e84f137af
  const matchWithYear = url.match(
    /^https\:\/\/stem.nporadio2.nl\/top2000-(\d+)\/share\/(.*)$/
  );
  if (!matchWithYear) {
    const matchWithoutYear = url.match(
      /^https\:\/\/stem.nporadio2.nl\/top-2000\/share\/(.*)$/
    );
    if (matchWithoutYear) {
      customFields.year = 2019;
      customFields.id = matchWithoutYear[1];
    } else {
      return null;
    }
  } else {
    customFields.year = matchWithYear[1];
    customFields.id = matchWithYear[2];
  }

  return new Source<{
    id: string;
    year?: string;
  }>({
    fetch: async (data) => {
      const { year, id } = data.customFields;
      // eg. https://stem-backend.npo.nl/api/form/top2000-2020/cc87893480d6ebf4741784b2b95ee3d411711b53
      const backendUrl = `https://stem-backend.npo.nl/api/form/top2000-${year}/${id}`;
      const response = await fetch(backendUrl);
      if (!response.ok) {
        throw new Error(`Stemlijst niet gevonden (${response.status})`);
      }
      const text = await response.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch (error) {
        throw new Error(`Stemlijst fout (${text})`);
      }
      const { name, shortlist } = json;
      // @ts-ignore
      const songs: Song[] = shortlist.map((item) => {
        const { _source /* _id */ } = item;
        const { image, title, artist, audio } = _source;
        // eg. https://stem-backend.npo.nl//storage/preview/827/spotify-407ltk0BtcZI8kgu0HH4Yj.mp3
        const trackIdMatch = audio?.match(
          /^https\:\/\/stem-backend.npo.nl(\/+)storage\/preview\/(\d+)\/spotify-([a-zA-Z0-9]+)\./
        );
        return {
          title,
          artist,
          imageUrl: image,
          ...(trackIdMatch
            ? { spotifyUri: `spotify:track:${trackIdMatch[3]}` }
            : {}),
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
    customFields,
    songs: [],
  });
}
