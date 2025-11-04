import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  //Edit,
} from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AuthContext } from "@/contexts/AuthContext";
import { getUsername, changePassword } from "@/services/api";

const Edit = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { signout, user } = useContext(AuthContext);

  const [usernameVisible, setUsernameVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameChange, setUsernameChange] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [accountVisible, setAccountVisible] = useState(false);

  useEffect(() => {
    const loadStatic = async () => {
      setUsername(await getUsername());
    };
    loadStatic();
  }, []);

  const handleProfileImg = () => {
    console.log("Changing Profile Image");
  };

  const handleTransfer = () => {
    console.log("Attempt to import historical data");
    DocumentPicker.getDocumentAsync({}).then((doc) => {
      if (!doc.canceled) {
        const file = doc.assets.pop();
        const fileName = file ? file.name : "";
        console.log(fileName);
        router.push("/(tabs)/(profile)/transferred");
      } else {
        console.log("No file picked");
      }
    });
  };

  const handleUsernameSave = () => {
    console.log("Username Save button clicked");
    setUsername(usernameChange);
    setUsernameVisible(false);
  };

  const handlePasswordSave = async () => {
    console.log("Password Save button clicked");
    setPasswordError("");
    
    // Validation
    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!newPassword || !passwordRegex.test(newPassword)) {
      setPasswordError(
        "Your password must contain at least 1 uppercase letter, " +
          "1 lowercase letter, and 1 number, and be at least 8 characters long",
      );
      return;
    }

    if (!confirmNewPassword || confirmNewPassword !== newPassword) {
      setPasswordError("Your passwords must match");
      return;
    }

    setIsLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        Alert.alert("Success", "Password changed successfully!");
        setPasswordVisible(false);
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordError(result.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError("An error occurred while changing password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = () => {
    console.log("Account deletion button clicked");
    setAccountVisible(false);
  }

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await signout();
  };

  const clearPasswordModal = () => {
    setPasswordVisible(false);
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <SafeAreaView
      style={{
        paddingBottom: tabBarHeight,
        flex: 1,
        backgroundColor: "#F4F4E6",
      }}
    >
      <Pressable onPress={handleLogout}>
        <Image
          style={styles.icon}
          source={require("@/assets/icons/logout.png")}
        />
      </Pressable>
      <ScrollView>
        <Pressable onLongPress={handleProfileImg}>
          <Image
            style={styles.profileImage}
            source={require("@/assets/images/profileImg.jpg")}
          />
        </Pressable>
        <View style={styles.usernameView}>
          <Text style={styles.usernameText}>{username}</Text>
        </View>
        <Pressable style={styles.buttons} onPress={handleTransfer}>
          <Text style={styles.buttonText}>Transfer History</Text>
        </Pressable>
        <Pressable
          style={styles.buttons}
          onPress={() => setUsernameVisible(true)}
        >
          <Text style={styles.buttonText}>Change Username</Text>
        </Pressable>
        <Pressable
          style={styles.buttons}
          onPress={() => setPasswordVisible(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </Pressable>
        <Pressable style={styles.buttons}>
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => setAccountVisible(true)}
        >
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </Pressable>
      </ScrollView>

      {/* Modal for Changing Username */}
      <Modal transparent={true} visible={usernameVisible}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalText}>Current Username</Text>
            <TextInput style={styles.input} value={username} editable={false} />
            <Text style={styles.modalText}>New Username</Text>
            <TextInput 
              style={styles.input} 
              onChangeText={setUsernameChange}
              placeholder="Enter new username"
            />
          </View>
          <Pressable style={styles.saveBtn} onPress={handleUsernameSave}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setUsernameVisible(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Modal for Changing Password */}
      <Modal transparent={true} visible={passwordVisible}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalText}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!isLoading}
            />
            <Text style={styles.modalText}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!isLoading}
            />
            <Text style={styles.modalText}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              editable={!isLoading}
            />
          </View>
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
          <Pressable 
            style={[styles.saveBtn, isLoading && styles.disabledBtn]} 
            onPress={handlePasswordSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.btnText}>Save</Text>
            )}
          </Pressable>
          <Pressable
            style={[styles.cancelBtn, isLoading && styles.disabledBtn]}
            onPress={clearPasswordModal}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal transparent={true} visible={accountVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Confirm Delete?</Text>
          <Pressable style={styles.saveBtn} onPress={handleAccountDeletion}>
            <Text style={styles.btnText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={() => setAccountVisible(false)}>
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Edit;

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
    marginLeft: 30,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 200,
    marginTop: 30,
    marginHorizontal: "auto",
  },
  usernameView: {
    width: "80%",
    marginHorizontal: "auto",
  },
  usernameText: {
    marginTop: 16,
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  buttons: {
    width: "90%",
    height: 60,
    marginBottom: 22,
    borderRadius: 20,
    justifyContent: "center",
    marginHorizontal: "auto",
    backgroundColor: "#BDB59F",
  },
  buttonText: {
    color: "#4E4837",
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
  },
  deleteButton: {
    width: "90%",
    height: 60,
    marginBottom: 22,
    borderRadius: 20,
    justifyContent: "center",
    marginHorizontal: "auto",
    backgroundColor: "#B92628",
  },
  deleteBtnText: {
    color: "white",
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
  },
  modalContainer: {
    justifyContent: "center",
    backgroundColor: "#BDB59F",
    marginVertical: "auto",
    marginHorizontal: "14%",
    borderRadius: 40,
    borderWidth: 1,
    padding: 20,
  },
  modalText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    color: "#4E4837",
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 10,
    marginVertical: 5,
  },
  saveBtn: {
    backgroundColor: "#83884E",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
    minWidth: 100,
    minHeight: 40,
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: "#B92628",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    minWidth: 100,
    minHeight: 40,
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    color: "white",
  },
  errorText: {
    fontFamily: "Agbalumo",
    fontSize: 14,
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  disabledBtn: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
});

{/* I AM SUFFERING, HELP. I WAS THROWN IN HALFWAY THROUGH AND I HAVE NO CLUE WHAT I AM DOING, MY BRAIN HURTS TRYING TO PROCESS THIS*/ }
