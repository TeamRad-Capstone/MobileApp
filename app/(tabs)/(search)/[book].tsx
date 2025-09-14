import {useLocalSearchParams, useRouter} from 'expo-router';
import {View, Text, Image, StyleSheet, ScrollView, Pressable} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {Dropdown} from "react-native-element-dropdown";
import {useState} from "react";
import {placeholder} from "@babel/types";

type SearchBookProps = {
    coverUrl: string;
    title: string;
    authors: string[];
    description: string;
    numOfPages: number;
    categories: string[];
    publishedDate: string;
}

const BookDetails = () => {
    const router = useRouter();
    const { coverUrl, title, authors, description, numOfPages, categories, publishedDate} = useLocalSearchParams();
    const authorList = authors.toString().split(",");

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
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => {router.push("/(tabs)/search")}}>
                <Image
                    style={styles.backButton}
                    source={require("@/assets/icons/back-arrow.png")}
                />
            </Pressable>
            <View style={styles.book}>
                <Image
                    style={styles.bookCover}
                    source={{uri: `${coverUrl}`}}
                />
                <View style={styles.bookDetails}>
                    <ScrollView style={styles.bookDetailsScroll}>
                        <Text style={styles.bookTitle}>{title}</Text>
                        <Text style={styles.bookInfoText}>{authorList.map((author) => (`${author}\n`))}</Text>
                    </ScrollView>
                    <Text style={styles.bookPageText}>{numOfPages} Pages</Text>
                    <ScrollView horizontal={true} contentContainerStyle={styles.genreScroll}>
                        <Text style={styles.genre}>{categories}</Text>
                    </ScrollView>
                    <Dropdown
                        maxHeight={60}
                        iconColor={"black"}
                        style={styles.dropdownContainer}
                        containerStyle={styles.dropdown}
                        placeholderStyle={{textAlign: "center"}}
                        itemContainerStyle={styles.selectedText}
                        selectedTextStyle={styles.selectedText}
                        data={shelves}
                        fontFamily={"Agbalumo"}
                        labelField={"label"}
                        valueField={"value"}
                        onChange={item => {
                            handleAdd(item.value);
                        }}
                        value={chosenShelf}
                        placeholder={"Add to Shelf"}
                        onConfirmSelectItem={item => {placeholder}}
                    />
                </View>
            </View>
            <Text style={styles.descriptionHeader}>Description</Text>
            <ScrollView>
                <Text style={styles.desc}>{description}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 30,
        backgroundColor: "#FDDCB9",
        paddingTop: 10,
    },
    backButton: {
        width: 30,
        height: 30,
        marginBottom: 20,
    },
    book: {
        flexDirection: "row",
        gap: 30,
        width: "100%",
    },
    bookCover: {
        width: 175,
        height: 275,
        borderRadius: 30,
    },
    bookDetailsScroll: {
        height: 115
    },
    bookDetails: {
        flexDirection: "column",
        width: "45%",
    },
    bookTitle: {
        fontFamily: 'Agbalumo',
        fontSize: 24,
    },
    bookInfoText: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
    },
    bookPageText: {
        fontFamily: 'Agbalumo',
        fontSize: 14,
    },
    descriptionHeader: {
        paddingTop: 30,
        fontFamily: 'Agbalumo',
        fontSize: 20,
        marginBottom: 20
    },
    desc: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
    },
    genreScroll: {
        alignItems: "center",
    },
    genre: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
        backgroundColor: "#BE6A53",
        borderRadius: 30,
        textAlign: "center",
        paddingHorizontal: 20,
        marginTop: 10,
        paddingVertical: 4
    },
    dropdownContainer: {
        backgroundColor: "#BE6A53",
        borderRadius: 20,
        marginTop: 10,
        textAlign: "center",
        paddingVertical: 4
    },
    dropdown: {
        margin: 0,
        backgroundColor: "#BE6A53",
        textAlign: "center",
        borderColor: "#BE6A53",
    },
    selectedText: {
        textAlign: "center",
        backgroundColor: "#BE6A53",
        borderRadius: 20
    },
});
