import {View, StyleSheet, Text, Image, ScrollView, TextInput} from "react-native";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";

const Search = () => {
    const [searchParam, setSearchParams] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headingText}>Search</Text>
            <View style={styles.headerView}>
                <Image
                    style={styles.searchIcon}
                    source={require('@/assets/icons/search.png')}
                />
                <TextInput
                    style={styles.searchInput}
                    value={searchParam}
                    onChangeText={setSearchParams}
                />
            </View>
            <ScrollView>
            {/* Add a way to load books from searching through API
                Send search params to backend API and do retrieval from OpenBooks API
                for data to parse in the app. */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDDCB9',
    },
    headingText: {
        fontFamily: "Agbalumo",
        fontSize: 24,
        textAlign: "center",
    },
    headerView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        marginHorizontal: 25,
        alignItems: 'center',
        marginTop: 10
    },
    searchIcon: {
        height: 30,
        width: 30,
        marginLeft: 15,
    }      ,
    searchInput: {
        marginRight: 50,
        fontFamily: "Agbalumo",
        fontSize: 16,
        height: 50
    }
})