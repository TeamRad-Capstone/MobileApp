import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

// This is the Book component. It displays each book's details and links to the book details page.

type BookProps = {
  title: string;
  authors: string[];
  coverUrl: string;
  context?: string;
  description: string;
  numOfPages: number;
  categories: string[];
  publishedDate: string;
};

const Book = ({
  title,
  authors,
  coverUrl,
  context,
  description,
  numOfPages,
  categories,
  publishedDate,
}: BookProps) => {
  return (
    <View style={styles.container}>
      {/* link to book details page with book info as params */}
      <Link
        href={{
          pathname: "/(tabs)/(search)/[book]",
          params: {
            book: title,
            coverUrl: coverUrl,
            title: title,
            authors: authors,
            description: description,
            numOfPages: numOfPages,
            categories: categories,
            publishedDate: publishedDate,
          },
        }}
      >
        {/* book cover image */}
        <Image
          style={styles.cover}
          source={
            coverUrl
              ? { uri: coverUrl }
              : require("@/assets/images/books/cover-not-found.jpg")
          }
        />
      </Link>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{authors}</Text>

        {/* if the context is "goalPage", show additional options like rating (3/5 just for display for now) and remove button */}
        {context === "goalPage" && (
          <>
            <Text style={{ fontSize: 30, color: "#000000ff" }}>
              {"★".repeat(3) + "☆".repeat(2)}
            </Text>
            <Pressable>
              <Text>Remove</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,
    alignItems: "flex-start",
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 5,
  },
  textContainer: {
    marginLeft: 15,
    justifyContent: "flex-start",
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
