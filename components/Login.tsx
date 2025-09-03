import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState} from "react";
import { useRouter } from "expo-router";
import { testConnection } from "@/services/api";

const Login = () => {
    const heading = "Your digital reading companion";
    const cta = "Don't have an account?";
    const forgotPassword = "Forgot Password?";

    const [email, setEmail] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [password, setPassword] = useState("");
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const handleLogin = () => {
        let validFields = true;
      console.log('Attempt to Login');

      if (!email || !emailRegex.test(email)) {
          setEmailErrorMsg("Please enter a valid email");
          validFields = false;
      }

      if (!passwordRegex.test(password)) {
          setPasswordErrorMsg("Your password must  must contain at least 1 uppercase letter, " +
              "1 lowercase letter, and 1 number");
          validFields = false;
      }

      if (validFields) {
          router.push("./(tabs)/profile");
      }
      // testConnection()
        // call the backend API (FastAPI) to handle logging in if validFields = true.
        // logging in logic and validation to be done in the back end
        // send error message back to front end potentially and display as necessary.
    }

    const handleRegister = () => {
        console.log('Move to Register page');
        // Use router to push to the register page - once developed
        router.push("/register")
    }

    const handleForgotPassword = () => {
        console.log('Forgot Password');
        // Use the router to push the forgot password page - once developed
    }

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.heading}>{heading}</Text>
            <View style={styles.loginForm}>
                <Text style={styles.formText}>Email:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setEmail}
                    value={email}
                />
                {emailErrorMsg && <Text style={styles.error}>{emailErrorMsg}</Text>}
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.formText}>Password:</Text>
                <TextInput
                    style={styles.formEntry}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                {passwordErrorMsg && <Text style={styles.error}>{passwordErrorMsg}</Text>}
            </View>
            <View style={styles.actionButtons}>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
                <Text style={styles.prompt}>{cta}</Text>
                <Pressable style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
                <Pressable onPress={handleForgotPassword}>
                    <Text style={styles.prompt}>{forgotPassword}</Text>
                </Pressable>
                {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
            </View>
        </View>
    );
}

export default Login;

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
        marginBottom: "10%",
        width: "70%"
    },
    loginForm: {
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
    },
    prompt: {
        fontFamily: 'Agbalumo',
        fontSize: 16,
    }
})