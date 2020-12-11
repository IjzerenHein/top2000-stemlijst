import React from "react";
import { StyleSheet } from "react-native";
import { observer } from "mobx-react";
import { List, Headline, Caption } from "react-native-paper";

import { Source } from "../store";
import { Colors } from "../theme";
import SongListItem from "./SongListItem";

export default observer((props: { source: Source }) => {
  const { title, description, songs, failedSongs } = props.source;
  return (
    <List.Section style={styles.container}>
      <Headline>{title}</Headline>
      <Caption style={failedSongs.length ? styles.warning : undefined}>
        {failedSongs.length
          ? `${failedSongs.length} song(s) werden niet gevonden op Spotify`
          : `${songs.length} song(s)`}
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
