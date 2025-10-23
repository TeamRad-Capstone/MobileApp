import CurrentBook from "@/components/CurrentBook";
import UpcomingBook from "@/components/UpcomingBook";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getBooksFromShelf, getUpcomingBooks, getUsername } from "@/services/api";
import { useIsFocused } from "@react-navigation/core";

const Profile = () => {
  const tabBarHeight = useBottomTabBarHeight();

  // Placeholder username until fetched from API
  const [username, setUsername] = useState("");
  const [currentBooks, setCurrentBooks] = useState<any[]>([]);
  const [upcomingBooks, setUpcomingBooks] = useState<any[]>([]);

  const router = useRouter();

  const handleProfile = () => {
    console.log("Navigating to Profile");
    router.push("/(tabs)/(profile)/edit");
  };

  const handleLog = () => {
    console.log("Navigating to log for clicked book");
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadBooks = async () => {
        try {
          const retrievedUsername = await getUsername();
          setUsername(retrievedUsername);
          const retrievedBooks = await getBooksFromShelf("Currently Reading");
          setCurrentBooks(retrievedBooks);
          console.log("Getting books");
          const retrievedUpcomingBooks = await getUpcomingBooks();
          setUpcomingBooks(retrievedUpcomingBooks);
          console.log("Done getting books")
        } catch (error: any) {
          console.log("Error while retrieving username and books");
          console.error(error);
        }
      };
      loadBooks();
    }
  }, [isFocused]);
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
        backgroundColor: "#F6F2EA",
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
          {currentBooks?.map((currentBook, index) => (
            <CurrentBook
              key={index}
              title={currentBook.title}
              authors={currentBook.authors}
              googleBookId={currentBook.google_book_id}
              progress={100}
              numOfPages={currentBook.number_of_pages}
              description={currentBook.description}
              categories={currentBook.categories}
              publishedDate={currentBook.published_date}
            />
          ))}
        </ScrollView>

        <Text style={styles.headerText}>Upcoming Books</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.upcomingContainer}
        >
          {upcomingBooks.map((upcomingBook, index) => (
            <UpcomingBook
              key={index}
              title={upcomingBook.title}
              author={upcomingBook.authors}
              coverUrl={upcomingBook.google_book_id}
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
