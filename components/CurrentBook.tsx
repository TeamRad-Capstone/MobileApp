import ProgressLine from "@/components/ProgressLine";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type CurrentBookProps = {
  title: string;
  author: string;
  coverUrl: string;
  progress: number;
  numOfPages: number;
  description: string;
  category: string;
  publishedDate: string;
  context?: string;
};

const CurrentBook = ({
  title,
  author,
  coverUrl,
  progress,
  numOfPages,
  description,
  category,
  publishedDate,
  context,
}: CurrentBookProps) => {
  return (
    <Link
      href={{
        pathname: "/(tabs)/(search)/[book]",
        params: {
          book: title,
          coverUrl: coverUrl,
          title: title,
          authors: author,
          description: description,
          numOfPages: numOfPages,
          category: category,
          publishedDate: publishedDate,
          context: context,
        },
      }}
      style={styles.linkWrapper}
    >
      <View style={styles.container}>
        <Image style={styles.imageCover} source={{ uri: coverUrl }} />
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.detailsTitle}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.detailsAuthor}>
            {author}
          </Text>
          <ProgressLine progress={progress} target={numOfPages} />
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Log</Text>
          </Pressable>
        </View>
      </View>
    </Link>
  );
};

export default CurrentBook;

const styles = StyleSheet.create({
  linkWrapper: {
    marginVertical: 10,
    alignSelf: "center",
  },
  container: {
    flexDirection: "row",
    width: 280,
    height: 180,
    backgroundColor: "#CFC6AE",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  imageCover: {
    width: 100,
    height: 160,
    borderRadius: 15,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    height: "100%",
  },
  detailsTitle: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  detailsAuthor: {
    fontFamily: "Agbalumo",
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#A65926",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
  },
});
