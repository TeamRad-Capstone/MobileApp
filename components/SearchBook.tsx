import {StyleSheet, View, Image, Text, Pressable, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

type SearchBookProps = {
    coverUrl: string;
    title: string;
    authors: string[];
    description: string;
    numOfPages: number;
    mainCategory: string;
    categories: string[];
    publishedDate: string;
}

const SearchBook = ({coverUrl, title, authors, description, numOfPages, mainCategory, categories, publishedDate}: SearchBookProps) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.bookCover}
                source={{uri: coverUrl}}
            />
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
                <Pressable style={styles.button}>
                    <Image
                        style={styles.icon}
                        source={require("@/assets/icons/plus.png")}
                    />
                    <Text style={styles.buttonText}>Add to Shelf</Text>
                </Pressable>
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
        height: 275
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