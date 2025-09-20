import CurrentBook from "@/components/CurrentBook";
import UpcomingBook from "@/components/UpcomingBook";
import booksData from "@/data/books.json";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const tabBarHeight = useBottomTabBarHeight();

  // Placeholder username until fetched from API
  const username = "TesterUsernameIfItWereToBeHellaLongAndNeverStop";

  // Placeholder streak to be fetched from DB/API
  const [streak, setStreak] = useState(0);

  const router = useRouter();

  const handleProfile = () => {
    console.log("Navigating to Profile");
    router.push("/(tabs)/(profile)/edit");
  };

  const handleLog = () => {
    console.log("Navigating to log for clicked book");
  };
  // const [modalVisible, setModalVisible] = useState(false);
  // const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  // const [streak, setStreak] = useState(0);
  //
  // const handleLogout = () => {
  //   console.log("Attempt to logout");
  //   setLogoutModalVisible(true);
  // };
  //
  // const handleConfirmLogout = () => {
  //   // do something with backend API and authentication to cancel user and hide info / session details.
  //   console.log("Logout confirmed");
  //   setLogoutModalVisible(false);
  //
  //   // Placeholder until backend API is implemented
  //   router.push("/");
  // };
  //
  // const handleCancelLogout = () => {
  //   setLogoutModalVisible(false);
  // };
  //
  // const handleEditProfile = () => {
  //   console.log("Attempt to edit Profile");
  //   router.push("/(tabs)/(profile)/edit");
  // };
  //
  // const showTransferModal = () => {
  //   setModalVisible(true);
  // };
  //
  // const handleModalClose = () => {
  //   setModalVisible(false);
  // };
  //
  // const handleImport = () => {
  //   console.log("Attempt to import historical data");
  //   // Read the csv file and send to API? Not sure how to implement yet
  //   // Accept the file and send to API from there API will parse to DB
  //   DocumentPicker.getDocumentAsync({}).then((doc) => {
  //     if (!doc.canceled) {
  //       const file = doc.assets.pop();
  //       const fileName = file ? file.name : "";
  //       console.log(fileName);
  //       handleModalClose();
  //       router.push("/(tabs)/(profile)/transferred");
  //     } else {
  //       console.log("No file picked");
  //     }
  //   });
  // };
  //
  // const handleStats = () => {
  //   console.log("Attempt to import stats");
  //   router.push("/(tabs)/(profile)/stats");
  // };

  return (
    <SafeAreaView
      style={{
        paddingBottom: tabBarHeight,
        flex: 1,
        backgroundColor: "#F4F4E6",
      }}
    >
      <ScrollView>
        <Text style={styles.title}>Welcome to Rad Reads!</Text>

        <Pressable style={styles.topContainer} onPress={handleProfile}>
          <Image
            style={styles.profileImage}
            source={require("@/assets/images/profileImg.jpg")}
          />
          <Text numberOfLines={1} style={styles.textStyle}>
            {username}
          </Text>
        </Pressable>

        <Pressable
          style={styles.topContainer}
          onPress={() => router.push("/(tabs)/(profile)/stats")}
        >
          <Image
            style={styles.profileImage}
            source={require("@/assets/icons/graph.png")}
          />
          <Text style={styles.textStyle}>Statistics</Text>
        </Pressable>

        <Text style={styles.headerText}>Current Reads</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.currentContainer}
        >
          {booksData.shelfBooks
            .filter((sb) => sb.shelfId === 2)
            .map((sb) => {
              const book = booksData.books.find((b) => b.id === sb.bookId);
              if (!book) return null;
              return (
                <CurrentBook
                  key={book.id}
                  title={book.title}
                  author={book.authors}
                  coverUrl={book.coverUrl}
                  description={book.description}
                  numOfPages={book.numOfPages}
                  category={book.category}
                  publishedDate={book.publishedDate}
                  context="currentBook"
                  progress={70}
                />
              );
            })}
        </ScrollView>

        <Text style={styles.headerText}>Upcoming Books</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.upcomingContainer}
        >
          {booksData.books
            .filter((book) => !booksData.currentlyReading.includes(book.id))
            .map((book) => (
              <UpcomingBook
                key={book.id}
                title={book.title}
                author={book.authors}
                coverUrl={book.coverUrl}
              />
            ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "Agbalumo",
    textAlign: "center",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    gap: 10,
    backgroundColor: "#83884E",
    marginHorizontal: 30,
    borderRadius: 30,
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  textStyle: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    color: "#fff",
    width: "80%",
  },
  headerText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    marginLeft: 30,
    marginTop: 50,
    marginBottom: 20,
  },
  currentContainer: {
    gap: 30,
    paddingHorizontal: 30,
  },
  upcomingContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    gap: 30,
  },
});
