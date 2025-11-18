import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import Book from "@/components/Book";
import { getBooksFromShelf, getBooksFromGoal } from "@/services/api";
import { router } from "expo-router";

type ShelfProps = { goalId?: number; context?: string };

const Shelf = ({ goalId, context }: ShelfProps) => {
  const [books, setBooks] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchBooks = async () => {
    try {
      const data = goalId
        ? await getBooksFromGoal(goalId)
        : await getBooksFromShelf("Read");
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [goalId]);

  const filteredBooks = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(searchText.toLowerCase()) ||
        b.authors?.join(", ").toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.date_read || !b.date_read) return 0;
      return sortAsc
        ? new Date(a.date_read).getTime() - new Date(b.date_read).getTime()
        : new Date(b.date_read).getTime() - new Date(a.date_read).getTime();
    });

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <TextInput
        style={styles.search}
        placeholder="Search books..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.sortRow}>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortAsc(!sortAsc)}
        >
          <Text style={styles.sortText}>
            Sort by Date Read: {sortAsc ? "Ascending" : "Descending"}
          </Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredBooks.map((book) => (
          <Book
            key={book.google_book_id || book.book_id}
            book={book}
            goalId={goalId}
            context={context}
            onRemoved={() => {
              fetchBooks();
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Shelf;

const styles = StyleSheet.create({
  search: {
    height: 40,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: "Agbalumo",
    backgroundColor: "#F6F2EA",
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#E0DCD3",
    borderRadius: 12,
  },
  sortText: {
    fontFamily: "Agbalumo",
    color: "#333",
  },
});
