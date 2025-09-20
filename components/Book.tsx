import booksData from "@/data/books.json";
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

  return (
    <View style={styles.container}>
      <Image
        style={styles.cover}
        source={
          book.coverUrl
            ? { uri: book.coverUrl }
            : require("@/assets/images/books/cover-not-found.jpg")
        }
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.authors}</Text>

        {(context === "readBook" ||
          context === "wantToReadShelf" ||
          context === "goalShelf") && (
          <Pressable style={styles.removeButton} onPress={handleRemove}>
            <Text>Remove</Text>
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
  );
};

export default Book;

const styles = StyleSheet.create({
  container: { flexDirection: "row", margin: 10, alignItems: "flex-start" },
  cover: { width: 160, height: 240, borderRadius: 5 },
  textContainer: { marginLeft: 15, justifyContent: "flex-start" },
  title: { fontSize: 18, fontFamily: "Agbalumo" },
  author: { fontSize: 16, fontFamily: "Agbalumo", color: "#555" },
  dropdown: {
    backgroundColor: "#725437",
    borderRadius: 10,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
    marginTop: 10,
    width: 150,
  },
  dropdownContainer: { backgroundColor: "#725437", borderRadius: 10 },
  removeButton: {
    backgroundColor: "#9B2426",
    borderRadius: 10,
    padding: 5,
    width: 150,
    marginTop: 10,
  },
});
