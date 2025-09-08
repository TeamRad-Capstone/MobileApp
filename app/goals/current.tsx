import Shelf from "@/components/Shelf";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// This page displays current reading goals. It shows a list of goals, and when one is selected, it shows the books associated with that goal.

// placeholder data
const currentGoals = [
  {
    name: "Read 365 Books in 2025",
    books: [
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
    ],
  },
  {
    name: "Read 5 Horror Books",
    books: [
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
      { coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg" },
    ],
  },
];

export default function Current() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<
    null | (typeof currentGoals)[0]
  >(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Current Goals</Text>

      {selectedGoal ? (
        <>
          <Pressable onPress={() => setSelectedGoal(null)}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
          <Text style={styles.subHeading}>{selectedGoal.name}</Text>
          <Shelf books={selectedGoal.books} />
        </>
      ) : (
        currentGoals.map((goal, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedGoal(goal)}
            style={styles.goalButton}
          >
            <Text style={styles.goalText}>{goal.name}</Text>
          </Pressable>
        ))
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    marginVertical: 10,
  },
  backButton: {
    fontSize: 40,
  },
  goalButton: {
    backgroundColor: "#BE6A53",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    width: 350,
    alignItems: "center",
  },
  goalText: {
    fontSize: 20,
  },
});
