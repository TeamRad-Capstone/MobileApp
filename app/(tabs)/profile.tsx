import {ScrollView, Text, StyleSheet, View, Image, Pressable} from "react-native";
import {useRouter} from "expo-router";

const Profile = () => {
    // Placeholder username until fetched from API
    const username = "Tester";
    const router = useRouter();

    const handleLogout = () => {
        console.log("Attempt to logout");
    }

    const handleEditProfile = () => {
        console.log("Attempt to edit Profile");
        router.push("/(tabs)/(profile)/edit");
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
                    {/* To be replaced by books as set up in database for each user based on upcoming preference*/}
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

                <Pressable style={styles.transferButton}>
                    <Text style={styles.buttonText}>Transfer History</Text>
                </Pressable>
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
    }
})