import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  getCustomShelves,
  getDefaultShelves,
  Book,
  Shelf,
} from "@/services/api";

type ShelfBookProps = {
  shelf_name: string;
} & Book;

const ShelfBook = ({
  shelf_name,
  google_book_id,
  title,
  authors,
  description,
  number_of_pages,
  categories,
  published_date,
}: ShelfBookProps) => {
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
  const allShelves = [...defaultShelves, ...shelves];

  const handleMove = (item: Shelf) => {
    if (item.shelf_name === shelf_name) {
      alert("Cannot move book to the same shelf");
    }
  };

  {
    /** Make sure i change how this is used.**/
  }
  let id = 0;
  return (
    <View style={styles.container}>
      <Link
        href={{
          pathname: "/(tabs)/(shelf)/[bookinfo]",
          params: {
            bookinfo: title,
            bookId: google_book_id,
          },
        }}
      >
        <Image
          style={styles.bookCover}
          source={{
            uri: `https://books.google.com/books?id=${google_book_id}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
          }}
        />
      </Link>
      <View style={styles.book}>
        <View style={styles.topBookDetails}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.author}>
            {authors?.map((author) => author + "\n")}
          </Text>
          <Text numberOfLines={1} style={styles.author}>
            {number_of_pages} Pages
          </Text>
          <Text numberOfLines={1} style={styles.genre}>
            {categories?.map((category) => (
              <Text key={++id}>{category}</Text>
            ))}
          </Text>
        </View>
        <View style={styles.btmBookDetails}>
          {/*If there exist a progress, add the bar here*/}
          <Pressable style={styles.removeBtn}>
            <Text style={styles.removeTxt}>Remove</Text>
          </Pressable>
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
              handleMove(item);
            }}
            placeholder={"Move to Shelf"}
          />
        </View>
      </View>
    </View>
  );
};

export default ShelfBook;

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
  removeBtn: {
    backgroundColor: "#9B2426",
    borderRadius: 10,
    height: 30,
  },
  removeTxt: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  btmBookDetails: {
    gap: 8,
  },
  topBookDetails: {
    gap: 8
  }
});
