import { Image, StyleSheet, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useState } from "react";

type SearchBookProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  submitSearchText: () => void;
}
const SearchBar = ({searchText, setSearchText, submitSearchText}: SearchBookProps) => {
  const queryTypeData = [
    { label: "Default", value: "Default" },
    { label: "Title", value: "title" },
    { label: "Author", value: "author" },
  ];
  const [queryType, setQueryType] = useState(queryTypeData[0].label);

  return (
    <View style={{ flexDirection: "row" }}>
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
        />
      </View>
      <View style={styles.queryChoice}>
        <Dropdown
          style={{ width: 90, marginLeft: 10 }}
          data={queryTypeData}
          fontFamily={"Agbalumo"}
          labelField={"label"}
          valueField={"value"}
          onChange={(item) => {
            setQueryType(item.value);
          }}
          value={queryType}
          placeholder={queryType}
        />
      </View>
    </View>
  )
}

export default SearchBar;

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    backgroundColor: "white",
    marginLeft: 25,
    alignItems: "center",
    marginTop: 10,
    width: "65%",
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderRightColor: "black",
    borderRightWidth: 2,
  },
  queryChoice: {
    flexDirection: "row",
    backgroundColor: "white",
    marginTop: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: 50,
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
    height: 50,
  },
})