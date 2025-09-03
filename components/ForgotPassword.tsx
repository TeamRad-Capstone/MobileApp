import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState} from "react";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
    const heading = "Forgot your password?\nEnter a valid email";

    const [email, setEmail] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [emailErrorMsg, setEmailErrorMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const handleReset = () => {
        let valid = true;

        if (!email || !emailRegex.test(email)) {
            setEmailErrorMsg("Please enter a valid email");
            valid = false;
        }

        console.log("Attempt to reset password")
        if (valid) {
            setEmail("");
            setEmailErrorMsg("");
            setErrorMsg("");
            router.push("/");
        }

    }

    return (
        <View style={styles.forgotContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.forgotForm}>
                <Text style={styles.formText}>Email:</Text>
                <TextInput
                    style={styles.formEntry}
                    value={email}
                    onChangeText={setEmail}
                />
                {emailErrorMsg && <Text style={styles.error}>{emailErrorMsg}</Text>}
            </View>
            <View style={styles.actionButtons}>
                <Pressable style={styles.button} onPress={handleReset}>
                    <Text style={styles.buttonText}>Reset password</Text>
                </Pressable>
            </View>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
        </View>
    );
}

export default ForgotPassword;

const styles = StyleSheet.create({
    forgotContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    heading: {
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Agbalumo',
        fontSize: 22,
        marginBottom: "10%",
        width: "70%"
    },
    forgotForm: {
        marginHorizontal: "auto",
        width: "80%",
        marginBottom: "5%",
    },
    formText: {
        fontFamily: 'Agbalumo',
        fontSize: 20,
        paddingBottom: "2.5%",
        paddingLeft: "5%"
    },
    formEntry: {
        backgroundColor: '#BE6A53',
        borderRadius: 20,
        color: "white",
        fontFamily: 'Agbalumo',
        fontSize: 18,
        height: 50,
        paddingLeft: 16,
        paddingRight: 16,
    },
    error: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
        color: "red",
        textAlign: "center"
    },
    actionButtons: {
        alignItems: 'center',
        marginTop: "5%",
    },
    button: {
        backgroundColor: '#BE6A53',
        paddingVertical: "1.5%",
        paddingHorizontal: "7%",
        borderRadius: 20,
        marginBottom: "3%",
    },
    buttonText: {
        fontFamily: 'Agbalumo',
        fontSize: 24,
        color: 'white',
    }
})