import GoalModal from "@/components/GoalModal";
import ProgressBar from "@/components/ProgressBar";
import Shelf from "@/components/Shelf";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// This is the Goals Page. It displays current reading goals and allows users to add/edit goals. When a goal is selected, it shows books associated with that goal.

export const options = {
  headerShown: false,
  animation: "none",
};

const currentGoals = [
  {
    id: 1,
    title: "Read 365 Books in 2025",
    target: 365,
    progress: 100,
    status: "active",
  },
  {
    id: 2,
    title: "Read 5 Horror Books",
    target: 5,
    progress: 3,
    status: "active",
  },
];

const books = [
  {
    id: 1,
    title: "Lord of The Rings",
    authors: "J.R.R Tolkien",
    coverUrl: "https://covers.openlibrary.org/b/olid/OL51711484M-L.jpg",
    description:
      "An epic fantasy adventure in Middle-earth following Frodo and the Fellowship.",
    numOfPages: 1216,
    categories: ["Fantasy"],
    publishedDate: "1954-07-29",
    rating: 5,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    authors: "Harper Lee",
    coverUrl: "",
    description:
      "A story of racial injustice and childhood innocence in the Deep South.",
    numOfPages: 336,
    categories: ["Fiction"],
    publishedDate: "1960-07-11",
    rating: 5,
  },
  {
    id: 3,
    title: "Funny Story",
    authors: "Emily Henry",
    coverUrl: "https://covers.openlibrary.org/b/olid/OL57586063M-L.jpg",
    description:
      "A witty, heartwarming tale of love, friendship, and unexpected adventures.",
    numOfPages: 400,
    categories: ["Romance"],
    publishedDate: "2021-05-18",
    rating: 4,
  },
  {
    id: 4,
    title: "Love Hypothesis",
    authors: "Ali Hazelwood",
    coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg",
    description:
      "A STEM romance between a grad student and her colleague, full of humor and chemistry.",
    numOfPages: 384,
    categories: ["Romance"],
    publishedDate: "2021-09-14",
    rating: 4,
  },
  {
    id: 5,
    title: "The Wedding People",
    authors: "Alison Espach",
    coverUrl: "https://covers.openlibrary.org/b/olid/OL51587376M-L.jpg",
    description:
      "A heartfelt novel exploring love, weddings, and relationships in modern life.",
    numOfPages: 320,
    categories: ["Romance"],
    publishedDate: "2019-02-01",
    rating: 3,
  },
  {
    id: 6,
    title: "Weyward",
    authors: "Emilia Hart",
    coverUrl:
      "https://ia601909.us.archive.org/view_archive.php?archive=/31/items/l_covers_0013/l_covers_0013_19.zip&file=0013194003-L.jpg",
    description:
      "A dark, captivating fantasy tale of secrets, betrayal, and courage.",
    numOfPages: 420,
    categories: ["Fantasy"],
    publishedDate: "2020-08-15",
    rating: 4,
  },
  {
    id: 7,
    title: "The Bear and The Nightingale",
    authors: "Katherine Arden",
    coverUrl: "https://covers.openlibrary.org/b/olid/OL28632654M-L.jpg",
    description:
      "A magical Russian-inspired folklore story with winter, spirits, and courage.",
    numOfPages: 448,
    categories: ["Fantasy"],
    publishedDate: "2017-01-10",
    rating: 5,
  },
];

const goalBooks = [
  { id: 1, goal_id: 1, book_id: 1 },
  { id: 2, goal_id: 1, book_id: 2 },
  { id: 3, goal_id: 1, book_id: 3 },
  { id: 4, goal_id: 2, book_id: 4 },
  { id: 5, goal_id: 2, book_id: 5 },
  { id: 6, goal_id: 2, book_id: 6 },
];

