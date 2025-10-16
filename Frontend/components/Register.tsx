import { createUser } from "@/services/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleFormCleanUp = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    handleErrorCleanUp();
  };

  const handleErrorCleanUp = () => {
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    setConfirmPasswordErrorMsg("");
    setUsernameErrorMsg("");
    setErrorMsg("");
  };

  const handleRegister = async () => {
    console.log("Attempt to Register");
    handleErrorCleanUp();
    let validFields = true;

    const emailTrim = email.trim();
    const usernameTrim = username.trim();

    if (!emailTrim || !emailRegex.test(emailTrim)) {
      setEmailErrorMsg("Please enter a valid email address");
      validFields = false;
    }

    if (!usernameTrim) {
      setUsernameErrorMsg("Please enter a username");
      validFields = false;
    }

    if (!password || !passwordRegex.test(password)) {
      setPasswordErrorMsg(
        "Your password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
      validFields = false;
    }

    if (!confirmPassword || confirmPassword !== password) {
      setConfirmPasswordErrorMsg("Passwords do not match");
      validFields = false;
    }

    if (!validFields) return;

    try {
      setSubmitting(true);
      const res = await createUser(emailTrim, usernameTrim, password);
      console.log("API Call successfully registered:", res);
      router.push("/");
      handleFormCleanUp();
    } catch (e: any) {
      const msg = e?.message || "Registration failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.registerForm}>
        <Text style={styles.formText}>Email:</Text>
        <TextInput
          style={styles.formEntry}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        {emailErrorMsg && <Text style={styles.error}>{emailErrorMsg}</Text>}
      </View>
      <View style={styles.registerForm}>
        <Text style={styles.formText}>Username:</Text>
        <TextInput
          style={styles.formEntry}
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
        />
        {usernameErrorMsg && (
          <Text style={styles.error}>{usernameErrorMsg}</Text>
        )}
      </View>
      <View style={styles.registerForm}>
        <Text style={styles.formText}>Password:</Text>
        <TextInput
          style={styles.formEntry}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
          textContentType="password"
        />
        {passwordErrorMsg && (
          <Text style={styles.error}>{passwordErrorMsg}</Text>
        )}
      </View>
      <View style={styles.registerForm}>
        <Text style={styles.formText}>Confirm Password:</Text>
        <TextInput
          style={styles.formEntry}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          textContentType="password"
        />
        {confirmPasswordErrorMsg && (
          <Text style={styles.error}>{confirmPasswordErrorMsg}</Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <Pressable
          style={[styles.button, submitting && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>{submitting ? "Registering..." : "Register"}</Text>
        </Pressable>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </View>
  );
};

export default Register;

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
    fontSize: 24,
    marginBottom: "5%",
    width: "70%",
    color: "#5A5D37",
  },
  registerForm: {
    width: "100%",
    marginBottom: "5%",
  },
  formText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    paddingBottom: "2.5%",
    paddingLeft: "5%",
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
    marginBottom: "-7%",
  },
  actionButtons: {
    alignItems: "center",
    marginTop: "5%",
    gap: 10,
  },
  button: {
    backgroundColor: "#5A5D37",
    paddingVertical: "2%",
    paddingHorizontal: "7%",
    borderRadius: 20,
    marginBottom: "3%",
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 22,
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
