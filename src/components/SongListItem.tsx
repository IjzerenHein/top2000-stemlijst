import React from "react";
import { observer } from "mobx-react-lite";
import { List } from "react-native-paper";

import { Song } from "../store";
import SongImage from "./SongImage";
import SongIcon from "./SongIcon";

export default observer((props: { song: Song }) => {
  const { title, artist, imageUrl, isSelected, id } = props.song;
  return (
    <List.Item
      title={artist}
      description={title}
      left={() => <SongImage imageUrl={imageUrl} />}
      right={() => <SongIcon isSelected={isSelected} isFound={!!id} />}
      onPress={() => {
        if (id) {
          props.song.isSelected = !isSelected;
        }
      }}
    />
  );
});
