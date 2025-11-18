import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllBooks, getMyReadingGoals } from "@/services/api";

type Book = {
  number_of_pages?: number;
  authors?: string[] | string | null;
  categories?: string[] | string | null;
};

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
        (sum: number, b: Book) => sum + (b.number_of_pages || 0),
        0
      );

      const authors = new Set(
        books.flatMap((b: Book) =>
          Array.isArray(b.authors)
            ? b.authors.map((a) => a.trim())
            : b.authors
              ? [b.authors.trim()]
              : []
        )
      );

      const genres = new Set(
        books.flatMap((b: Book) => {
          if (!b.categories) return [];
          if (Array.isArray(b.categories))
            return b.categories.map((c) => c.trim());
          if (typeof b.categories === "string")
            return b.categories.split(",").map((c) => c.trim());
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

      <Text style={styles.headerText}>Statistics</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Books</Text>
        <Text style={styles.sectionValue}>{stats.totalBooks}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Goals</Text>
        <Text style={styles.sectionValue}>{stats.totalGoals}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Goals</Text>
        <Text style={styles.sectionValue}>{stats.completedGoals}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pages Read</Text>
        <Text style={styles.sectionValue}>{stats.totalPagesRead}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authors Read</Text>
        <Text style={styles.sectionValue}>{stats.uniqueAuthors}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genres Read</Text>
        <Text style={styles.sectionValue}>{stats.uniqueGenres}</Text>
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
  headerIcon: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    color: "#5C4033",
    marginBottom: 20,
  },
  section: {
    width: "85%",
    backgroundColor: "#FFF5EC",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6DACF",
  },
  sectionTitle: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "#725437",
    marginBottom: 5,
  },
  sectionValue: {
    fontFamily: "Agbalumo",
    fontSize: 22,
    color: "#985325",
  },
});
