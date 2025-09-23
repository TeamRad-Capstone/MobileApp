import ProgressLine from "@/components/ProgressLine";
import booksData from "@/data/books.json";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

const BookDetails = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { bookId } = useLocalSearchParams();

  const book = booksData.books.find((b) => b.id === Number(bookId));
  if (!book) return null;

  const authorList = book.authors.toString().split(",");
  const rating = booksData.ratings?.find((r) => r.bookId === book.id)?.rating;

  const shelves = [
    ...booksData.defaultShelves.map((s) => ({ label: s.name, value: s.id })),
    ...booksData.customShelves.map((s) => ({ label: s.name, value: s.id })),
  ];
  const [chosenShelf, setChosenShelf] = useState(shelves[0].label);

  const handleAdd = (shelf: string) => {
    alert(`Added "${book.title}" to shelf: ${shelf}`);
  };

  const goToLog = () => {
    router.push({ pathname: "/(tabs)/log", params: { bookId } });
  };

  const bookProgressObj = booksData.readingProgress.find(
    (rp) => rp.bookId === book.id
  );
  const progressPages = bookProgressObj?.progress ?? 0;

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <Pressable onPress={() => router.push("/(tabs)/search")}>
        <Image
          style={styles.backButton}
          source={require("@/assets/icons/back-arrow.png")}
        />
      </Pressable>

      <View style={styles.bookContainer}>
        <Image
          style={styles.bookCover}
          source={
            book.coverUrl
              ? { uri: book.coverUrl }
              : require("@/assets/images/books/cover-not-found.jpg")
          }
        />

        <View style={styles.bookInfo}>
          <View style={styles.topInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{authorList.join(", ")}</Text>
            <Text style={styles.bookPages}>{book.numOfPages} Pages</Text>
            <Text style={styles.genre}>{book.category}</Text>
            {rating !== undefined && (
              <Text style={styles.stars}>
                {"★".repeat(rating) + "☆".repeat(5 - rating)}
              </Text>
            )}
            {progressPages > 0 && (
              <View style={{ marginTop: 8, width: 200 }}>
                <ProgressLine
                  progress={progressPages}
                  target={book.numOfPages}
                />
                <Text style={styles.progressText}>
                  {progressPages}/{book.numOfPages} pages read
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomActions}>
            <Pressable style={styles.logButton} onPress={goToLog}>
              <Text style={styles.logButtonText}>Log</Text>
            </Pressable>

            <Dropdown
              maxHeight={60}
              iconColor={"white"}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={{ textAlign: "center", color: "white" }}
              itemTextStyle={{ textAlign: "center", color: "white" }}
              data={shelves}
              fontFamily={"Agbalumo"}
              labelField={"label"}
              valueField={"value"}
              onChange={(item) => {
                handleAdd(item.label);
                setChosenShelf(item.label);
              }}
              value={chosenShelf}
              placeholder={"Add to Shelf"}
            />
          </View>
        </View>
      </View>

      <Text style={styles.descriptionHeader}>Description</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.description}>{book.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, backgroundColor: "#F4F4E6" },
  backButton: { width: 30, height: 30, marginBottom: 15 },
  bookContainer: { flexDirection: "row", gap: 15 },
  bookCover: { width: 160, height: 240, borderRadius: 5 },
  bookInfo: { flex: 1, justifyContent: "space-between" },
  topInfo: {},
  bookTitle: { fontSize: 20, fontFamily: "Agbalumo" },
  bookAuthor: { fontSize: 14, fontFamily: "Agbalumo", color: "#555" },
  bookPages: {
    fontSize: 12,
    fontFamily: "Agbalumo",
    color: "#777",
    marginTop: 2,
  },
  genre: {
    fontSize: 12,
    fontFamily: "Agbalumo",
    color: "#888",
    marginVertical: 2,
  },
  stars: { fontSize: 16, marginVertical: 2 },
  progressText: {
    fontSize: 14,
    color: "#5A5D37",
    marginTop: 4,
    fontFamily: "Agbalumo",
  },
  bottomActions: { marginTop: 8 },
  logButton: {
    backgroundColor: "#985325",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 5,
    width: 200,
  },
  logButtonText: { color: "white", fontFamily: "Agbalumo", fontSize: 14 },
  dropdown: {
    backgroundColor: "#725437",
    borderRadius: 8,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
    width: 200,
  },
  dropdownContainer: { backgroundColor: "#725437", borderRadius: 8 },
  descriptionHeader: {
    paddingTop: 15,
    fontFamily: "Agbalumo",
    fontSize: 18,
    marginBottom: 8,
  },
  description: { fontFamily: "Agbalumo", fontSize: 14, marginRight: 10 },
});
