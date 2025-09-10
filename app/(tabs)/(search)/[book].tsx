import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';
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

const BookDetails = () => {
    const { coverUrl, title, authors, description, numOfPages, mainCategory, categories, publishedDate} = useLocalSearchParams();

    console.log(authors);
    const authorList = authors.toString().split(",");
    console.log(authorList);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.book}>
                <Image
                    style={styles.bookCover}
                    source={{uri: `${coverUrl}`}}
                />
                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{title}</Text>
                    <Text style={styles.bookAuthors}>{authorList.map((author) => (author+"\n"))}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default BookDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 30,
        paddingTop: 40,
        backgroundColor: "#FDDCB9"
    },
    book: {
        flexDirection: "row",
        gap: 30,
    },
    bookCover: {
        width: 175,
        height: 275,
        borderRadius: 30,
    },
    bookDetails: {
        flexDirection: "column",
    },
    bookTitle: {
        fontFamily: 'Agbalumo',
        fontSize: 24,
    },
    bookAuthors: {
        fontFamily: 'Agbalumo',
        fontSize: 18,
    }
});
