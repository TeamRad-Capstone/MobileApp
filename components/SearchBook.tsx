import {StyleSheet, View, Image, Text, Pressable, ScrollView, Alert} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import {useState} from "react";
import {Link} from "expo-router";

type SearchBookProps = {
    coverUrl: string;
    title: string;
    authors: string[];
    description: string;
    numOfPages: number;
    // mainCategory: string;
    categories: string[];
    publishedDate: string;
}

const SearchBook = ({coverUrl, title, authors, description, numOfPages, categories, publishedDate}: SearchBookProps) => {
    const shelves = [
        {label: "Want to Read", value: 1},
        {label: "Currently Reading", value: 2},
        {label: "Dropped", value: 3},
        {label: "Absolute Favourites", value: 4},
        {label: "I really wanted to like...but did not", value: 5},
    ]
    const [chosenShelf, setChosenShelf] = useState(shelves[0].label);

    const handleAdd = (shelf: string) => {
        alert("Added to shelf: " + shelf);
    }

    return (
        <View style={styles.container}>
            <Link href={{
                pathname: "/(tabs)/(search)/[book]",
                params: {
                    book: title,
                    coverUrl: coverUrl,
                    title: title,
                    authors: authors,
                    description: description,
                    numOfPages: numOfPages,
                    categories: categories,
                    publishedDate: publishedDate
                    }
            }
            }>
                <Image
                    style={styles.bookCover}
                    source={{uri: coverUrl}}
                />
            </Link>
            <View style={styles.book}>
                <View>
                    <Text
                        numberOfLines={3}
                        style={styles.title}
                    >
                        {title}
                    </Text>
                    <Text
                        numberOfLines={3}
                        style={styles.author}
                    >
                        {authors?.map((author) => author+"\n")}
                    </Text>
                </View>
                <Dropdown
                    maxHeight={60}
                    iconColor={"black"}
                    style={{width: 150, marginLeft: 10}}
                    data={shelves}
                    fontFamily={"Agbalumo"}
                    labelField={"label"}
                    valueField={"value"}
                    onChange={item => {
                        handleAdd(item.value);
                    }}
                    value={chosenShelf}
                    placeholder={chosenShelf}
                />
            </View>

        </View>
    )

}

export default SearchBook;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 30,
        marginTop: 30,
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
    button: {
        flexDirection: "row",
        gap: 30,
        alignItems: "center",
    },
    icon: {
        width: 20,
        height: 20,
    },
    buttonText: {
        fontFamily: "Agbalumo",
        fontSize: 16,
    }
})