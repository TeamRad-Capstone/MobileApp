import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllBooks, getMyReadingGoals } from "@/services/api";

const Stats = () => {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalGoals: 0,
    completedGoals: 0,
    totalPagesRead: 0,
    uniqueAuthors: 0,
    uniqueGenres: 0,
  });

  const handleBackButton = () => router.push("/(tabs)/profile");

  const fetchStats = async () => {
    try {
      const books = await getAllBooks();
      const goals = await getMyReadingGoals();

      const totalPagesRead = books.reduce(
        (sum: number, b: any) => sum + (b.number_of_pages || 0),
        0
      );

      const authors = new Set(
        books.flatMap((b: any) =>
          Array.isArray(b.authors)
            ? b.authors.map((a: string) => a.trim())
            : b.authors
              ? [b.authors.trim()]
              : []
        )
      );

      const genres = new Set(
        books.flatMap((b: any) => {
          if (!b.categories) return [];
          if (Array.isArray(b.categories))
            return b.categories.map((c: string) => c.trim());
          if (typeof b.categories === "string")
            return b.categories.split(",").map((c: string) => c.trim());
          return [];
        })
      );

      setStats({
        totalBooks: books.length,
        totalGoals: goals.length,
        completedGoals: goals.filter((g: any) => !g.active).length,
        totalPagesRead,
        uniqueAuthors: authors.size,
        uniqueGenres: genres.size,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.back}>
        <Pressable onPress={handleBackButton}>
          <Image
            style={styles.headerIcon}
            source={require("@/assets/icons/back-arrow.png")}
          />
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Stats</Text>
      </View>

      <View style={styles.statsBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Total Books</Text>
          <Text style={styles.value}>{stats.totalBooks}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Reading Goals</Text>
          <Text style={styles.value}>{stats.totalGoals}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Completed Goals</Text>
          <Text style={styles.value}>{stats.completedGoals}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Pages Read</Text>
          <Text style={styles.value}>{stats.totalPagesRead}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Authors Read</Text>
          <Text style={styles.value}>{stats.uniqueAuthors}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Genres Read</Text>
          <Text style={styles.value}>{stats.uniqueGenres}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F2EA",
    alignItems: "center",
    paddingTop: 50,
  },
  back: {
    position: "absolute",
    top: 30,
    left: 25,
  },
  header: {
    marginBottom: 30,
  },
  headerIcon: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    textAlign: "center",
    color: "#5C4033",
  },
  statsBox: {
    backgroundColor: "#FFF5EC",
    borderRadius: 20,
    width: "85%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "#725437",
  },
  value: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "#985325",
  },
});
