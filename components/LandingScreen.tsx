import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

const LandingScreen = ({ children }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Welcome to Rad Reads</Text>
            </View>
            {children}
        </SafeAreaView>
    )
}

export default LandingScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: '-10%',
        height: '82%',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderWidth: 6,
        borderRadius: 70,
        borderColor: '#BE6A53',
        backgroundColor: '#FDDCB9',
    },
    welcomeContainer: {
        alignItems: 'center',
        paddingTop: 30,
    },
    welcomeText: {
        fontFamily: 'Agbalumo',
        fontSize: 36,
        paddingTop: 10,
    }
})