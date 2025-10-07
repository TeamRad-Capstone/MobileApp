import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
import { useLocalSearchParams } from "expo-router";
import SearchBar from "@/components/SearchBar";

const ShelfDetails = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { title, books } = useLocalSearchParams();

  const [searchParam, setSearchParam] = useState("");

  const searchInShelf = () => {
    console.log("searching for book in shelf");
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
      <Text style={styles.shelfTitle}>{title}</Text>
      <SearchBar
        searchText={searchParam}
        setSearchText={setSearchParam}
        submitSearchText={searchInShelf}
      />
    </SafeAreaView>
  );
};

export default ShelfDetails;

const styles = StyleSheet.create({
  shelfTitle: {
    fontFamily: "Agbalumo",
    fontSize: 26,
    textAlign: "center",
  },
});
