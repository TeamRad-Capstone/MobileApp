import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  addToDroppedShelf,
  addToShelf, addToToReadShelf,
  getCustomShelves,
  getDefaultShelves
} from "@/services/api";
import book from "@/components/Book";

type SearchBookProps = {
  coverUrl: string;
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  numOfPages: number;
  categories: string[];
  publishedDate: string;
};

const SearchBook = ({
  coverUrl,
  bookId,
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
  const [shelfId, setShelfId] = useState(0);

  const handleAdd = (shelf: any) => {
    alert("Added to shelf: " + shelf.shelf_name);
    setChosenShelf(shelf.shelf_id);

    // based on shelf chosen
    let bookInfo = {google_book_id: bookId,
      title: title,
      authors: authors,
      description: description,
      number_of_pages: numOfPages,
      category: categories,
      published_date: publishedDate }
    switch (shelf.shelf_name) {
      case "Want to Read":
        addToToReadShelf(bookInfo, shelf.shelf_id, shelf.end_user_id, shelf.shelf_name);
        break;
      case "Dropped":
        addToDroppedShelf(bookInfo, shelf.shelf_id, shelf.end_user_id, shelf.shelf_name)
        break;
      case "Currently Reading":
        addToShelf(bookInfo)
        break;
      case "Read":
        addToShelf(bookInfo)
        break;
      default: // add to custom
        break;
    }
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
            handleAdd(item)
          }}
          // confirmSelectItem={true}
          // onConfirmSelectItem={(item) => {
          //   setShelfId(item.shelf_id);
          //   console.log("Shelf id = " + item.shelf_id);
          // }}
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
