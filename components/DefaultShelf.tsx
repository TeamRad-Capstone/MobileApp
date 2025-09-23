import { StyleSheet, View, Text, Pressable } from "react-native";
import { Shelf } from "@/services/api";
import { useRouter } from "expo-router";

const DefaultShelf = ({ end_user_id, shelf_id, shelf_name }: Shelf) => {
  const router = useRouter();

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        router.push("/(tabs)/(shelf)/[shelf_book]");
      }}
    >
      <Text style={styles.shelfTitle}>{shelf_name}</Text>
    </Pressable>
  );
};

export default DefaultShelf;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#83884E",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40%"
  },
  shelfTitle: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
});
