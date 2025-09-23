import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { getCustomShelves, getDefaultShelves } from "@/services/api";

type SearchBookProps = {
  coverUrl: string;
  title: string;
  authors: string[];
  description: string;
  numOfPages: number;
  categories: string[];
  publishedDate: string;
};

const SearchBook = ({
  coverUrl,
  title,
  authors,
  description,
  numOfPages,
  categories,
  publishedDate,
}: SearchBookProps) => {
  const [shelves, setShelves] = useState([]);
  const [defaultShelves, setDefaultShelves] = useState([]);

  useEffect(() => {
    const loadShelves = async () => {
      try {
        const customList = await getCustomShelves();
        setShelves(customList);
        const list = await getDefaultShelves();
        setDefaultShelves(list);
      } catch (error: any) {
        console.log("Error while retrieving custom shelves");
        console.error(error);
      }
    };
    loadShelves();
  }, []);

  const [chosenShelf, setChosenShelf] = useState(0);
  const allShelves = [...defaultShelves, ...shelves];
  const handleAdd = (shelf: number) => {
    alert("Added to shelf: " + shelf);
    setChosenShelf(shelf);
  };

  return (
    <View style={styles.container}>
      <Link
        href={{
          pathname: "/(tabs)/(search)/[searchedBook]",
          params: {
            searchedBook: title,
            coverUrl: coverUrl,
            title: title,
            authors: authors,
            description: description,
            numOfPages: numOfPages,
            categories: categories,
            publishedDate: publishedDate,
            shelves: JSON.stringify(allShelves),
          },
        }}
      >
        <Image style={styles.bookCover} source={{ uri: coverUrl }} />
      </Link>
      <View style={styles.book}>
        <View>
          <Text numberOfLines={3} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={3} style={styles.author}>
            {authors?.map((author) => author + "\n")}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.author}>
          {numOfPages} Pages
        </Text>
        {categories && (
          <Text numberOfLines={1} style={styles.genre}>
            {categories[0]}
          </Text>
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
          data={allShelves}
          fontFamily={"Agbalumo"}
          labelField={"shelf_name"}
          valueField={"shelf_id"}
          onChange={(item) => {
            handleAdd(item.label);
          }}
          // onConfirmSelectItem={(item => handleAdd(item))}
          // value={chosenShelf}
          placeholder={"Add to Shelf"}
        />
      </View>
    </View>
  );
};

export default SearchBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 30,
    marginTop: 10,
    marginBottom: 30,
  },
  bookCover: {
    width: 175,
    height: 275,
    borderRadius: 30,
  },
  book: {
    flex: 1,
    marginLeft: 10,
    height: 275,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Agbalumo",
    fontSize: 20,
  },
  author: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  genre: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    backgroundColor: "#CCB452",
    marginRight: "auto",
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 30,
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
});
