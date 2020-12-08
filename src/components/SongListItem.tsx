import React from "react";
import { StyleSheet } from "react-native";
import { Song } from "../store";
import { observer } from "mobx-react";
import { List } from "react-native-paper";
import SongImage from "./SongImage";
import SpotifyIcon from "./SpotifyIcon";

export default observer((props: { song: Song }) => {
  const { title, artist, imageUrl, spotifyUri, isSelected } = props.song;
  return (
    <List.Item
      style={styles.container}
      title={artist}
      description={title}
      left={() => <SongImage imageUrl={imageUrl} />}
      right={() => (
        <SpotifyIcon isSelected={isSelected} spotifyUri={spotifyUri} />
      )}
      onPress={() => {
        if (spotifyUri) {
          props.song.isSelected = !isSelected;
        }
      }}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    // marginLeft: 50,
  },
});
