import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState} from "react";
import { useRouter } from "expo-router";
import { createUser } from "@/services/api";

const Register = () => {
    const heading = "Create an Account";

    const [email, setEmail] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState("");
    const [usernameErrorMsg, setUsernameErrorMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const handleFormCleanUp = () => {
        setEmail("");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        handleErrorCleanUp();
    }

    const handleErrorCleanUp = () => {
        setEmailErrorMsg("");
        setPasswordErrorMsg("");
        setConfirmPasswordErrorMsg("");
        setUsernameErrorMsg("");
        setErrorMsg("");
    }

    const handleRegister = () => {
        console.log('Attempt to Register');
        let validFields = true;
        handleErrorCleanUp();

        if (!email || !emailRegex.test(email)) {
            setEmailErrorMsg("Please enter a valid email address");
            validFields = false;
        }

        if (!username) {
            setUsernameErrorMsg("Please enter a username");
            validFields = false;
        }

        if (!password || !passwordRegex.test(password)) {
            setPasswordErrorMsg("Your password must  must contain at least 1 uppercase letter, " +
                "1 lowercase letter, and 1 number");
            validFields = false;
        }

        if (!confirmPassword || confirmPassword !== password) {
            setConfirmPasswordErrorMsg("Your password must match");
            validFields = false;
        }
        // Call the backend api to register user into the database if valid fields = true
        // If successful, push back to login page
        if (validFields) {
            handleFormCleanUp();
            console.log("Fields are valid");
            createUser(email, username, password).then(r => console.log("API Call successfully registered: " + r));
            // Push to the login page
            router.push("/");
        }
    }

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.registerForm}>
                <Text style={styles.formText}>Email:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setEmail}
                    value={email}
                />
                {emailErrorMsg && <Text style={styles.error}>{emailErrorMsg}</Text>}
            </View>
            <View style={styles.registerForm}>
                <Text style={styles.formText}>Username:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setUsername}
                    value={username}
                />
                {usernameErrorMsg && <Text style={styles.error}>{usernameErrorMsg}</Text>}
            </View>
            <View style={styles.registerForm}>
                <Text style={styles.formText}>Password:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                {passwordErrorMsg && <Text style={styles.error}>{passwordErrorMsg}</Text>}
            </View>
            <View style={styles.registerForm}>
                <Text style={styles.formText}>Confirm Password:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    secureTextEntry={true}
                />
                {confirmPasswordErrorMsg && <Text style={styles.error}>{confirmPasswordErrorMsg}</Text>}
            </View>
            <View style={styles.actionButtons}>
                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
                {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
            </View>
        </View>
    );
}

export default Register;

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    heading: {
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'Agbalumo',
        fontSize: 22,
        marginBottom: "5%",
        width: "70%"
    },
    registerForm: {
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
        fontSize: 14,
        color: "red",
        textAlign: "center",
        marginBottom: "-7%"
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
    },
    prompt: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
    }
})