import { Source } from "../Source";
import { Song } from "../Song";
import { fetchNoCORS } from "../../utils";

const TITLE = "Radio 2 - Top 2000 Stemlijst";

export class NLRadio2Top2000Source extends Source<{
  year: string;
  id: string;
}> {
  async fetch() {
    this.onStart();
    try {
      /*const response = await fetchNoCORS(
        `https://stem-backend.npo.nl/api/form/top2000-${this.fields.year}/${this.fields.id}`
      );
      const text = await response.text();
      const json = JSON.parse(text);*/
      const json = require("./sampleData.json");
      const { name, shortlist } = json;
      // @ts-ignore
      const songs: Song[] = shortlist.map((item) => {
        const { _id, _source } = item;
        const { image, title, artist, audio } = _source;
        return new Song({
          title,
          artist,
          imageUrl: image,
        });
      });
      this.onComplete(songs, { title: `${TITLE} van ${name}` });
    } catch (error) {
      this.onError(error);
    }
  }
}

export function getSourceFromURL(url: string): Source | null {
  // eg. https://stem.nporadio2.nl/top2000-2020/share/cc87893480d6ebf4741784b2ss
  const match = url.match(
    /^https\:\/\/stem.nporadio2.nl\/top2000-(\d+)\/share\/(.*)$/
  );
  if (!match) return null;

  return new NLRadio2Top2000Source({
    title: TITLE,
    description: url,
    imageUrl:
      "https://images4.persgroep.net/rcs/-9DviUQUw27j0AkMm_CUQjRXtu8/diocontent/162917285/_fitwidth/128/?appId=21791a8992982cd8da851550a453bd7f&quality=0.9",
    fields: {
      year: match[1],
      id: match[2],
    },
  });
}
