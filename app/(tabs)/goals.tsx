import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

// This page is the main goals page. It links to Current and Past goals.

const Goals = () => {
  const router = useRouter();

  const goToPastGoals = () => {
    console.log("Navigating to Current Goals");
    router.push("/(tabs)/(goals)/current");
  };

  const goToCurrentGoals = () => {
    console.log("Navigating to Current Goals");
    router.push("/(tabs)/(goals)/current");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reading Goals</Text>
      <View style={styles.mainView}>
        <Pressable onPress={goToPastGoals} style={styles.goalCategoryButton}>
          <Text style={styles.goalCategoryText}>Past Goals</Text>
        </Pressable>
        <Pressable onPress={goToCurrentGoals} style={styles.goalCategoryButton}>
          <Text style={styles.goalCategoryText}>Current Goals</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Goals;

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
  mainView: {
    alignItems: "center",
    marginTop: 20,
  },
  goalCategoryButton: {
    backgroundColor: "#BE6A53",
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
    width: 350,
    alignItems: "center",
  },
  goalCategoryText: {
    fontSize: 20,
    fontFamily: "Agbalumo",
    textAlign: "center",
  },
});
