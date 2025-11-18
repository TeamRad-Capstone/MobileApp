import { Image, StyleSheet, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";

type SearchBookProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  submitSearchText: () => void;
};
const SearchBar = ({
  searchText,
  setSearchText,
  submitSearchText,
}: SearchBookProps) => {
  return (
    <View style={styles.headerView}>
      <Image
        style={styles.searchIcon}
        source={require("@/assets/icons/search.png")}
      />
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={submitSearchText}
        placeholder="Search books..."
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    backgroundColor: "#F6F2EA",
    marginLeft: 25,
    alignItems: "center",
    marginTop: 10,
    borderRadius: 20,
    marginRight: 25,
    borderColor: "black",
    borderWidth: 1,
    borderRightWidth: 1
  },
  searchIcon: {
    height: 30,
    width: 30,
    marginLeft: 15,
  },
  searchInput: {
    marginRight: 50,
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
});
