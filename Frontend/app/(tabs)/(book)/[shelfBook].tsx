import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import ProgressLine from "@/components/ProgressLine";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import {
  addBookUpcomingValue,
  getBookRating,
  getBookUpcomingValue,
  removeBookUpcoming,
} from "@/services/api";
import { useIsFocused } from "@react-navigation/core";

const ShelfBook = () => {
  const {
    shelfName,
    pagesRead,
    shelfBook,
    title,
    authors,
    categories,
    allShelves,
    numOfPages,
    description,
  } = useLocalSearchParams();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const isFocused = useIsFocused();

  const readPages = Number.parseInt(pagesRead as string);
  const numberOfPages = Number.parseInt(numOfPages as string);
  const shelvesList = JSON.parse(allShelves as string);
  const authorList = authors.toString().split(",");

  const [upcoming, setUpcoming] = useState("Mark as Upcoming");
  const [ratingText, setRatingText] = useState<any>([]);

  useEffect(() => {
    if (isFocused) {
      const getValuesOfBook = async () => {
        const value = await getBookUpcomingValue(shelfBook as string);
        if (value > 0) {
          setUpcoming("Upcoming");
        } else {
          setUpcoming("Mark as Upcoming");
        }

        const rating = await getBookRating(shelfBook as string);
        setRatingText([]);
        console.log("RATING: " + rating);
        for (let i = 1; i <= 5; i++) {
          if (rating - i >= 0) {
            setRatingText((prev: any) => [
              ...prev,
              <FontAwesome key={i} size={30} name="star" color="#CCB452" />,
              "  ",
            ]);
          } else if (Math.abs(rating - i) === 0.5) {
            setRatingText((prev: any) => [
              ...prev,
              <FontAwesome
                key={i}
                size={30}
                name="star-half-full"
                color="#CCB452"
              />,
              "  ",
            ]);
          } else {
            setRatingText((prev: any) => [
              ...prev,
              <FontAwesome key={i} size={30} name="star" color="#83884E" />,
              "  ",
            ]);
          }
        }
      };
      getValuesOfBook();
    }
  }, [shelfBook, upcoming, isFocused]);

  const handleUpcoming = async () => {
    if (upcoming === "Mark as Upcoming") {
      // handle adding an upcoming value to that book
      console.log("Trying to add an upcoming value to book");
      await addBookUpcomingValue(shelfBook as string);
      setUpcoming("Upcoming");
    } else {
      console.log("Trying to remove an upcoming value from book");
      await removeBookUpcoming(shelfBook as string);
      setUpcoming("Mark as Upcoming");
    }
  };

  const handleLog = async () => {
    router.push({
      pathname: "/(tabs)/log",
      params: {
        bookId: shelfBook,
        shelfName,
        rating: await getBookRating(shelfBook as string),
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingRight: 0,
        backgroundColor: "#F6F2EA",
        paddingTop: 10,
        paddingBottom: tabBarHeight,
      }}
    >
      {(shelfName === "Currently Reading" || shelfName === "Dropped") && (
        <View style={{ marginHorizontal: 30 }}>
          <ProgressLine progress={readPages} target={numberOfPages} />
        </View>
      )}
      <View style={styles.tagRatingView}>
        <View style={styles.tag}>
          <Text style={styles.nameText} numberOfLines={1}>
            {shelfName}
          </Text>
        </View>
        {shelfName !== "Currently Reading" &&
          shelfName !== "Dropped" &&
          shelfName !== "Want to Read" && (
            <View style={{ flexDirection: "row" }}>
              <Text>{ratingText}</Text>
            </View>
          )}
        {shelfName === "Want to Read" && (
          <Pressable style={styles.upcoming} onPress={handleUpcoming}>
            <Text style={styles.upcomingText}>{upcoming}</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.book}>
        <View style={styles.bookOverview}>
          <Image
            source={{
              uri: `https://books.google.com/books?id=${shelfBook}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
            }}
            style={styles.bookCover}
          />
        </View>
        <ScrollView style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{title}</Text>
          <Text style={styles.bookInfoText}>
            {authorList.map((author) => `${author}\n`)}
          </Text>
        </ScrollView>
      </View>
      <Text style={styles.bookPageText}>{numberOfPages} Pages</Text>
      <View style={{ marginHorizontal: 30, gap: 8 }}>
        <Text style={styles.genre}>{categories}</Text>

        {shelfName !== "Want to Read" && (
          <Pressable style={styles.logBtn} onPress={handleLog}>
            <Text style={styles.logText}>Log</Text>
          </Pressable>
        )}
        <Dropdown
          maxHeight={60}
          iconColor={"white"}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={{ textAlign: "center", color: "white" }}
          itemTextStyle={{ textAlign: "center", color: "white" }}
          selectedTextStyle={{ textAlign: "center", color: "white" }}
          activeColor={"#725437"}
          data={shelvesList}
          fontFamily={"Agbalumo"}
          labelField={"shelf_name"}
          valueField={"shelf_id"}
          onChange={(item) => {
            // handleAdd(item);
          }}
          placeholder={"Add to Shelf"}
        />
      </View>
      <Text style={styles.descriptionHeader}>Description</Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 30 }}
      >
        <Text style={styles.desc}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShelfBook;

const styles = StyleSheet.create({
  tag: {
    backgroundColor: "#83884E",
    borderRadius: 20,
    textAlign: "center",
    height: 30,
    width: "40%",
  },
  nameText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginVertical: "auto",
    marginHorizontal: 10,
  },
  tagRatingView: {
    marginVertical: 20,
    marginHorizontal: 30,
    width: "100%",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  bookOverview: {
    width: 175,
    height: 275,
    borderRadius: 30,
  },
  bookCover: {
    width: 175,
    height: 275,
    borderRadius: 30,
  },
  bookDetails: {
    height: 275,
    marginRight: 40,
  },
  bookTitle: {
    fontFamily: "Agbalumo",
    fontSize: 24,
  },
  authorText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
  },
  text: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  genreTxt: {
    fontFamily: "Agbalumo",
    backgroundColor: "#CCB452",
    borderRadius: 30,
    height: 30,
  },
  logBtn: {
    backgroundColor: "#985325",
    borderRadius: 20,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
  },
  logText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  scrollDetails: {
    flexDirection: "column",
    height: 275,
    width: "70%",
  },
  dropdown: {
    backgroundColor: "#725437",
    borderRadius: 20,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
  },
  dropdownContainer: {
    backgroundColor: "#725437",
    borderRadius: 10,
    color: "white",
  },
  descScroll: {
    height: "auto",
  },
  book: {
    flexDirection: "row",
    gap: 30,
    width: "100%",
    marginHorizontal: 30,
  },
  bookDetailsScroll: {
    height: 115,
  },
  upcoming: {
    backgroundColor: "#985325",
    borderRadius: 20,
    height: 30,
    width: "40%",
  },
  upcomingText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    marginVertical: "auto",
    textAlign: "center",
  },
  bookInfoText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  bookPageText: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    marginLeft: 30,
    width: 175,
    textAlign: "center",
  },
  descriptionHeader: {
    paddingTop: 30,
    fontFamily: "Agbalumo",
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  desc: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  genreScroll: {
    alignItems: "center",
  },
  genre: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    backgroundColor: "#CCB452",
    borderRadius: 30,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    paddingVertical: 4,
  },
});
