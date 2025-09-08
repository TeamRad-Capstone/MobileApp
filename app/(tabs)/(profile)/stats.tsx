import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";

const Stats = () => {
    const router =  useRouter();
    const handleBackButton = () => {
        console.log("Back button clicked");
        console.log("Confirm exit prior to saving changes");
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
                    <Text style={styles.headerText}>Stats</Text>
                </View>
            </View>
        </View>
    )
}

export default Stats;

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
        paddingLeft: 10
    },
    headerIcon: {
        width: 30,
        height: 30,
        position: "absolute",
    },
    headerText: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        textAlign: "center",
    },
})