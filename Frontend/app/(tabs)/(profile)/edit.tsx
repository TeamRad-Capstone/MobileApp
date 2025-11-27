import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { AuthContext } from "@/contexts/AuthContext";
import {
  getUsername,
  updateUsername,
  updatePassword,
  getProfileImage,
  updateProfileImage,
  deleteAccount,
} from "@/services/api";
import images from "@/data/profileImgManager";

const Edit = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { signout, user } = useContext(AuthContext); // Get user from AuthContext

  const [usernameVisible, setUsernameVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameChange, setUsernameChange] = useState("");
  const [valueChanged, setValueChanged] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [accountVisible, setAccountVisible] = useState(false);

  // New states for profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  useEffect(() => {
    const retrieveUser = async () => {
      await getUsername().then((retrievedUsername) => {
        setUsername(retrievedUsername);
      });

      let profileImage = await getProfileImage();
      console.log("Profile image: " + profileImage);

      if (profileImage in images) {
        console.log("Setting profile image from local images");
        setProfileImage(images[profileImage as keyof typeof images]);
      }
    };
    retrieveUser();
  }, [user, valueChanged]);

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await signout();
  };

  const handleProfileImg = () => {
    setImagePickerVisible(true);
  };

  const handleTransfer = () => {
    console.log("Attempt to import historical data");
  };

  const handleUsernameSave = async () => {
    // console.log("Username Save button clicked");
    await updateUsername(usernameChange);
    setValueChanged(!valueChanged);
    setUsernameVisible(false);
  };

  const handlePasswordSave = async () => {
    console.log("Password Save button clicked");

    if (!oldPassword) {
      setPasswordError("Please enter your old password");
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        "Your password must contain at least 1 uppercase letter, " +
          "1 lowercase letter, and 1 number",
      );
    } else if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match");
    } else {
      try {
        await updatePassword(oldPassword, newPassword);
        setPasswordVisible(false);
        alert("Password updated successfully");
      } catch (error: any) {
        setPasswordError(error.message || "Failed to update password");
      }
    }
  };

  const handleAccountDeletion = async () => {
    console.log("Account deletion button clicked");
    try {
      // Call API to delete account
      await deleteAccount(deletePassword);
      setAccountVisible(false);
    } catch (error: any) {
      console.log(error.message || "Account deletion failed");
    } finally {
      router.replace("/");
      signout();
    }
  };

  const handleImgUpdate = async (imageKey: string) => {
    console.log("Profile image updated to: " + imageKey);
    updateProfileImage(imageKey);
    setImagePickerVisible(false);
    setValueChanged(!valueChanged);
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
        <Pressable onPress={handleProfileImg}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={
                profileImage
                  ? profileImage
                  : require("@/assets/images/profile-images/blue-vibes.jpg")
              }
            />
          </View>
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
          onPress={() => {
            setPasswordVisible(true);
            setPasswordError("");
          }}
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

      {/* Image Picker Modal */}
      <Modal transparent={true} visible={imagePickerVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Choose an Image</Text>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              gap: 20,
            }}
          >
            {Object.keys(images).map((key) => (
              <Pressable key={key} onPress={() => handleImgUpdate(key)}>
                <Image
                  style={styles.profileImage}
                  source={images[key as keyof typeof images]}
                />
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setImagePickerVisible(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

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
              autoCapitalize="none"
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

      {/* Modal for Changing Password*/}
      <Modal transparent={true} visible={passwordVisible}>
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalText}>Old Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setOldPassword}
              secureTextEntry
              placeholder="Enter old password"
              autoCapitalize="none"
            />
            <Text style={styles.modalText}>New Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="Enter new password"
              autoCapitalize="none"
            />
            <Text style={styles.modalText}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
              placeholder="Confirm new password"
              autoCapitalize="none"
            />
          </View>
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
          <Pressable style={styles.saveBtn} onPress={handlePasswordSave}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setPasswordVisible(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Delete Account Modal */}
      <Modal transparent={true} visible={accountVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Confirm Delete?</Text>
          <Text style={[styles.modalText, { fontSize: 14, marginBottom: 20 }]}>
            This action cannot be undone.
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setDeletePassword}
            placeholder="Enter password to confirm"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          <Pressable style={styles.saveBtn} onPress={handleAccountDeletion}>
            <Text style={styles.btnText}>Delete</Text>
          </Pressable>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setAccountVisible(false)}
          >
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
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 200,
    marginTop: 30,
    marginHorizontal: "auto",
  },
  uploadOverlay: {
    position: "absolute",
    top: 30,
    left: "50%",
    marginLeft: -125,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 200,
  },
  uploadText: {
    color: "#FFFFFF",
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Agbalumo",
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
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: "#83884E",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },
  imageOptionBtn: {
    backgroundColor: "#007AFF",
    alignItems: "center",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
    width: "80%",
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
  },
});
