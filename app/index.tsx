import {ImageBackground, StyleSheet, Text, View} from "react-native";
import LandingScreen from "@/components/LandingScreen";

export default function Index() {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/landing.jpg')}
                style={styles.bgImage}
                resizeMode="cover"
            >
                <LandingScreen>
                </LandingScreen>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bgImage: {
        width: "100%",
        height: "100%",
        outlineOffset: 5,
    },
    text: {
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center",
    }
})