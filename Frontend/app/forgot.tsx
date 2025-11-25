// components/ForgotPassword.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { apiCall } from "@/services/api";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRequestReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await apiCall("/auth/forgot-password", "POST", { email: email.toLowerCase() });
      Alert.alert("Success", "Password reset instructions have been sent to your email");
      setStep("verify");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Password validation regex (same as in your edit.tsx)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter and 1 number."
      );
      return;
    }

    setLoading(true);
    try {
      await apiCall("/auth/reset-password", "POST", {
        token: resetToken,
        new_password: newPassword,
      });
      
      Alert.alert("Success", "Password has been reset successfully", [
        { text: "OK", onPress: () => router.replace("/login") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      
      {step === "request" ? (
        <View style={styles.form}>
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          
          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRequestReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Instructions</Text>
            )}
          </Pressable>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.description}>
            Enter the reset code you received and your new password.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter reset code"
            value={resetToken}
            onChangeText={setResetToken}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <Pressable 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
            )}
          </Pressable>
        </View>
      )}
      
      <Pressable style={styles.backButton} onPress={handleBackToLogin}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontFamily: "Agbalumo",
    color: "#4E4837",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: "System",
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "System",
  },
  button: {
    backgroundColor: "#83884E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Agbalumo",
    textAlign: "center",
  },
  backButton: {
    padding: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#83884E",
    fontSize: 16,
    fontFamily: "System",
    textDecorationLine: "underline",
  },
});