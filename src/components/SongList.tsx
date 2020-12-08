import React from "react";
import { StyleSheet } from "react-native";
import { Source } from "../store";
import { Colors } from "../theme";
import { observer } from "mobx-react";
import { List, Headline, Caption } from "react-native-paper";
import SongListItem from "./SongListItem";
import SongImage from "./SongImage";

export default observer((props: { source: Source }) => {
  const { title, description, imageUrl, songs } = props.source;
  return (
    <List.Section style={styles.container}>
      <Headline>{title}</Headline>
      <Caption>{description}</Caption>
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
});
