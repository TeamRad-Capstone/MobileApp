import { StyleSheet, View, Text, Image, Pressable } from "react-native";

type UpcomingBookProps = {
    title: string;
    author: string;
    coverUrl: string;
    triggerOpen: () => void;
}

const UpcomingBook = ({title, author, coverUrl, triggerOpen} : UpcomingBookProps) => {

    return (
            <Pressable onPress={triggerOpen}>
                <Image
                    style={styles.bookImg}
                    source={coverUrl? {uri: coverUrl} : require("@/assets/images/books/cover-not-found.jpg") }
                    accessibilityLabel={`Image of book title: ${title}`}
                />
            </Pressable>
    )
}

export default UpcomingBook

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bookImg: {
        height: 250,
        width: 150,
    }
})
