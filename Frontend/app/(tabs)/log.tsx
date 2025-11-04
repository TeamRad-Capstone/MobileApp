import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ProgressLine from "@/components/ProgressLine";
import {
  getBooksFromShelf,
  getAllBooks,
  getMyReadingGoals,
  addBookToReadingGoal,
  updateBookRating,
} from "@/services/api";

type BookType = {
  google_book_id: string;
  book_id: number;
  title: string;
  authors: string[];
  rating?: number;
  progress?: number;
  pages?: number;
};

type GoalType = {
  reading_goal_id: number;
  title: string;
};

const Log = () => {
  const params = useLocalSearchParams();
  const { bookId } = params;

  const [readBooks, setReadBooks] = useState<BookType[]>([]);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [statusMsg, setStatusMsg] = useState("Loading...");
  const [matchedBook, setMatchedBook] = useState<BookType | null>(null);
  const [readShelfBook, setReadShelfBook] = useState<BookType | null>(null);
  const [chosenGoal, setChosenGoal] = useState<number | null>(null);
  const [chosenRating, setChosenRating] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooks = await getAllBooks();
        const readShelf = await getBooksFromShelf("Read");
        setReadBooks(readShelf);

        const book = allBooks.find(
          (b: BookType) => b.google_book_id === bookId
        );
        if (!book) return setStatusMsg("Book not found");

        setMatchedBook(book);

        const readEntry = readShelf.find(
          (b: BookType) => b.google_book_id === book.google_book_id
        );
        if (!readEntry) return setStatusMsg("Book is not in Read shelf");

        setReadShelfBook(readEntry);
        setChosenRating(readEntry.rating || 0);

        const myGoals = await getMyReadingGoals();
        setGoals(myGoals);

        setStatusMsg("");
      } catch (err) {
        console.error(err);
        setStatusMsg("Failed to fetch data");
      }
    };
    fetchData();
  }, [bookId]);

  const handleAddToGoal = async () => {
    if (!matchedBook || !chosenGoal) return Alert.alert("Select a goal");
    try {
      await addBookToReadingGoal(chosenGoal, matchedBook.book_id);
      Alert.alert("Added", "Book added to goal");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add book to goal");
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!readShelfBook) return;
    setChosenRating(rating);

    try {
      await updateBookRating(readShelfBook.book_id, rating);
      Alert.alert("Success", "Rating updated");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update rating");
    }
  };

  if (statusMsg)
    return <Text style={[styles.center, { marginTop: 200 }]}>{statusMsg}</Text>;

  const goalDropdownData = goals.map((g: GoalType) => ({
    label: g.title,
    value: g.reading_goal_id,
  }));

  const renderStars = () => (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => handleRatingChange(i)}>
          <Text style={[styles.star, i <= chosenRating && styles.starSelected]}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {matchedBook?.progress && matchedBook.progress > 0 && (
        <View style={{ marginBottom: 30, width: "90%" }}>
          <ProgressLine
            progress={matchedBook.progress}
            target={matchedBook.pages || 100}
          />
          <Text style={styles.progressText}>
            {matchedBook.progress}/{matchedBook.pages || 100} pages read
          </Text>
        </View>
      )}

      <Text style={styles.title}>{matchedBook?.title}</Text>
      <Text style={styles.author}>{matchedBook?.authors.join(", ")}</Text>

      <Text style={styles.subtitle}>Add to Reading Goal:</Text>
      <Dropdown
        data={goalDropdownData}
        labelField="label"
        valueField="value"
        value={chosenGoal}
        placeholder="Select a goal"
        onChange={(item) => setChosenGoal(item.value)}
        style={styles.dropdown}
        placeholderStyle={styles.dropdownPlaceholder}
        selectedTextStyle={styles.dropdownText}
      />
      <Pressable style={styles.addButton} onPress={handleAddToGoal}>
        <Text style={styles.addButtonText}>Add to Goal</Text>
      </Pressable>

      <Text style={styles.subtitle}>Rate this book:</Text>
      {renderStars()}
    </ScrollView>
  );
};

export default Log;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 25,
    backgroundColor: "#F6F2EA",
    alignItems: "center",
  },
  center: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  progressText: { fontSize: 15, marginTop: 8, color: "#555" },
  title: {
    fontSize: 28,
    fontFamily: "Agbalumo",
    textAlign: "center",
    color: "#4B3F2F",
    marginBottom: 5,
  },
  author: {
    fontSize: 17,
    fontFamily: "Agbalumo",
    textAlign: "center",
    color: "#6B5E4E",
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Agbalumo",
    color: "#4B3F2F",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  dropdown: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#E0DCD3",
    marginBottom: 20,
  },
  dropdownPlaceholder: { color: "#AAA", fontFamily: "Agbalumo" },
  dropdownText: { color: "#333", fontFamily: "Agbalumo" },
  addButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#725437",
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: { color: "#fff", fontSize: 16, fontFamily: "Agbalumo" },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  star: { fontSize: 42, color: "#CCC", marginHorizontal: 6 },
  starSelected: { color: "#FFD700" },
});
