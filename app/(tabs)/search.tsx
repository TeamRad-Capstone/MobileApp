import {View, StyleSheet, Text, Image, ScrollView, TextInput} from "react-native";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import SearchBook from "@/components/SearchBook";

type SearchBookType = {
    coverUrl: string;
    title: string;
    authors: string[];
    description: string;
    numOfPages: number;
    mainCategory: string;
    categories: string[];
    publishedDate: string;
}
const Search = () => {
    const [searchParam, setSearchParams] = useState("");
    const [returnedBooks, setReturnedBooks] = useState<SearchBookType[]>([]);
    // const [queryType, setQueryType] = useState("title");

    const searchInAPI = async () => {
        setReturnedBooks([])

        let volumeQueryUrl = "https://www.googleapis.com/books/v1/volumes?q=";
        let maxResults = "&maxResults=20";
        let type = "title";
        let queryType = `&in${type}= ` + searchParam;

        try {
            const response = await fetch(volumeQueryUrl + searchParam + queryType+ maxResults +
                "&key=" + process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY
            );
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Query Search: " + searchParam);
            for (const books of data.items) {
                let newBook = {
                    coverUrl: `https://books.google.com/books?id=${books.id}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
                    title: books.volumeInfo.title,
                    authors: books.volumeInfo.authors,
                    description: books.description,
                    numOfPages: books.numOfPages,
                    mainCategory: books.mainCategory,
                    categories: books.categories,
                    publishedDate: books.publishedDate,
                }
                console.log(newBook);
                //numOfBooks++;
                setReturnedBooks(oldBooks => [...oldBooks, newBook])
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Search</Text>
            <View style={styles.headerView}>
                <Image
                    style={styles.searchIcon}
                    source={require('@/assets/icons/search.png')}
                />
                <TextInput
                    style={styles.searchInput}
                    value={searchParam}
                    onChangeText={setSearchParams}
                    onSubmitEditing={searchInAPI}
                />
            </View>
            <ScrollView>
            {/* Add a way to load books from searching through API
                Send search params to backend API and do retrieval from OpenBooks API
                for data to parse in the app. */}
                {returnedBooks.map((book, index) => (
                    <SearchBook
                        key={index}
                        coverUrl={book.coverUrl}
                        title={book.title}
                        authors={book.authors}
                        description={book.description}
                        numOfPages={book.numOfPages}
                        mainCategory={book.mainCategory}
                        categories={book.categories}
                        publishedDate={book.publishedDate}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDDCB9',
    },
    headingText: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        textAlign: "center",
    },
    headerView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        marginHorizontal: 25,
        alignItems: 'center',
        marginTop: 10
    },
    searchIcon: {
        height: 30,
        width: 30,
        marginLeft: 15,
    }      ,
    searchInput: {
        marginRight: 50,
        fontFamily: "Agbalumo",
        fontSize: 16,
        height: 50
    }
})