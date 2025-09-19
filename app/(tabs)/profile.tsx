import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  Pressable,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import UpcomingBook from "@/components/UpcomingBook";
import CurrentBook from "@/components/CurrentBook";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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

  const upcomingBookData = [
    // {
    //   title: "Lord of The Rings",
    //   author: "J.R.R Tolkien",
    //   coverUrl: "https://covers.openlibrary.org/b/olid/OL51711484M-L.jpg",
    // },
    // { title: "To Kill a Mockingbird", author: "Harper Lee", coverUrl: "" },
    {
      title: "Funny Story",
      author: "Emily Henry",
      coverUrl: "https://covers.openlibrary.org/b/olid/OL57586063M-L.jpg",
    },
    {
      title: "Love Hypothesis",
      author: "Ali Hazelwood",
      coverUrl: "https://covers.openlibrary.org/b/olid/OL57520854M-L.jpg",
    },
    {
      title: "The Wedding People",
      author: "Alison Espach",
      coverUrl: "https://covers.openlibrary.org/b/olid/OL51587376M-L.jpg",
    },
    {
      title: "Weyward",
      author: "Emilia Hart",
      coverUrl:
        "https://ia601909.us.archive.org/view_archive.php?archive=/31/items/l_covers_0013/l_covers_0013_19.zip&file=0013194003-L.jpg",
    },
    {
      title: "The Bear and The Nightingale",
      author: "Katherine Arden",
      coverUrl: "https://covers.openlibrary.org/b/olid/OL28632654M-L.jpg",
    },
  ];

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
          {upcomingBookData.map((book, index) => (
            <CurrentBook
              key={index}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              progress={123}
              numOfPages={200}
            />
          ))}
        </ScrollView>

        <Text style={styles.headerText}>Upcoming Books</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.upcomingContainer}
        >
          {upcomingBookData.map((book, index) => (
            <UpcomingBook
              key={index}
              title={book.title}
              author={book.author}
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
