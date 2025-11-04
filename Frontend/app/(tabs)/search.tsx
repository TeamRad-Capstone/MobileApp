import SearchBook from "@/components/SearchBook";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";

type SearchBookType = {
  coverUrl: string;
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  numOfPages: number;
  categories: string[];
  publishedDate: string;
};

const Search = () => {
  const tabBarHeight = useBottomTabBarHeight();

  const [searchParam, setSearchParams] = useState("");
  const [returnedBooks, setReturnedBooks] = useState<SearchBookType[]>([]);

  const queryTypeData = [
    { label: "Default", value: "Default" },
    { label: "Title", value: "title" },
    { label: "Author", value: "author" },
  ];
  const [queryType, setQueryType] = useState(queryTypeData[0].label);

  const [buttonHidden, setButtonHidden] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const searchInAPI = async (amtLoaded: number, startIndex: number) => {

    let volumeQueryUrl = `https://www.googleapis.com/books/v1/volumes?q=`;
    let startIndexValue = `&startIndex=${startIndex}`;

    if (amtLoaded <= 10) {
      setReturnedBooks([])
    }
    try {
      const searched = searchParam.split(" ").join("+");
      let type =
        queryType === "Default" ? `${searched}` : `+in${queryType}:` + searched;
      console.log("Query type is: " + type);

      const response = await fetch(
        volumeQueryUrl +
        type +
        startIndexValue +
        "&printType=books" +
        "&key=" +
        process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      let numOfBooks = data.items?.length;
      for (const books of data.items) {
        let newBook = {
          coverUrl: `https://books.google.com/books?id=${books.id}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
          bookId: books.id,
          title: books.volumeInfo.title,
          authors: books.volumeInfo.authors,
          description: books.volumeInfo.description,
          numOfPages: books.volumeInfo.pageCount,
          categories: books.volumeInfo.categories,
          publishedDate: books.publishedDate,
        };
        setReturnedBooks((oldBooks) => [...oldBooks, newBook]);
      }
      if (numOfBooks === 10) {
        setButtonHidden(false);
        setStartIndex(startIndex + numOfBooks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        paddingBottom: tabBarHeight,
        flex: 1,
        backgroundColor: "#F6F2EA",
      }}
    >
      <Text style={styles.headingText}>Search</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.headerView}>
          <Image
            style={styles.searchIcon}
            source={require("@/assets/icons/search.png")}
          />
          <TextInput
            style={styles.searchInput}
            value={searchParam}
            onChangeText={setSearchParams}
            onSubmitEditing={() => {
              setStartIndex(0);
              searchInAPI(0, 0);
            }}
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
              console.log(item.value);
            }}
            value={queryType}
            placeholder={queryType}
          />
        </View>
      </View>
      <ScrollView>
        {returnedBooks.map((book, index) => (
          <SearchBook
            key={index}
            coverUrl={book.coverUrl}
            bookId={book.bookId}
            title={book.title}
            authors={book.authors}
            description={book.description}
            numOfPages={book.numOfPages}
            categories={book.categories}
            publishedDate={book.publishedDate}
          />
        ))}
        {!buttonHidden && (
          <Pressable
            style={styles.button}
            onPress={() => searchInAPI(11, startIndex)}
          >
            <Text style={styles.buttonText}>Load More</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  headingText: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    textAlign: "center",
  },
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
  typeText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
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
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  button: {
    marginHorizontal: "auto",
    backgroundColor: "#CCB452",
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
});
