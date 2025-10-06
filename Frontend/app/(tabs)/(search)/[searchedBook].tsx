import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchedBookDetails = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const {
    coverUrl,
    title,
    authors,
    description,
    numOfPages,
    categories,
    publishedDate,
    shelves,
  } = useLocalSearchParams();
  const authorList = authors.toString().split(",");
  const listRegex = /{(.*?)}/;
  const rgex = /\{[^{}]*\}/;

  const shelvesList = JSON.parse(shelves.toString());
  console.log(shelvesList);

  const handleAdd = (shelf: string) => {
    alert("Added to shelf: " + shelf);
    // call to api
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingLeft: 30,
        paddingRight: 0,
        backgroundColor: "#F6F2EA",
        paddingTop: 10,
        paddingBottom: tabBarHeight,
      }}
    >
      <Pressable
        onPress={() => {
          router.push("/(tabs)/search");
        }}
      >
        <Image
          style={styles.backButton}
          source={require("@/assets/icons/back-arrow.png")}
        />
      </Pressable>
      <View style={styles.book}>
        <Image style={styles.bookCover} source={{ uri: `${coverUrl}` }} />
        <View style={styles.bookDetails}>
          <ScrollView style={styles.bookDetailsScroll}>
            <Text style={styles.bookTitle}>{title}</Text>
            <Text style={styles.bookInfoText}>
              {authorList.map((author) => `${author}\n`)}
            </Text>
          </ScrollView>
          <Text style={styles.bookPageText}>{numOfPages} Pages</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.genreScroll}
          >
            <Text style={styles.genre}>{categories}</Text>
          </ScrollView>
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
              handleAdd(item.value);
            }}
            // value={chosenShelf}
            placeholder={"Add to Shelf"}
          />
        </View>
      </View>
      <Text style={styles.descriptionHeader}>Description</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.desc}>{description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchedBookDetails;

const styles = StyleSheet.create({
  backButton: {
    width: 30,
    height: 30,
    marginBottom: 20,
  },
  book: {
    flexDirection: "row",
    gap: 30,
    width: "100%",
  },
  bookCover: {
    width: 175,
    height: 275,
    borderRadius: 30,
  },
  bookDetailsScroll: {
    height: 115,
  },
  bookDetails: {
    flexDirection: "column",
    width: "45%",
  },
  bookTitle: {
    fontFamily: "Agbalumo",
    fontSize: 24,
  },
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
  },
  desc: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    marginRight: 20,
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
  dropdown: {
    backgroundColor: "#725437",
    borderRadius: 10,
    paddingHorizontal: 6,
    textAlign: "center",
    height: 30,
  },
  dropdownContainer: {
    backgroundColor: "#725437",
    borderRadius: 10,
    color: "white",
  },
  logButton: {
    backgroundColor: "#985325",
    borderRadius: 10,
    padding: 5,
    textAlign: "center",
  },
});
