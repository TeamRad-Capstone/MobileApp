import {ScrollView, Text, StyleSheet, View, Image, Pressable, Modal} from "react-native";
import {useRouter} from "expo-router";
import {useState} from "react";
import blurViewWeb from "expo-blur/src/BlurView.web";

const Profile = () => {
    // Placeholder username until fetched from API
    const username = "Tester";
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        console.log("Attempt to logout");
        setLogoutModalVisible(true);
    }

    const handleConfirmLogout = () => {
        // do something with backend API and authentication to cancel user and hide info / session details.
        console.log("Logout confirmed");
    }

    const handleCancelLogout = () => {
        setLogoutModalVisible(false);
    }

    const handleEditProfile = () => {
        console.log("Attempt to edit Profile");
        router.push("/(tabs)/(profile)/edit");
    }

    const showTransferModal = () => {
        setModalVisible(true);
    }

    const handleModalClose = () => {
        setModalVisible(false);
    }

    const handleImport = () => {
        console.log("Attempt to import historical data");
        // Read the csv file and send to API? Not sure how to implement yet
        // Accept the file and send to API from there API will parse to DB
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.heading}>
                <Pressable onPress={handleLogout}>
                    <Image
                        style={styles.icon}
                        source={require('@/assets/icons/logout.png')}
                    />
                </Pressable>
                <Text style={styles.title}>Welcome To Rad Reads</Text>
                <Pressable onPress={handleEditProfile}>
                    <Image
                        style={styles.icon}
                        source={require('@/assets/icons/edit.png')}
                    />
                </Pressable>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={logoutModalVisible}
            >
                <View style={styles.logoutModalView}>
                    <Text style={styles.logoutText}>Logout?</Text>
                    <View style={{flexDirection: "row", gap: "20%"}}>
                        <Pressable onPress={handleConfirmLogout}>
                            <Text style={styles.logoutBtn}>Yes</Text>
                        </Pressable>
                        <Pressable onPress={handleCancelLogout}>
                            <Text style={styles.logoutBtn}>No</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={styles.profileDetails}>
                <Image
                    style={styles.profileImage}
                    source={require('@/assets/images/profileImg.jpg')}
                />
                <Text style={styles.profileName}>{username}</Text>
            </View>

            <View style={styles.upcomingBooks}>
                <Text style={styles.upcomingBooksTitle}>Upcoming Books</Text>
                <ScrollView
                    horizontal={true}
                    style={styles.upcomingBooksScroll}
                >
                    {/* To be replaced by books (interactive w/ modal) as set up in database for each user based on upcoming preference*/}
                    <View style={styles.upcomingBooksItem}>
                        <Image
                            style={styles.bookItemImg}
                            source={require('@/assets/images/books/missing-you.jpg')}
                        />
                        <Image
                            style={styles.bookItemImg}
                            source={require('@/assets/images/books/missing-you.jpg')}
                        />
                        <Image
                            style={styles.bookItemImg}
                            source={require('@/assets/images/books/missing-you.jpg')}
                        />
                        <Image
                            style={styles.bookItemImg}
                            source={require('@/assets/images/books/missing-you.jpg')}
                        />
                    </View>
                </ScrollView>

                <Pressable style={styles.transferButton} onPress={showTransferModal}>
                    <Text style={styles.buttonText}>Transfer History</Text>
                </Pressable>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                >
                    <Pressable style={styles.modal} onPress={handleModalClose}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalHeader}>Transfer History?</Text>
                            <Pressable onPress={handleImport}>
                                <Text style={styles.modalBtn}>Import</Text>
                            </Pressable>
                            <Text style={styles.modalText}>Note:</Text>
                            <Text style={styles.modalText}>Goodreads csv file accepted</Text>
                        </View>
                    </Pressable>
                </Modal>
            </View>
        </ScrollView>
    );
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDDCB9',
        paddingTop: 60,
    },
    heading: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 24,
        fontFamily: "Agbalumo"
    },
    icon: {
        width: 30,
        height: 30,
    },
    profileDetails: {
        alignItems: "center",
        paddingTop: 20
    },
    profileImage: {
        height: 250,
        width: 250,
        borderRadius: 250
    },
    profileName: {
      fontFamily: "Agbalumo",
      fontSize: 18,
    },
    upcomingBooks: {
        alignItems: "center",
        paddingTop: 50
    },
    upcomingBooksTitle: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        paddingBottom: 15,
    },
    upcomingBooksScroll: {
        marginHorizontal: 30
    },
    upcomingBooksItem: {
        flexDirection: "row",
        gap: 30
    },
    bookItemImg: {
        height: 225,
        width: 150,
    },
    transferButton: {
        backgroundColor: "#BE6A53",
        marginTop: 50,
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    buttonText: {
        fontFamily: "Agbalumo",
        fontSize: 18,
    },
    modal: {
        flex: 1,
    },
    modalContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#BE6A53",
        marginHorizontal: "10%",
        marginVertical: "75%",
        paddingVertical: 20,
        borderRadius: 50,
    },
    modalHeader: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        marginBottom: 20,
    },
    modalBtn: {
        fontFamily: "Agbalumo",
        fontSize: 20,
        marginBottom: 20,
        backgroundColor: "#FDDCB9",
        paddingHorizontal: 30,
        paddingVertical: 4,
        borderRadius: 20,
        verticalAlign: "middle",
    },
    modalText: {
        fontFamily: "Agbalumo",
        fontSize: 20,
    },
    logoutModalView: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 10, 10, 0.8)",
        marginHorizontal: "10%",
        marginVertical: "75%",
        paddingVertical: 20,
        borderRadius: 50,
    },
    logoutText: {
        fontFamily: "Agbalumo",
        fontSize: 22,
        color: "white",
        marginBottom: 20,
    },
    logoutBtn: {
        fontFamily: "Agbalumo",
        fontSize: 22,
        color: "black",
        backgroundColor: "#E3E3E3",
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderRadius: 20,
    }
})