import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
const Login = () => {
    const heading = "Your digital reading companion";
    const cta = "Don't have an account?";
    const forgotPassword = "Forgot Password?";

    const handleLogin = () => {
      console.log('Login');
      // call the backend API (FastAPI) to handle logging in.
    }

    const handleRegister = () => {
        console.log('Register');
        // Use router to push to the register page - once developed
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
                <TextInput style={styles.formEntry} />
            </View>
            <View style={styles.loginForm}>
                <Text style={styles.formText}>Password:</Text>
                <TextInput style={styles.formEntry} />
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
        fontSize: 18
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