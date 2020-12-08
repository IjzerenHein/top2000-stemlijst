import React from "react";
import { StyleSheet } from "react-native";
import { Song } from "../store";
import { observer } from "mobx-react";
import { List } from "react-native-paper";
import SongImage from "./SongImage";

export default observer((props: { song: Song }) => {
  const { title, artist, imageUrl } = props.song;
  return (
    <List.Item
      style={styles.container}
      title={title}
      description={artist}
      left={() => <SongImage imageUrl={imageUrl} />}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    // marginLeft: 50,
  },
});
