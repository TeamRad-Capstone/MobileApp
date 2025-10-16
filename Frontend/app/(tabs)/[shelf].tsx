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
      </ScrollView>
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
