import CurrentBook from "@/components/CurrentBook";
import UpcomingBook from "@/components/UpcomingBook";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  addToShelf,
  getBooksFromShelf,
  getProfileImage,
  getUpcomingBooks,
  getUsername,
  removeBookFromShelf,
} from "@/services/api";
import { useIsFocused } from "@react-navigation/core";
import images from "@/data/profileImgManager";

const Profile = () => {
  const tabBarHeight = useBottomTabBarHeight();

  const [username, setUsername] = useState("");
  const [currentBooks, setCurrentBooks] = useState<any[]>([]);
  const [upcomingBooks, setUpcomingBooks] = useState<any[]>([]);

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [changeLog, setChangeLog] = useState(false);

  const router = useRouter();

  const handleProfile = () => {
    console.log("Navigating to Profile");
    router.push("/(tabs)/(profile)/edit");
  };

  // const handleLog = () => {
  //   console.log("Navigating to log for clicked book");
  // };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadBooks = async () => {
        try {
          const retrievedUsername = await getUsername();
          setUsername(retrievedUsername);

          let profileImage = await getProfileImage();
          console.log("Profile image: " + profileImage);

          if (profileImage in images) {
            console.log("Setting profile image from local images");
            setProfileImageUrl(images[profileImage as keyof typeof images]);
          }

          const retrievedBooks = await getBooksFromShelf("Currently Reading");
          setCurrentBooks(retrievedBooks);

          console.log("Getting books");
          const retrievedUpcomingBooks = await getUpcomingBooks();
          setUpcomingBooks(retrievedUpcomingBooks);
          console.log("Done getting books");
        } catch (error: any) {
          console.log("Error while retrieving username and books");
          console.error(error);
        }
      };
      loadBooks();
    }
  }, [isFocused, changeLog]);

  const handleCurrentMove = (
    google_book_id: string,
    title: string,
    authors: string[],
    description: string,
    number_of_pages: number,
    categories: string[],
    published_date: string
  ) => {
    console.log("Current book moved");
    const moveBook = {
      google_book_id,
      title,
      authors,
      description,
      number_of_pages,
      categories,
      published_date,
    };

    // Call on api to move the book to currently a reading shelf
    removeBookFromShelf("Want to Read", google_book_id);
    addToShelf(moveBook, 0, 0, "Currently Reading");
    setChangeLog(!changeLog);
  };

  const handleUpcomingSelection = (google_book_id: string) => {
    console.log("Upcoming book selected");
  };

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
            source={
              profileImageUrl
                ? profileImageUrl
                : require("@/assets/images/profile-images/blue-vibes.jpg")
            }
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
              progress={currentBook.progress}
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
              onCurrentMove={() =>
                handleCurrentMove(
                  upcomingBook.google_book_id,
                  upcomingBook.title,
                  upcomingBook.authors,
                  upcomingBook.description,
                  upcomingBook.numOfPages,
                  upcomingBook.categories,
                  upcomingBook.publishedDate
                )
              }
              onImagePress={() =>
                handleUpcomingSelection(upcomingBook.google_book_id)
              }
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
