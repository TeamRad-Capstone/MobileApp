import {View, StyleSheet, Text, Image, ScrollView, TextInput} from "react-native";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import SearchBook from "@/components/SearchBook";
import {Dropdown} from "react-native-element-dropdown";

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
    const [queryType, setQueryType] = useState(null);
    const queryTypeData = [
        {label: "Default", value: "Default"},
        {label: "Title", value: "title"},
        {label: "Author", value: "author"},
    ];

    const searchInAPI = async () => {
        setReturnedBooks([])

        let volumeQueryUrl = "https://www.googleapis.com/books/v1/volumes?q=";
        let maxResults = "&maxResults=20";

        try {
            const searched = searchParam.split(" ").join("+");
            let type = (queryType === "Default") ? `` : `+in${queryType}:` + searched
            // const searchQuery = searched.join("+");
            const response = await fetch(volumeQueryUrl + searched + type + maxResults +
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
                setReturnedBooks(oldBooks => [...oldBooks, newBook])
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Search</Text>
            <View style={{flexDirection: "row"}}>
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
                <View style={styles.queryChoice}>
                    <Dropdown
                        style={{width: 90, marginLeft: 10}}
                        data={queryTypeData}
                        fontFamily={"Agbalumo"}
                        labelField={"label"}
                        valueField={"value"}
                        onChange={item => {
                            console.log('Selected:', item.value);
                            setQueryType(item.value);
                        }}
                        value={queryType}
                    />
                </View>
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
        marginLeft: 25,
        alignItems: 'center',
        marginTop: 10,
        width: "65%",
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        borderRightColor: "black",
        borderRightWidth: 2,
    },
    queryChoice: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        height: 50,
    },
    typeText: {
        fontFamily: "Agbalumo",
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10
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
    },
    dropdownIcon: {
        width: 20,
        height: 20,
    }
})