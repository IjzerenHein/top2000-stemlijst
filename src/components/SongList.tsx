import React from "react";
import { StyleSheet } from "react-native";
import { Source } from "../store";
import { Colors } from "../theme";
import { observer } from "mobx-react";
import { List } from "react-native-paper";
import SongListItem from "./SongListItem";
import SongImage from "./SongImage";

export default observer((props: { source: Source }) => {
  const { title, description, imageUrl, songs } = props.source;
  return (
    <List.Section>
      <List.Accordion
        title={title}
        description={description}
        left={(props) => <SongImage imageUrl={imageUrl} />}
        expanded={true}
        onPress={() => {}}
      >
        {songs.map((song, index) => (
          <SongListItem key={index} song={song} />
        ))}
      </List.Accordion>
    </List.Section>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
  },
  urlBar: {
    marginHorizontal: "10%",
  },
});