export default function Goal() {
  const router = useRouter();

  const [selectedGoal, setSelectedGoal] = useState<
    null | (typeof currentGoals)[0]
  >(null);

  const [goals, setGoals] = useState(currentGoals);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");

  // Get books associated with the selected goal. Returns an array of book objects.
  const getBooksForGoal = (goalId: number) => {
    const bookIds = goalBooks
      .filter((gb) => gb.goal_id === goalId)
      .map((gb) => gb.book_id);
    return books.filter((b) => bookIds.includes(b.id));
  };

  // add goal function. creates a new goal object and adds to goal state. resets input fields and closes modal.
  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) return;
    const newGoal = {
      id: goals.length + 1,
      title: newGoalTitle,
      target: parseInt(newGoalTarget),
      progress: 0,
      status: "active",
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle("");
    setNewGoalTarget("");
    setModalVisible(false);
  };

  // save edits to goal function. updates selected goal and goals state. closes modal.
  const handleSaveEdit = () => {
    if (!selectedGoal) return; //
    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, title: editTitle, target: parseInt(editTarget) }
          : g
      )
    );
    setSelectedGoal({
      ...selectedGoal,
      title: editTitle,
      target: parseInt(editTarget),
    });
    setEditModalVisible(false);
  };

  // delete goal function. removes selected goal from goals state. resets selected goal and closes modal.
  const handleDeleteGoal = () => {
    if (!selectedGoal) return;
    setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
    setSelectedGoal(null);
    setEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {selectedGoal?.title || "Current Goals"}
      </Text>

      {/* when goal is selected it shows books associated with that goal */}
      {selectedGoal ? (
        <>
          {/* back button */}
          <Pressable
            onPress={() => setSelectedGoal(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          {/* edit button */}
          <Pressable
            onPress={() => {
              setEditTitle(selectedGoal.title);
              setEditTarget(selectedGoal.target.toString());
              setEditModalVisible(true);
            }}
          >
            <Text>Edit</Text>
          </Pressable>

          {/* edit goal modal */}
          <GoalModal
            visible={editModalVisible}
            onClose={() => setEditModalVisible(false)}
            title={editTitle}
            goalTarget={editTarget}
            setTitle={setEditTitle}
            setGoalTarget={setEditTarget}
            onSave={handleSaveEdit}
            onDelete={handleDeleteGoal}
            buttonText="Save"
          />

          {/* books for selected goal */}
          <Shelf
            books={getBooksForGoal(selectedGoal.id).map((b) => ({
              title: b.title,
              authors: Array.isArray(b.authors) ? b.authors : [b.authors],
              coverUrl: b.coverUrl,
              description: b.description,
              numOfPages: b.numOfPages,
              categories: Array.isArray(b.categories)
                ? b.categories
                : [b.categories],
              publishedDate: b.publishedDate,
            }))}
            context="goalPage"
          />
        </>
      ) : (
        // when no goal is selected it shows the list of goals
        <>
          {/* list of goals */}
          {goals.map((goal, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedGoal(goal)}
              style={styles.goalButton}
            >
              {/* progress bar for each goal */}
              <ProgressBar
                progress={goal.progress}
                target={goal.target}
                title={goal.title}
              />
            </Pressable>
          ))}

          {/* button to add new goal */}
          <Pressable
            onPress={() => setModalVisible(true)}
            style={styles.addGoalButton}
          >
            <Text style={{ color: "#fff", fontFamily: "Agbalumo" }}>
              Add Goal
            </Text>
          </Pressable>

          {/* add goal modal */}
          <GoalModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title={newGoalTitle}
            goalTarget={newGoalTarget}
            setTitle={setNewGoalTitle}
            setGoalTarget={setNewGoalTarget}
            onSave={handleAddGoal}
            buttonText="Add"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#FDDCB9",
    alignItems: "center",
  },
  heading: { fontSize: 24, marginBottom: 20, fontFamily: "Agbalumo" },
  backButton: { position: "absolute", top: 30, left: 10, zIndex: 1 },
  backButtonText: { fontSize: 40, fontFamily: "Agbalumo" },
  goalButton: {
    height: 60,
    borderRadius: 20,
    marginVertical: 10,
    width: 350,
    overflow: "hidden",
  },
  addGoalButton: {
    marginTop: 20,
    backgroundColor: "#BE6A53",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
