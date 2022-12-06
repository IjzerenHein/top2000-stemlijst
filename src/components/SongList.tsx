import React from "react";
import { StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { List, Headline, Caption } from "react-native-paper";

import { Source } from "../store";
import { Colors } from "../theme";
import SongListItem from "./SongListItem";
import { t } from "../i18n";
import { useMusicProvider } from "../providers";

export default observer((props: { source: Source }) => {
  const { title, songs, failedSongs } = props.source;
  const provider = useMusicProvider();
  return (
    <List.Section style={styles.container}>
      <Headline>{title}</Headline>
      <Caption style={failedSongs.length ? styles.warning : undefined}>
        {failedSongs.length
          ? t(
              `$1 song(s) werden niet gevonden op $2`,
              failedSongs.length + "",
              provider.name
            )
          : t(`$1 song(s)`, songs.length + "")}
      </Caption>
      {songs.map((song, index) => (
        <SongListItem key={index} song={song} />
      ))}
    </List.Section>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  warning: {
    color: Colors.yellow,
  },
});
