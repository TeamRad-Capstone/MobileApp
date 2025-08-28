import {StyleSheet, View, Text, Image, Pressable, ScrollView, TextInput} from "react-native";
import {useRouter} from "expo-router";
import {useState} from "react";

const Edit = () => {
    const router  = useRouter();

    const userEmail = "test@test.com";
    const username = "BookLovah";
    const [usernameChange, setUsernameChange] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleBackButton = () => {
        console.log("Back button clicked");
        console.log("Confirm exit prior to saving changes");
        router.push("/(tabs)/profile");
    }

    const handleImageChange = () => {
        console.log("Image change attempted");
        // Make a request to backend API to retrieve options
        // Once options have been retrieved, user makes a choice and choice is saved locally prior to handling Save
    }

    const handleSave = () => {
        console.log("Save button clicked");
        // Initiate call to backend API to save changes to username, password and image if applicable
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleBackButton}>
                    <Image
                        style={styles.headerIcon}
                        source={require("@/assets/icons/back-arrow.png")}
                    />
                </Pressable>
                <Text style={styles.headerText}>Edit Profile</Text>
            </View>
            <Text style={styles.userEmailText}>{userEmail}</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Pressable style={styles.changeImgPressable} onPress={handleImageChange}>
                    <Image
                        style={styles.profileImg}
                        source={require("@/assets/images/profileImg.jpg")}
                    />
                    <Text style={styles.editPhotoPrompt}>Change profile photo</Text>
                </Pressable>

                <View style={styles.formView}>
                    <Text style={styles.formText}>Current Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        editable={false}
                    />
                </View>

                <View style={styles.formView}>
                    <Text style={styles.formText}>New Username</Text>
                    <TextInput
                        style={styles.input}
                        value={usernameChange}
                        onChangeText={setUsernameChange}
                    />
                </View>

                <View style={styles.formView}>
                    <Text style={styles.formText}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        value={"*************"}
                        editable={false}
                    />
                </View>

                <View style={styles.formView}>
                    <Text style={styles.formText}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={styles.formView}>
                    <Text style={styles.formText}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmNewPassword}
                        onChangeText={setConfirmNewPassword}
                    />
                </View>

                <Pressable onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default Edit;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDDCB9',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: "25%"
    },
    headerIcon: {
        width: 30,
        height: 30,
        marginLeft: 20,
    },
    headerText: {
        fontFamily: "Agbalumo",
        fontSize: 24,
    },
    userEmailText: {
        fontFamily: "Agbalumo",
        fontSize: 16,
        textAlign: "center"
    },
    scrollContainer: {
        marginTop: 30,
        gap: 20
    },
    changeImgPressable: {
      alignItems: "center",
    },
    profileImg: {
        height: 250,
        width: 250,
        borderRadius: 250
    },
    editPhotoPrompt: {
        fontFamily: "Agbalumo",
        fontSize: 16,
        textAlign: "center",
        marginTop: 6
    },
    formView: {
        marginHorizontal: 40,
    },
    formText: {
        fontFamily: "Agbalumo",
        fontSize: 16,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 20,
        fontFamily: "Agbalumo",
        fontSize: 16,
        paddingLeft: 10
    },
    buttonText: {
        textAlign: "center",
        fontFamily: "Agbalumo",
        fontSize: 18,
        backgroundColor: "#BE6A53",
        marginHorizontal: "40%",
        borderRadius: 20,
        marginBottom: 50,
        paddingVertical: 4
    }
})