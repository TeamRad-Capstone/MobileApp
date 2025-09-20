import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

const Log = () => {
  const params = useLocalSearchParams();
  const { title, author } = params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
    </ScrollView>
  );
};

export default Log;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F6F2EA" },
  title: { fontSize: 24, color: "#5A5D37", marginBottom: 5 },
  author: { fontSize: 18, color: "#797D49" },
});
