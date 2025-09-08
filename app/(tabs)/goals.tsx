import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

// This page is the main goals page. It links to Current and Past goals.

const Goals = () => {
  const router = useRouter();

  const goToPastGoals = () => {
    router.push("/goals/current");
  };

  const goToCurrentGoals = () => {
    router.push("/goals/current");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Reading Goals</Text>
      <View style={styles.mainView}>
        <Pressable onPress={() => goToPastGoals()}>
          <Text style={styles.goalCategoryButton}>Past Goals</Text>
        </Pressable>
        <Pressable onPress={() => goToCurrentGoals()}>
          <Text style={styles.goalCategoryButton}>Current Goals</Text>
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
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    fontSize: 20,
  },
});
