import GoalModal from "@/components/GoalModal";
import ProgressBar from "@/components/ProgressBar";
import ProgressLine from "@/components/ProgressLine";
import Shelf from "@/components/Shelf";
import booksData from "@/data/books.json";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Goal() {
  const [selectedGoal, setSelectedGoal] = useState<
    null | (typeof booksData.goals)[0]
  >(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");

  const activeGoals = booksData.goals.filter((g) => g.active);
  const completedGoals = booksData.goals.filter((g) => !g.active);
  const goalsToShow = showCompleted ? completedGoals : activeGoals;

  const calculateProgress = (goalId: number) => {
    return booksData.goalBooks.filter((gb) => gb.goal_id === goalId).length;
  };

  const handleAddGoal = () => {
    if (!newGoalTitle || !newGoalTarget) return;
    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      target: parseInt(newGoalTarget),
      active: true,
    };
    booksData.goals.push(newGoal);
    setNewGoalTitle("");
    setNewGoalTarget("");
    setModalVisible(false);
  };

  const handleSaveEdit = () => {
    if (!selectedGoal) return;
    const idx = booksData.goals.findIndex((g) => g.id === selectedGoal.id);
    if (idx > -1) {
      booksData.goals[idx] = {
        ...booksData.goals[idx],
        title: editTitle,
        target: parseInt(editTarget),
      };
    }
    setEditModalVisible(false);
  };

  const handleDeleteGoal = () => {
    if (!selectedGoal) return;
    const idx = booksData.goals.findIndex((g) => g.id === selectedGoal.id);
    if (idx > -1) booksData.goals.splice(idx, 1);
    setSelectedGoal(null);
    setEditModalVisible(false);
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

          <View style={styles.progressContainer}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <ProgressLine
                progress={calculateProgress(selectedGoal.id)}
                target={selectedGoal.target}
                title={selectedGoal.title}
              />
            </View>
            <Text style={{ fontFamily: "Agbalumo", fontSize: 14 }}>
              {
                booksData.goalBooks.filter(
                  (gb) => gb.goal_id === selectedGoal.id
                ).length
              }
              /{selectedGoal.target}
            </Text>
          </View>

          <Shelf goalId={selectedGoal.id} context="goalShelf" />

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
              key={goal.id}
              style={styles.goalButton}
              onPress={() => setSelectedGoal(goal)}
            >
              <ProgressBar
                progress={calculateProgress(goal.id)}
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "90%",
    height: 40,
  },
});
