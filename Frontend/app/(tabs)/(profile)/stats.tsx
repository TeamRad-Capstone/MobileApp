import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

const Stats = () => {
    const router =  useRouter();
    const handleBackButton = () => {
        console.log("Back button clicked");
        console.log("Confirm exit prior to saving changes");
        router.push("/(tabs)/profile");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
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
        </SafeAreaView>
    )
}

export default Stats;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDDCB9",
    },
    header: {
        marginHorizontal: "auto"
    },
    back: {
        paddingLeft: 30
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