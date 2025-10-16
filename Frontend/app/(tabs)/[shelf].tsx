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
import {
  Book,
  getBooksFromShelf,
  getCustomShelves,
  getDefaultShelves,
  Shelf,
} from "@/services/api";
import shelf from "@/components/Shelf";
import SearchBook from "@/components/SearchBook";
import ShelfBook from "@/components/ShelfBook";

const ShelfDetails = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { shelf, user_id, title } = useLocalSearchParams();
  const shelf_id = parseInt(shelf as string);
  const end_user_id = parseInt(user_id as string);
  const shelf_name = title as string;

  const [searchParam, setSearchParam] = useState("");

  const searchInShelf = () => {
    console.log("searching for book in shelf");
  };

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const allBooks = await getBooksFromShelf(
          shelf_id,
          end_user_id,
          shelf_name,
        );
        setBooks(allBooks);
      } catch (error: any) {
        console.log("Error while retrieving books");
        console.error(error);
      }
    };
    loadBooks();
  }, [title, end_user_id, shelf_id]);

  // Check if shelf name and not a custom shelf from api
  const checkIfDefaultShelf = () => {
    if (
      title === "Want to Read" ||
      title === "Dropped" ||
      title === "Currently Reading" ||
      title === "Read"
    ) {
      return true;
    }
    return false;
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
      <View style={styles.titleView}>
        <Text style={styles.shelfTitle}>{title}</Text>
        <Pressable>
          <Image
            style={{ height: 20, width: 20 }}
            source={require("@/assets/icons/edit.png")}
          />
        </Pressable>
      </View>

      <SearchBar
        searchText={searchParam}
        setSearchText={setSearchParam}
        submitSearchText={searchInShelf}
      />

      <ScrollView>
        {books.map((book, index) => (
          <ShelfBook
            key={index}
            shelf_name={shelf_name}
            google_book_id={book.google_book_id}
            title={book.title}
            authors={book.authors}
            description={book.description}
            number_of_pages={book.number_of_pages}
            categories={book.categories}
            published_date={book.published_date}
          />
        ))}

        {!checkIfDefaultShelf() && (
          <Pressable style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete Shelf</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShelfDetails;

const styles = StyleSheet.create({
  titleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  shelfTitle: {
    fontFamily: "Agbalumo",
    fontSize: 26,
    textAlign: "center",
  },
  deleteBtn: {
    backgroundColor: "#9B2426",
    marginVertical: 20,
    marginHorizontal: "auto",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  deleteBtnText: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    color: "white",
  },
});
