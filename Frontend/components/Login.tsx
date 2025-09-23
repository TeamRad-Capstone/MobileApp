import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";

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
  const { signin } = useContext(AuthContext);

  const handleFormCleanUp = () => {
    setEmail("");
    setPassword("");
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    setErrorMsg("");
  };

  const handleLogin = async () => {
    let validFields = true;
    console.log("Attempt to Login");

    if (!email || !emailRegex.test(email)) {
      setEmailErrorMsg("Please enter a valid email");
      validFields = false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordErrorMsg(
        "Your password must  must contain at least 1 uppercase letter, " +
          "1 lowercase letter, and 1 number",
      );
      validFields = false;
    }

    if (validFields) {
      handleFormCleanUp();
      await signin(email, password);
      router.push("/(tabs)/profile");
    }
  };

  const handleRegister = () => {
    console.log("Move to Register page");
    handleFormCleanUp();
    router.push("/register");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password");
    handleFormCleanUp();
    router.push("/forgot");
  };

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
        {passwordErrorMsg && (
          <Text style={styles.error}>{passwordErrorMsg}</Text>
        )}
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
};

export default Login;

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6F2EA",
    paddingHorizontal: 20,
  },
  heading: {
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "Agbalumo",
    fontSize: 26,
    marginBottom: 40,
    color: "#5A5D37",
  },
  loginForm: {
    width: "100%",
    marginBottom: 20,
  },
  formText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    paddingBottom: 8,
    color: "#5A5D37",
  },
  formEntry: {
    backgroundColor: "#797D49",
    borderRadius: 20,
    color: "white",
    fontFamily: "Agbalumo",
    fontSize: 18,
    height: 50,
    paddingLeft: 16,
    paddingRight: 16,
  },
  error: {
    fontFamily: "Agbalumo",
    fontSize: 14,
    color: "#9B2426",
    textAlign: "center",
    marginTop: 4,
  },
  actionButtons: {
    alignItems: "center",
    marginTop: 30,
    gap: 10,
  },
  button: {
    backgroundColor: "#5A5D37",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  prompt: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "#5A5D37",
    marginVertical: 4,
  },
});
