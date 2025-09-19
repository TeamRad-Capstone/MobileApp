import {StyleSheet, View, Image, Text, Pressable} from "react-native";
import ProgressLine from "@/components/ProgressLine";

type CurrentBookProps = {
  title: string;
  author: string;
  coverUrl: string;
  progress: number;
  numOfPages: number;
  // logs: string[];
}

const CurrentBook = ({title, author, coverUrl, progress, numOfPages} : CurrentBookProps) => {

  return (
    <View style={styles.container}>
      <Image
        style={styles.imageCover}
        source={{uri: coverUrl}}
      />
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.detailsTitle}>{title}</Text>
        <Text numberOfLines={1} style={styles.detailsAuthor}>{author}</Text>
        <ProgressLine
          progress={progress}
          target={numOfPages}
        />
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Log</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default CurrentBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: 275,
    backgroundColor: "#CFC6AE",
    borderRadius: 30,
    height: 180,
  },
  imageCover: {
    width: 100,
    height: 165,
    borderRadius: 20,
    marginLeft: 20,
    marginVertical: "auto"
  },
  details: {
    width: 140,
    height: 165,
    marginLeft: 10,
    marginVertical: "auto",
    gap: 4
  },
  detailsTitle: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  detailsAuthor: {
    fontFamily: "Agbalumo",
    fontSize: 14,
    paddingBottom: 10
  },
  button: {
    position: "absolute",
    bottom: 0,
    marginBottom: 6,
    backgroundColor: "#A65926",
    marginRight: "auto",
    borderRadius: 20
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    paddingVertical: 6,
    paddingHorizontal: 20
  }
})