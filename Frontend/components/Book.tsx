import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { router } from "expo-router";
import ProgressLine from "@/components/ProgressLine";
import { removeBookFromReadingGoal } from "@/services/api";

type BookProps = {
  book: any;
  goalId?: number;
  context?: string;
  onRemoved?: () => void;
};

const Book = ({ book, goalId, context, onRemoved }: BookProps) => {
  const handleRemove = async () => {
    if (!goalId) return;
    try {
      await removeBookFromReadingGoal(goalId, book.book_id);
      Alert.alert("Removed", "Book removed from goal");
      if (onRemoved) onRemoved();
    } catch (err) {
      Alert.alert("Error", "Failed to remove book from goal");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/(book)/[shelfBook]",
            params: {
              shelfBook: book.google_book_id.toString(),
              bookinfo: book.google_book_id.toString(),
              bookId: book.google_book_id.toString(),
              title: book.title || "",
              authors: (book.authors || []).join(", "),
              categories: book.categories || "",
              pagesRead: (book.progress || 0).toString(),
              numOfPages: (book.pages || 0).toString(),
              rating: (book.rating || 0).toString(),
              shelfName: book.shelfName || "",
              allShelves: JSON.stringify(book.allShelves || []),
              description: book.description || "",
            },
          })
        }
      >
        <Image
          style={styles.cover}
          source={{
            uri: `https://books.google.com/books?id=${book.google_book_id}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
          }}
        />
      </Pressable>

      <View style={styles.infoContainer}>
        <View style={styles.topDetails}>
          <Text numberOfLines={2} style={styles.title}>
            {book.title}
          </Text>
          <Text numberOfLines={1} style={styles.author}>
            {book.authors?.join(", ")}
          </Text>
          <Text numberOfLines={1} style={styles.pages}>
            {book.pages || 0} pages
          </Text>
          {book.categories && (
            <Text numberOfLines={1} style={styles.genre}>
              {book.categories.join(", ")}
            </Text>
          )}
        </View>

        <View style={styles.bottomDetails}>
          {book.progress !== undefined && (
            <ProgressLine progress={book.progress} target={book.pages || 100} />
          )}

          {context === "goalShelf" && (
            <Pressable style={styles.removeBtn} onPress={handleRemove}>
              <Text style={styles.removeTxt}>Remove from Goal</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 12,
    height: 275,
    backgroundColor: "#F6F2EA",
  },
  cover: {
    width: 175,
    height: 275,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  topDetails: {
    gap: 8,
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 20,
  },
  author: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  pages: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  genre: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    backgroundColor: "#CCB452",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 30,
    marginTop: 4,
  },
  bottomDetails: {
    gap: 10,
  },
  removeBtn: {
    backgroundColor: "#9B2426",
    borderRadius: 10,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  removeTxt: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "#fff",
  },
});
