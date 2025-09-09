import { Image, StyleSheet, Text, View } from "react-native";

// This is the book component. It displays a book's cover, title, and author.

type BookProps = {
  title: string;
  author: string;
  coverUrl: string;
};

const Book = ({ title, author, coverUrl }: BookProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          coverUrl
            ? { uri: coverUrl }
            : require("@/assets/images/books/cover-not-found.jpg")
        }
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
      </View>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: "Agbalumo",
  },
  author: {
    fontSize: 16,
    fontFamily: "Agbalumo",
    color: "#555",
  },
});
