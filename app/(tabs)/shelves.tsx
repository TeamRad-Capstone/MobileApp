import {StyleSheet, ScrollView, View, Text, Pressable, Image} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Shelves = () => {
    const wantToReadShelf = "Want to Read";
    const currentlyReadingShelf = "Currently Reading";
    const customShelves = [
        "Absolute favourites",
        "I really wanted to like...but did not",
        "test 1",
        "test 2",
    ];

    const shelves = [wantToReadShelf, currentlyReadingShelf,  ...customShelves];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Shelves</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {shelves.map((item, index) => (
                    <View
                        key={index}
                        style={styles.shelfContainer}
                    >
                        <View style={{width: "30%", height: "100%"}}>
                            <Image
                                resizeMode={"cover"}
                                style={styles.shelfCover}
                                source={require("@/assets/images/books/cover-not-found.jpg")}
                            />
                        </View>
                        <View style={styles.shelf}>
                            <Pressable>
                                <Text style={styles.shelfText}>{item}</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}

                <Pressable>
                    <Image
                        style={styles.icon}
                        source={require("@/assets/icons/plus.png")}
                    />
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Shelves;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDDCB9"
    },
    header: {
        alignItems: "center",
    },
    title: {
        fontFamily: "Agbalumo",
        fontSize: 24
    },
    scrollContainer: {
        marginTop: 30,
        gap: 50,
        flexDirection: "column",
        paddingBottom: 60
    },
    shelfContainer: {
        flexDirection: "row",
        backgroundColor: "#BE6A53",
        width: "80%",
        height: 150,
        marginHorizontal: "auto",
        borderRadius: 40,
    },
    shelfCover: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40
    },
    shelf: {
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        marginRight: 130
    },
    shelfText: {
        fontFamily: "Agbalumo",
        fontSize: 18
    },
    icon: {
        height: 50,
        width: 50,
        marginHorizontal: "auto"
    }
})