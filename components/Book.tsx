import ProgressLine from "@/components/ProgressLine"; // adjust import path if needed
import booksData from "@/data/books.json";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type BookProps = {
  bookId: number;
  shelfId?: number;
  goalId?: number;
  context?: string;
};

const Book = ({ bookId, shelfId, goalId, context }: BookProps) => {
  const [chosenShelf, setChosenShelf] = useState<number | null>(null);

  const book = booksData.books.find((b) => b.id === bookId);
  if (!book) return null;

  const rating = booksData.ratings?.find((r) => r.bookId === bookId)?.rating;

  const shelves = [
    ...booksData.defaultShelves.map((s) => ({ label: s.name, value: s.id })),
    ...booksData.customShelves.map((s) => ({ label: s.name, value: s.id })),
  ];

  const handleAdd = (shelfValue: number) => {
    booksData.shelfBooks.push({ shelfId: shelfValue, bookId: book.id });
    alert(
      `Added "${book.title}" to shelf: ${
        shelves.find((s) => s.value === shelfValue)?.label
      }`
    );
  };

  const handleRemove = () => {
    if (context === "goalShelf" && goalId) {
      booksData.goalBooks = booksData.goalBooks.filter(
        (gb) => !(gb.book_id === book.id && gb.goal_id === goalId)
      );
      alert(`Removed "${book.title}" from goal`);
    } else {
      const shelfToRemove = shelfId ?? chosenShelf;
      if (!shelfToRemove) return;

      booksData.shelfBooks = booksData.shelfBooks.filter(
        (sb) => !(sb.bookId === book.id && sb.shelfId === shelfToRemove)
      );
      alert(`Removed "${book.title}" from shelf`);
    }
  };

  const bookProgressObj = booksData.readingProgress?.find(
    (rp) => rp.bookId === book.id
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/(shelf)/[bookinfo]",
            params: { bookId: book.id, context: "goalPage" },
          })
        }
      >
        <Image
          style={styles.cover}
          source={
            book.coverUrl
              ? { uri: book.coverUrl }
              : require("@/assets/images/books/cover-not-found.jpg")
          }
        />
      </Pressable>

      <View style={styles.textContainer}>
        {/* Top Info */}
        <View style={styles.topInfo}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.authors}</Text>
          <Text style={styles.genre}>{book.category}</Text>

          {rating !== undefined && (
            <Text style={styles.stars}>
              {"★".repeat(rating) + "☆".repeat(5 - rating)}
            </Text>
          )}
        </View>

        {bookProgressObj && (
          <View style={{ marginTop: 5, width: 200 }}>
            <ProgressLine
              progress={bookProgressObj.progress}
              target={book.numOfPages}
            />
          </View>
        )}

        <View style={styles.bottomColumn}>
          {(context === "readBook" ||
            context === "wantToReadShelf" ||
            context === "goalShelf") && (
            <Pressable style={styles.removeButton} onPress={handleRemove}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          )}

          <Dropdown
            maxHeight={200}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={{ textAlign: "center", color: "white" }}
            itemTextStyle={{ textAlign: "center", color: "white" }}
            data={shelves}
            labelField="label"
            valueField="value"
            onChange={(item) => {
              setChosenShelf(item.value);
              handleAdd(item.value);
            }}
            value={chosenShelf}
            placeholder="Add to Shelf"
          />
        </View>
      </View>
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: { flexDirection: "row", margin: 10 },
  cover: { width: 160, height: 240, borderRadius: 5 },
  textContainer: { marginLeft: 15, flex: 1, justifyContent: "space-between" },
  topInfo: {}, // Keeps top info compact
  title: { fontSize: 18, fontFamily: "Agbalumo" },
  author: { fontSize: 16, fontFamily: "Agbalumo", color: "#555" },
  genre: {
    fontSize: 14,
    fontFamily: "Agbalumo",
    color: "#888",
    marginVertical: 2,
  },
  stars: { fontSize: 18, marginVertical: 2 },
  bottomColumn: { marginTop: 10 },
  removeButton: {
    backgroundColor: "#B35B5B",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 200,
    alignItems: "center",
    marginBottom: 5,
  },
  removeButtonText: {
    color: "white",
    fontFamily: "Agbalumo",
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "#725437",
    borderRadius: 10,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
    width: 200,
  },
  dropdownContainer: { backgroundColor: "#725437", borderRadius: 10 },
});
