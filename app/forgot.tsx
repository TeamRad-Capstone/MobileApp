import { ImageBackground, StyleSheet, View } from "react-native";
import { useState } from "react";
import LandingScreen from "@/components/LandingScreen";
import ForgotPassword from "@/components/ForgotPassword";

export default function Forgot() {
    const [bgLoaded, setBgLoaded] = useState(false);
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('@/assets/images/landing.jpg')}
                style={styles.bgImage}
                resizeMode="cover"
                onLoad={() => setBgLoaded(true)}
            >
                {bgLoaded &&
                    <LandingScreen>
                        <ForgotPassword/>
                    </LandingScreen>
                }
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