import ProgressLine from "@/components/ProgressLine";
import booksData from "@/data/books.json";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const Log = () => {
  const params = useLocalSearchParams();
  const { bookId } = params;
  const book = booksData.books.find((b) => b.id === Number(bookId));
  if (!book) return null;

  const initialRating =
    booksData.ratings?.find((r) => r.bookId === book.id)?.rating ?? 0;

  const [chosenShelf, setChosenShelf] = useState(
    booksData.defaultShelves[0].name
  );
  const [chosenGoal, setChosenGoal] = useState("No Goal");
  const [chosenRating, setChosenRating] = useState(initialRating);

  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [pageInput, setPageInput] = useState("");

  const [logTitle, setLogTitle] = useState("");
  const [logDescription, setLogDescription] = useState("");

  const shelves = [
    ...booksData.defaultShelves.map((s) => ({ label: s.name, value: s.name })),
    ...booksData.customShelves.map((s) => ({ label: s.name, value: s.name })),
  ];

  const goals = [
    ...booksData.goals.map((g) => ({ label: g.title, value: g.id })),
    { label: "No Goal", value: 0 },
  ];

  const ratings = [1, 2, 3, 4, 5].map((r) => ({
    label: r.toString(),
    value: r,
  }));

  const bookProgressObj = booksData.readingProgress.find(
    (rp) => rp.bookId === book.id
  );
  const progressPages = bookProgressObj?.progress ?? 0;

  const logGroup = booksData.logs.find((lg) => lg.bookId === book.id);
  const [logs, setLogs] = useState(logGroup ? [...logGroup.entries] : []);

  const handleAddShelf = (shelfName: string) => {
    const shelfObj = [
      ...booksData.defaultShelves,
      ...booksData.customShelves,
    ].find((s) => s.name === shelfName);
    if (!shelfObj) return;
    const exists = booksData.shelfBooks.find(
      (sb) => sb.bookId === book.id && sb.shelfId === shelfObj.id
    );
    if (exists) {
      Alert.alert(
        "Already in shelf",
        `${book.title} is already in ${shelfName}`
      );
      return;
    }
    booksData.shelfBooks.push({ shelfId: shelfObj.id, bookId: book.id });
    Alert.alert("Added to shelf", `${book.title} added to ${shelfName}`);
  };

  const handleAddGoal = (goalValue: number) => {
    if (goalValue === 0) return;
    const exists = booksData.goalBooks.find(
      (gb) => gb.book_id === book.id && gb.goal_id === goalValue
    );
    if (exists) {
      Alert.alert("Already in goal", `${book.title} is already in this goal`);
      return;
    }
    const newId = booksData.goalBooks.length + 1;
    booksData.goalBooks.push({
      id: newId,
      goal_id: goalValue,
      book_id: book.id,
    });
    Alert.alert("Added to goal", `${book.title} added to the goal`);
  };

  const handleRatingChange = (ratingValue: number) => {
    setChosenRating(ratingValue);
    const ratingObj = booksData.ratings.find((r) => r.bookId === book.id);
    if (ratingObj) {
      ratingObj.rating = ratingValue;
    } else {
      booksData.ratings.push({ bookId: book.id, rating: ratingValue });
    }
  };

  const handleAddLog = () => {
    if (!logTitle.trim() || !logDescription.trim()) {
      Alert.alert("Error", "Please enter both title and description");
      return;
    }

    const newEntry = {
      id: logs.length + 1,
      title: logTitle,
      description: logDescription,
    };

    let logGroup = booksData.logs.find((lg) => lg.bookId === book.id);
    if (!logGroup) {
      logGroup = { bookId: book.id, entries: [] };
      booksData.logs.push(logGroup);
    }
    logGroup.entries.push(newEntry);

    setLogs([...logGroup.entries]);
    setLogTitle("");
    setLogDescription("");
    setLogModalVisible(false);
  };

  const handleUpdateProgress = () => {
    const pages = Number(pageInput);
    if (isNaN(pages) || pages < 0 || pages > book.numOfPages) {
      Alert.alert(
        "Invalid input",
        `Enter a number between 0 and ${book.numOfPages}`
      );
      return;
    }
    if (bookProgressObj) {
      bookProgressObj.progress = pages;
    } else {
      booksData.readingProgress.push({ bookId: book.id, progress: pages });
    }
    setProgressModalVisible(false);
    setPageInput("");
  };

  return (
    <ScrollView style={styles.container}>
      {progressPages > 0 && (
        <View style={{ marginBottom: 10 }}>
          <ProgressLine progress={progressPages} target={book.numOfPages} />
          <Text style={styles.progressText}>
            {progressPages}/{book.numOfPages} pages read
          </Text>
        </View>
      )}

      <Text style={styles.titleAuthor}>
        {book.title} - {book.authors}
      </Text>

      <View style={styles.row}>
        <Dropdown
          data={shelves}
          labelField="label"
          valueField="value"
          value={chosenShelf}
          onChange={(item) => {
            setChosenShelf(item.value);
            handleAddShelf(item.value);
          }}
          style={styles.dropdown}
        />
        <Dropdown
          data={goals}
          labelField="label"
          valueField="value"
          value={chosenGoal}
          onChange={(item) => {
            setChosenGoal(item.label);
            handleAddGoal(item.value);
          }}
          style={styles.dropdown}
        />
      </View>

      <View style={styles.row}>
        <Dropdown
          data={ratings}
          labelField="label"
          valueField="value"
          value={chosenRating}
          onChange={(item) => handleRatingChange(item.value)}
          style={styles.ratingDropdown}
        />
        <Pressable
          style={styles.updateButton}
          onPress={() => setProgressModalVisible(true)}
        >
          <Text style={styles.updateButtonText}>Update Progress</Text>
        </Pressable>
      </View>

      <Modal
        visible={progressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProgressModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Progress</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`Enter page (0-${book.numOfPages})`}
              keyboardType="numeric"
              value={pageInput}
              onChangeText={setPageInput}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButton}
                onPress={handleUpdateProgress}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#B35B5B" }]}
                onPress={() => setProgressModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Log Button */}
      <Pressable
        style={styles.addLogButton}
        onPress={() => setLogModalVisible(true)}
      >
        <Text style={styles.addLogText}>Add Log</Text>
      </Pressable>

      {/* Modal for Add Log */}
      <Modal
        visible={logModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLogModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Log</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Log Title"
              value={logTitle}
              onChangeText={setLogTitle}
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Log Description"
              multiline
              value={logDescription}
              onChangeText={setLogDescription}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleAddLog}>
                <Text style={styles.modalButtonText}>Add</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: "#B35B5B" }]}
                onPress={() => setLogModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logs */}
      <View style={styles.logsContainer}>
        {logs.map((log) => (
          <View key={log.id} style={styles.logEntry}>
            <Text style={styles.logTitle}>{log.title}</Text>
            <Text style={styles.logDescription}>{log.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Log;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F2EA",
    marginTop: 60,
  },
  progressText: {
    fontSize: 14,
    color: "#5A5D37",
    marginBottom: 15,
    fontFamily: "Agbalumo",
  },
  titleAuthor: {
    fontSize: 20,
    fontFamily: "Agbalumo",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#725437",
    borderRadius: 10,
    paddingHorizontal: 6,
    height: 40,
  },
  ratingDropdown: {
    width: 120,
    backgroundColor: "#725437",
    borderRadius: 10,
    paddingHorizontal: 6,
    height: 40,
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#985325",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonText: { color: "#FFF", fontFamily: "Agbalumo" },
  addLogButton: {
    backgroundColor: "#CCB452",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  addLogText: { color: "#000", fontFamily: "Agbalumo" },
  logsContainer: { marginTop: 10, gap: 5 },
  logEntry: {
    marginBottom: 10,
    backgroundColor: "#BDB59F",
    padding: 10,
    borderRadius: 20,
  },
  logTitle: {
    fontSize: 16,
    fontFamily: "Agbalumo",
    color: "#333",
    marginBottom: 4,
  },
  logDescription: {
    fontSize: 14,
    fontFamily: "Agbalumo",
    color: "#555",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontFamily: "Agbalumo", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: "Agbalumo",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 1,
    backgroundColor: "#5A5D37",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalButtonText: { color: "#FFF", fontFamily: "Agbalumo" },
});
