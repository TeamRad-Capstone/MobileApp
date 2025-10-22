import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import ProgressLine from "@/components/ProgressLine";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import shelfBook from "@/components/ShelfBook";

const ShelfBook = () => {
  const {
    shelfName,
    pagesRead,
    target,
    rating,
    shelfBook,
    title,
    authors,
    categories,
    allShelves,
    numOfPages,
    description,
  } = useLocalSearchParams();
  const tabBarHeight = useBottomTabBarHeight();
  const [ratingAvailable, setRatingAvailable] = useState(false);

  const readPages = Number.parseInt(pagesRead as string);
  const numberOfPages = Number.parseInt(numOfPages as string);
  console.log("READ PAGES: " + numberOfPages);
  // const userRating = Number.parseInt(rating as string);
  let userRating = 2.5;
  let ratingText = [];
  for (let i = 1; i <= 5; i++) {
    if (userRating - i >= 0) {
      ratingText.push(<FontAwesome size={30} name="star" color="#CCB452" />);
    } else if (Math.abs(userRating - i) == 0.5) {
      ratingText.push(
        <FontAwesome size={30} name="star-half-full" color="#CCB452" />,
      );
    } else {
      ratingText.push(<FontAwesome size={30} name="star" color="#83884E" />);
    }
  }

  console.log("ALL SHELVES: " + allShelves);
  const shelvesList = JSON.parse(allShelves as string);

  const authorList = authors.toString().split(",");
  // const shelvesList = Array.from(allShelves, (shelf) => {
  //
  // })
  // console.log(shelvesList);
  // const shelvesList = JSON.parse(allShelves as string);
  // const shelvesList = Array.from(allShelves, (shelf) => {
  //
  // })
  console.log(shelvesList);
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
      <View style={{marginHorizontal: 30}}>
        <ProgressLine progress={readPages} target={numberOfPages} />
      </View>
      <View style={styles.tagRatingView}>
        <View style={styles.tag}>
          <Text style={styles.nameText} numberOfLines={1}>
            {shelfName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <Text>{ratingText}</Text>
        </View>
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
        <View style={styles.bookDetails}>
          <ScrollView style={styles.bookDetailsScroll}>
            <Text style={styles.bookTitle}>{title}</Text>
            <Text style={styles.bookInfoText}>
              {authorList.map((author) => `${author}\n`)}
            </Text>
          </ScrollView>
          <Text style={styles.bookPageText}>{numberOfPages} Pages</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.genreScroll}
          >
            <Text style={styles.genre}>{categories}</Text>
          </ScrollView>
          <Pressable style={styles.logBtn}>
            <Text style={styles.logText}>Log</Text>
          </Pressable>
          <Dropdown
            maxHeight={60}
            iconColor={"white"}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={{ textAlign: "center", color: "white" }}
            itemTextStyle={{ textAlign: "center", color: "white" }}
            data={shelvesList}
            fontFamily={"Agbalumo"}
            labelField={"shelf_name"}
            valueField={"shelf_id"}
            onChange={(item) => {
              // handleAdd(item);
            }}
            // value={chosenShelf}
            placeholder={"Move to Shelf"}
          />
        </View>
      </View>
      <Text style={styles.descriptionHeader}>Description</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 , marginHorizontal: 30}}>
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
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginVertical: "auto",
    marginHorizontal: 10,
  },
  tagRatingView: {
    marginVertical: 20,
    marginHorizontal: 30,
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
    width: 165,
    height: 275,
    borderRadius: 30,
  },
  bookDetails: {
    height: 275,
    width: "40%",
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
    marginVertical: 12,
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
  // bookDetails: {
  //   flexDirection: "column",
  //   width: "45%",
  // },
  // bookTitle: {
  //   fontFamily: "Agbalumo",
  //   fontSize: 24,
  // },
  bookInfoText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  bookPageText: {
    fontFamily: "Agbalumo",
    fontSize: 14,
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
