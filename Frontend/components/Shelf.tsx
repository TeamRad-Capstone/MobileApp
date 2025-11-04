import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TextInput } from "react-native";
import Book from "@/components/Book";
import { getBooksFromShelf, getBooksFromGoal } from "@/services/api";

type ShelfProps = { goalId?: number; context?: string };

const Shelf = ({ goalId, context }: ShelfProps) => {
  const [books, setBooks] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
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
    fetchBooks();
  }, [goalId]);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchText.toLowerCase()) ||
      b.authors?.join(", ").toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <TextInput
        style={styles.search}
        placeholder="Search books..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredBooks.map((book) => (
          <Book
            key={book.google_book_id}
            book={book}
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
  search: {
    height: 40,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: "Agbalumo",
    backgroundColor: "#F6F2EA",
  },
});
