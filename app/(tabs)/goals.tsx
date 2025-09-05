import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Goals = () => {
  const [selected, setSelected] = useState<null | "past" | "current">(null);

  const pastGoals = [
    "Read 20 books in 2024",
    "Read 5 books I've never heard of before",
    "Read 3 books reccomended to me",
  ];
  const currentGoals = ["Can I read horror books?", "Out of my comfort zone"];

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Reading Goals</Text>

      {selected === null && (
        <View style={styles.mainView}>
          <Pressable onPress={() => setSelected("past")}>
            <Text style={styles.blocks}>Past Goals</Text>
          </Pressable>
          <Pressable onPress={() => setSelected("current")}>
            <Text style={styles.blocks}>Current Goals</Text>
          </Pressable>
        </View>
      )}

      {selected === "past" && (
        <View style={styles.pageView}>
          <Text style={styles.headingText}>Past Goals Page</Text>
          <Pressable onPress={() => setSelected(null)}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
          <View>
            <View>
              {pastGoals.map((goal, index) => (
                <Text key={index} style={styles.blocks}>
                  {goal}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {selected === "current" && (
        <View style={styles.pageView}>
          <Text style={styles.headingText}>Current Goals Page</Text>
          <Pressable onPress={() => setSelected(null)}>
            <Text style={styles.backButton}>←</Text>
          </Pressable>
          <View>
            {currentGoals.map((goal, index) => (
              <Text key={index} style={styles.blocks}>
                {goal}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDDCB9",
    paddingTop: 60,
  },
  headingText: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    textAlign: "center",
  },
  headerView: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 25,
    alignItems: "center",
    marginTop: 10,
  },
  blocks: {
    fontFamily: "Agbalumo",
    fontSize: 25,
    padding: 20,
    width: 300,
    textAlign: "center",
    backgroundColor: "brown",
    borderRadius: 20,
    color: "white",
  },
  mainView: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  pageView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    fontSize: 40,
  },
});
