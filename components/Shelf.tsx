import Book from "@/components/Book";
import booksData from "@/data/books.json";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

type ShelfProps = {
  shelfId?: number;
  goalId?: number;
  context?: string; // "goalShelf" or normal
};

const Shelf = ({ shelfId, goalId, context }: ShelfProps) => {
  const [searchText, setSearchText] = useState("");

  let filteredBooks: typeof booksData.books = [];

  if (context === "goalShelf" && goalId !== undefined) {
    const goalBookIds = booksData.goalBooks
      .filter((gb) => gb.goal_id === goalId)
      .map((gb) => gb.book_id);

    filteredBooks = booksData.books.filter(
      (book) =>
        goalBookIds.includes(book.id) &&
        (book.title.toLowerCase().includes(searchText.toLowerCase()) ||
          book.authors.toLowerCase().includes(searchText.toLowerCase()))
    );
  } else if (shelfId !== undefined) {
    const shelfBookIds = booksData.shelfBooks
      .filter((sb) => sb.shelfId === shelfId)
      .map((sb) => sb.bookId);

    filteredBooks = booksData.books.filter(
      (book) =>
        shelfBookIds.includes(book.id) &&
        (book.title.toLowerCase().includes(searchText.toLowerCase()) ||
          book.authors.toLowerCase().includes(searchText.toLowerCase()))
    );
  }

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or author"
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
      >
        {filteredBooks.map((book) => (
          <Book
            key={book.id}
            bookId={book.id}
            shelfId={shelfId}
            goalId={goalId}
            context={context}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Shelf;

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: "Agbalumo",
  },
});
