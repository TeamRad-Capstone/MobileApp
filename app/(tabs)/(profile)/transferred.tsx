import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";

const Transferred = () => {
    const router = useRouter();

    const handleBackButton = () => {
        router.push("/(tabs)/profile");
    }
    return (
        <View style={styles.container}>
            <View style={{flexDirection: "row", position: "fixed" }}>
                <View style={styles.back}>
                    <Pressable onPress={handleBackButton}>
                        <Image
                            style={styles.headerIcon}
                            source={require("@/assets/icons/back-arrow.png")}
                        />
                    </Pressable>
                </View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Transferred History</Text>
                </View>
            </View>
        </View>
    )
}

export default Transferred;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDDCB9",
        paddingTop: 60,
    },
    header: {
        marginHorizontal: "auto"
    },
    back: {
        paddingLeft: 30,
    },
    headerIcon: {
        width: 30,
        height: 30,
        position: "absolute",
        marginTop: 6,
    },
    headerText: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        textAlign: "center",
    },
})