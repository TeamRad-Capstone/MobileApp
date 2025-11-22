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
} from "react-native";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { AuthContext } from "@/contexts/AuthContext";
import { apiCall } from "@/services/api";

const Edit = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const { signout, user } = useContext(AuthContext); // Get user from AuthContext

  const [usernameVisible, setUsernameVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameChange, setUsernameChange] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [accountVisible, setAccountVisible] = useState(false);
  
  // New states for profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [imagePickerVisible, setImagePickerVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadStatic = async () => {
      // Prefer username from AuthContext user if available
      setUsername((user as any)?.username ?? "");
      // Load current profile image from backend
      await loadProfileImage();
    };
    loadStatic();
  }, [user]);

  // Load profile image from backend
  const loadProfileImage = async () => {
    try {
      const data = await apiCall('/users/profile', 'GET');
      if (data.profile_image_url) {
        setProfileImage(data.profile_image_url);
      }
    } catch (error) {
      console.log("Error loading profile image:", error);
    }
  };

  // Profile Image Functions
  const handleProfileImg = () => {
    setImagePickerVisible(true);
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow gallery access to change your profile image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndUploadImage(result.assets[0].uri);
    }
    setImagePickerVisible(false);
  };

  const handleAccountDeletion = async () => {
  try {
    console.log("Account deletion button clicked");
    
    // Add confirmation dialog for safety
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiCall('/users/account', 'DELETE', {
                username: username // using the username from state
              });
              
              setAccountVisible(false);
              Alert.alert(
                'Success', 
                'Account deleted successfully',
                [
                  {
                    text: 'OK',
                    onPress: () => signout()
                  }
                ]
              );
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          }
        }
      ]
    );
    
  } catch (error: any) {
    Alert.alert('Error', error.message || 'Failed to delete account');
  }
}

  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await processAndUploadImage(result.assets[0].uri);
    }
    setImagePickerVisible(false);
  };

  const processAndUploadImage = async (imageUri: string) => {
    setUploadingImage(true);
    
    try {
      // Optimize image before upload
      const processedImage = await manipulateAsync(
        imageUri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // Convert image to base64 for backend
      const response = await fetch(processedImage.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        try {
          // Upload to backend API
          await apiCall('/users/profile-image', 'PUT', {
            image_url: base64data
          });
          
          setProfileImage(processedImage.uri);
          Alert.alert('Success', 'Profile image updated!');
        } catch (error) {
          Alert.alert('Upload Failed', 'Could not update profile image. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      };
      
      reader.readAsDataURL(blob);
      
    } catch (error) {
      Alert.alert('Upload Failed', 'Could not update profile image. Please try again.');
      setUploadingImage(false);
    }
  };

  // Existing functions 
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

  const handleUsernameSave = async () => {
    try {
      console.log("Username Save button clicked");
      
      if (!usernameChange.trim()) {
        Alert.alert('Error', 'Please enter a new username');
        return;
      }

      await apiCall('/users/username', 'PUT', {
        new_username: usernameChange
      });

      setUsername(usernameChange);
      setUsernameVisible(false);
      Alert.alert('Success', 'Username updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update username');
    }
  };

  const handlePasswordSave = async () => {
    // clear previous error
    setPasswordError("");

    console.log("Password Save button clicked");

    const np = (newPassword || "").trim();
    const cp = (confirmNewPassword || "").trim();

    if (!np) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (!passwordRegex.test(np)) {
      setPasswordError(
        "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter and 1 number."
      );
      return;
    }

    if (np !== cp) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      await apiCall('/users/password', 'POST', { 
        new_password: np
      });
      console.log("Password updated successfully");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordVisible(false);
      Alert.alert("Success", "Password changed successfully.");
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
      console.log("Error updating password:", error);
    }
  };

  const handleLogout = async () => {
    console.log("Logout button clicked");
    await signout();
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
                  ? { uri: profileImage } 
                  : require("@/assets/images/profileImg.jpg")
              }
            />
            {uploadingImage && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.uploadText}>Uploading...</Text>
              </View>
            )}
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

      {/* Image Picker Modal */}
      <Modal transparent={true} visible={imagePickerVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Change Profile Image</Text>
          <Pressable style={styles.imageOptionBtn} onPress={pickImageFromGallery}>
            <Text style={styles.btnText}>Choose from Gallery</Text>
          </Pressable>
          <Pressable style={styles.imageOptionBtn} onPress={takePhotoWithCamera}>
            <Text style={styles.btnText}>Take Photo</Text>
          </Pressable>
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
            <Text style={styles.modalText}>New Password</Text>
            <TextInput 
              style={styles.input} 
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry
              placeholder="Enter new password"
              autoCapitalize="none"
            />
            <Text style={styles.modalText}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setConfirmNewPassword}
              value={confirmNewPassword}
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
          <Text style={[styles.modalText, {fontSize: 14, marginBottom: 20}]}>
            This action cannot be undone.
          </Text>
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
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 200,
    marginTop: 30,
    marginHorizontal: "auto",
  },
  uploadOverlay: {
    position: 'absolute',
    top: 30,
    left: '50%',
    marginLeft: -125,
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 200,
  },
  uploadText: {
    color: '#FFFFFF',
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
    width: '80%',
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