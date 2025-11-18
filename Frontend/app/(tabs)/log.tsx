// Log.tsx
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ProgressLine from "@/components/ProgressLine";
import {
  getBooksFromShelf,
  getAllBooks,
  getMyReadingGoals,
  addBookToReadingGoal,
  updateBookRating,
  createLog,
  getLogsForBook,
  updateLog,
  deleteLog,
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
  const { bookId, shelfName } = params;

  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [readBooks, setReadBooks] = useState<BookType[]>([]);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [statusMsg, setStatusMsg] = useState("Loading...");
  const [matchedBook, setMatchedBook] = useState<BookType | null>(null);
  const [readShelfBook, setReadShelfBook] = useState<BookType | null>(null);
  const [chosenGoal, setChosenGoal] = useState<number | null>(null);
  const [chosenRating, setChosenRating] = useState<number>(0);
  const [chosenShelf, setChosenShelf] = useState<string | null>(null);

  type LogType = {
    log_id: number;
    title: string;
    text?: string;
  };

  const [logs, setLogs] = useState<LogType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogType | null>(null);

  const [logTitle, setLogTitle] = useState("");
  const [logText, setLogText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allBooks = await getAllBooks();
        const readShelf = await getBooksFromShelf(shelfName as string);
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

        try {
          const bookLogs = await getLogsForBook(book.book_id);
          setLogs(bookLogs);
        } catch {
          setLogs([]);
        }

        setStatusMsg("");
      } catch {
        setStatusMsg("Failed to fetch data");
      }
    };

    fetchData();
  }, [bookId]);

  const handleAddToGoal = async (goalId: number) => {
    if (!matchedBook) return;
    await addBookToReadingGoal(goalId, matchedBook.book_id);
  };

  const handleRatingChange = async (rating: number) => {
    if (!readShelfBook) return;
    setChosenRating(rating);
    await updateBookRating(readShelfBook.book_id, rating);
  };

  const handleAddLog = async () => {
    if (!logTitle || !matchedBook) return;

    try {
      if (editingLogId) {
        const updatedLog = await updateLog(editingLogId, {
          title: logTitle,
          text: logText,
        });

        setLogs((prev) =>
          prev.map((l) => (l.log_id === editingLogId ? updatedLog : l))
        );

        setEditingLogId(null);
      } else {
        const newLog = await createLog(matchedBook.book_id, {
          title: logTitle,
          text: logText,
        });
        setLogs((prev) => [...prev, newLog]);
      }

      setModalVisible(false);
      setLogTitle("");
      setLogText("");
    } catch {}
  };

  const handleDeleteLog = async () => {
    if (!selectedLog) return;
    await deleteLog(selectedLog.log_id);
    setLogs((prev) => prev.filter((l) => l.log_id !== selectedLog.log_id));
    setOptionModalVisible(false);
  };

  if (statusMsg)
    return <Text style={[styles.center, { marginTop: 200 }]}>{statusMsg}</Text>;

  const goalDropdownData = goals.map((g) => ({
    label: g.title,
    value: g.reading_goal_id,
  }));

  const shelfDropdownData = [
    { label: "Want to Read", value: "Want" },
    { label: "Reading", value: "Reading" },
    { label: "Read", value: "Read" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {matchedBook?.progress &&
        matchedBook.progress > 0 &&
        shelfName === "Currently Reading" && (
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

      <View style={styles.dropdownRow}>
        {shelfName != "Dropped" && shelfName != "Currently Reading" && (
          <Dropdown
            data={goalDropdownData}
            labelField="label"
            valueField="value"
            value={chosenGoal}
            placeholder="Select a goal"
            onChange={(item) => handleAddToGoal(item.value)}
            style={[styles.dropdown, { flex: 1, marginRight: 5 }]}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownText}
            iconColor="#FFF"
          />
        )}

        <Dropdown
          data={shelfDropdownData}
          labelField="label"
          valueField="value"
          value={chosenShelf}
          placeholder="Select a shelf"
          onChange={(item) => setChosenShelf(item.value)}
          style={[styles.dropdown, { flex: 1, marginLeft: 5 }]}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownText}
          iconColor="#FFF"
        />
      </View>

      {shelfName != "Dropped" && shelfName != "Currently Reading" && (
        <View style={styles.ratingRow}>
          <Dropdown
            data={[1, 2, 3, 4, 5].map((n) => ({
              label: "★".repeat(n),
              value: n,
            }))}
            labelField="label"
            valueField="value"
            value={chosenRating}
            placeholder="Rating"
            onChange={(item) => handleRatingChange(item.value)}
            style={[styles.dropdown, { width: 150 }]}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownText}
            iconColor="#FFF"
          />
        </View>
      )}

      <View style={styles.logWrapper}>
        <Pressable
          style={[styles.headerBtn, { width: "100%", marginBottom: 15 }]}
          onPress={() => {
            setEditingLogId(null);
            setLogTitle("");
            setLogText("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.headerBtnText}>Add Log</Text>
        </Pressable>

        {logs.map((log) => (
          <View key={log.log_id} style={styles.logRow}>
            <Text style={styles.logRowText}>
              {log.title}
              {"\n"}
              {log.text}
            </Text>

            <Pressable
              style={styles.editBtn}
              onPress={() => {
                setSelectedLog(log);
                setOptionModalVisible(true);
              }}
            >
              <Text style={styles.editBtnText}>…</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingLogId ? "Edit Log" : "New Log Entry"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={logTitle}
              onChangeText={setLogTitle}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Text"
              value={logText}
              multiline
              onChangeText={setLogText}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.headerBtn, { flex: 1, marginRight: 5 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.headerBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.headerBtn, { flex: 1, marginLeft: 5 }]}
                onPress={handleAddLog}
              >
                <Text style={styles.headerBtnText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={optionModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Options</Text>

            <Pressable
              style={[styles.headerBtn, { marginBottom: 10 }]}
              onPress={() => {
                if (!selectedLog) return;
                setEditingLogId(selectedLog.log_id);
                setLogTitle(selectedLog.title);
                setLogText(selectedLog.text || "");
                setOptionModalVisible(false);
                setModalVisible(true);
              }}
            >
              <Text style={styles.headerBtnText}>Edit</Text>
            </Pressable>

            <Pressable
              style={[styles.headerBtn, { backgroundColor: "#8A2A2A" }]}
              onPress={handleDeleteLog}
            >
              <Text style={styles.headerBtnText}>Delete</Text>
            </Pressable>

            <Pressable
              style={[styles.headerBtn, { marginTop: 15 }]}
              onPress={() => setOptionModalVisible(false)}
            >
              <Text style={styles.headerBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  dropdownRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#797D49",
    borderRadius: 20,
  },
  dropdownPlaceholder: { color: "#fff", fontFamily: "Agbalumo" },
  dropdownText: { color: "#fff", fontFamily: "Agbalumo" },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    gap: 15,
  },
  logWrapper: {
    width: "100%",
    backgroundColor: "#BDB59F",
    padding: 20,
    borderRadius: 12,
    gap: 15,
    marginBottom: 30,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FCF7E9",
    padding: 15,
    borderRadius: 10,
  },
  logRowText: {
    fontFamily: "Agbalumo",
    color: "#4B3F2F",
    fontSize: 16,
  },
  editBtn: {
    backgroundColor: "#6B5E4E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editBtnText: {
    color: "#FFF",
    fontFamily: "Agbalumo",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#F6F2EA",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Agbalumo",
    marginBottom: 15,
    color: "#4B3F2F",
  },
  input: {
    backgroundColor: "#E0DCD3",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerBtn: {
    backgroundColor: "#4B3F2F",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  headerBtnText: {
    color: "#FFF",
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
});
