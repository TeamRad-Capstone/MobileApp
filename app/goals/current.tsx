import Shelf from "@/components/Shelf";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// This page displays current reading goals. It shows a list of goals, and when one is selected, it shows the books associated with that goal.

export const options = {
  headerShown: false,
  animation: "none",
};

// placeholder data
const currentGoals = [
  {
    name: "Read 365 Books in 2025",
    books: [
      {
        title: "Lord of The Rings",
        author: "J.R.R Tolkien",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL51711484M-L.jpg",
      },
      { title: "To Kill a Mockingbird", author: "Harper Lee", coverUrl: "" },
      {
        title: "Funny Story",
        author: "Emily Henry",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL57586063M-L.jpg",
      },
      {
        title: "Love Hypothesis",
        author: "Ali Hazelwood",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg",
      },
      {
        title: "The Wedding People",
        author: "Alison Espach",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL51587376M-L.jpg",
      },
      {
        title: "Weyward",
        author: "Emilia Hart",
        coverUrl:
          "https://ia601909.us.archive.org/view_archive.php?archive=/31/items/l_covers_0013/l_covers_0013_19.zip&file=0013194003-L.jpg",
      },
      {
        title: "The Bear and The Nightingale",
        author: "Katherine Arden",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL28632654M-L.jpg",
      },
    ],
  },
  {
    name: "Read 5 Horror Books",
    books: [
      {
        title: "Lord of The Rings",
        author: "J.R.R Tolkien",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL51711484M-L.jpg",
      },
      { title: "To Kill a Mockingbird", author: "Harper Lee", coverUrl: "" },
      {
        title: "Funny Story",
        author: "Emily Henry",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL57586063M-L.jpg",
      },
      {
        title: "Love Hypothesis",
        author: "Ali Hazelwood",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg",
      },
      {
        title: "The Wedding People",
        author: "Alison Espach",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL51587376M-L.jpg",
      },
      {
        title: "Weyward",
        author: "Emilia Hart",
        coverUrl:
          "https://ia601909.us.archive.org/view_archive.php?archive=/31/items/l_covers_0013/l_covers_0013_19.zip&file=0013194003-L.jpg",
      },
      {
        title: "The Bear and The Nightingale",
        author: "Katherine Arden",
        coverUrl: "https://covers.openlibrary.org/b/olid/OL28632654M-L.jpg",
      },
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
      <Text style={styles.heading}>
        {selectedGoal?.name || "Current Goals"}
      </Text>

      {selectedGoal ? (
        <>
          <Pressable
            onPress={() => setSelectedGoal(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
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
    marginBottom: 20,
    fontFamily: "Agbalumo",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 40,
    fontFamily: "Agbalumo",
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
    fontFamily: "Agbalumo",
  },
});
