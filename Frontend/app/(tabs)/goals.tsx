import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GoalModal from "@/components/GoalModal";
import ProgressBar from "@/components/ProgressBar";
import Shelf from "@/components/Shelf";
import {
  createReadingGoal,
  getMyReadingGoals,
  updateReadingGoal,
  deleteReadingGoal,
  getBooksFromGoal,
} from "@/services/api";

export default function Goal() {
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");

  const fetchGoals = async () => {
    try {
      const data = await getMyReadingGoals();
      const goalsWithBooks = await Promise.all(
        data.map(async (g: any) => {
          let books = [];
          try {
            books = await getBooksFromGoal(g.reading_goal_id);
          } catch (err) {
            console.warn(`No books found for goal: ${g.title}`, err);
          }

          const progress = books.length;
          const isCompleted = progress >= g.target;

          if (isCompleted && g.active) {
            await updateReadingGoal(g.reading_goal_id, g.title, g.target);
            g.active = false;
          }

          return { ...g, books };
        })
      );
      setGoals(goalsWithBooks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const activeGoals = goals.filter((g) => g.active);
  const completedGoals = goals.filter((g) => !g.active);
  const goalsToShow = showCompleted ? completedGoals : activeGoals;

  const calculateProgress = (goalId: number) => {
    const goal = goals.find((g) => g.reading_goal_id === goalId);
    return goal?.books?.length || 0;
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle || !newGoalTarget) return;
    try {
      const newGoal = await createReadingGoal(
        newGoalTitle,
        parseInt(newGoalTarget)
      );
      setGoals((prev) => [...prev, { ...newGoal, books: [] }]);
      setNewGoalTitle("");
      setNewGoalTarget("");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedGoal) return;
    try {
      const updatedGoal = await updateReadingGoal(
        selectedGoal.reading_goal_id,
        editTitle,
        parseInt(editTarget)
      );
      setGoals((prev) =>
        prev.map((g) =>
          g.reading_goal_id === updatedGoal.reading_goal_id ? updatedGoal : g
        )
      );
      setEditModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;
    try {
      await deleteReadingGoal(selectedGoal.reading_goal_id);
      setGoals((prev) =>
        prev.filter((g) => g.reading_goal_id !== selectedGoal.reading_goal_id)
      );
      setSelectedGoal(null);
      setEditModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {selectedGoal?.title ||
          (showCompleted ? "Completed Goals" : "Current Goals")}
      </Text>

      {!selectedGoal && (
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tabButton, !showCompleted && styles.activeTab]}
            onPress={() => setShowCompleted(false)}
          >
            <Text
              style={[styles.tabText, !showCompleted && styles.activeTabText]}
            >
              Current
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, showCompleted && styles.activeTab]}
            onPress={() => setShowCompleted(true)}
          >
            <Text
              style={[styles.tabText, showCompleted && styles.activeTabText]}
            >
              Completed
            </Text>
          </Pressable>
        </View>
      )}

      {selectedGoal ? (
        <>
          <Pressable
            onPress={() => setSelectedGoal(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Pressable
            style={styles.editButton}
            onPress={() => {
              setEditTitle(selectedGoal.title);
              setEditTarget(selectedGoal.target.toString());
              setEditModalVisible(true);
            }}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>

          <View style={{ width: "90%", marginBottom: 10 }}>
            <ProgressBar
              progress={calculateProgress(selectedGoal.reading_goal_id)}
              target={selectedGoal.target}
              title={selectedGoal.title}
            />
          </View>

          <Shelf goalId={selectedGoal.reading_goal_id} context="goalShelf" />

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
            context="readBook"
          />
        </>
      ) : (
        <>
          {goalsToShow.map((goal) => (
            <Pressable
              key={goal.reading_goal_id}
              style={styles.goalButton}
              onPress={() => setSelectedGoal(goal)}
            >
              <ProgressBar
                progress={calculateProgress(goal.reading_goal_id)}
                target={goal.target}
                title={goal.title}
              />
            </Pressable>
          ))}

          {!showCompleted && (
            <Pressable
              style={styles.addGoalButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
            </Pressable>
          )}

          <GoalModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title={newGoalTitle}
            goalTarget={newGoalTarget}
            setTitle={setNewGoalTitle}
            setGoalTarget={setNewGoalTarget}
            onSave={handleAddGoal}
            buttonText="Add"
            context="readBook"
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
    backgroundColor: "#F6F2EA",
    alignItems: "center",
  },
  heading: { fontSize: 24, marginBottom: 20, fontFamily: "Agbalumo" },
  backButton: { position: "absolute", top: 30, left: 10, zIndex: 1 },
  backButtonText: { fontSize: 40, fontFamily: "Agbalumo" },
  goalButton: {
    height: 60,
    borderRadius: 20,
    marginVertical: 10,
    overflow: "hidden",
    width: "90%",
  },
  tabContainer: { flexDirection: "row", marginBottom: 20 },
  tabButton: {
    width: 165,
    paddingVertical: 10,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#8C4E24" },
  tabText: { color: "#666" },
  activeTabText: { color: "#fff", fontFamily: "Agbalumo" },
  addGoalButton: {
    marginTop: 20,
    backgroundColor: "#8C4E24",
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#8C4E24",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: { color: "#fff", fontFamily: "Agbalumo" },
});
