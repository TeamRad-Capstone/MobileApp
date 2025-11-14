import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import SearchBar from "@/components/SearchBar";
import {
  Book,
  deleteCustomShelf,
  editShelfName,
  getBooksFromShelf,
  removeBookFromShelf,
} from "@/services/api";
import ShelfBook from "@/components/ShelfBook";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/core";
import { Dropdown } from "react-native-element-dropdown";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const ShelfDetails = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { shelf, user_id, title } = useLocalSearchParams();
  const shelf_id = parseInt(shelf as string);
  const end_user_id = parseInt(user_id as string);
  const shelf_name = title as string;
  const [currentShelfName, setCurrentShelfName] = useState(title as string);

  const [searchParam, setSearchParam] = useState("");
  const [editableTitle, setEditableTitle] = useState(false);
  const [shelfTitle, setShelfTitle] = useState("");
  const [changedTitle, setChangedTitle] = useState(false);

  const [deletionState, setDeletionState] = useState(false);

  let sortByValues = [
    { label: "Author", value: "Author" },
    { label: "Title", value: "Title" },
    { label: "Genre", value: "Genre" },
    { label: "Date Added", value: "Date Added" },
  ];

  if (
    shelf_name !== "Want to Read" &&
    shelf_name !== "Dropped" &&
    shelf_name !== "Currently Reading"
  ) {
    sortByValues.push(
      { label: "Date Read", value: "Date Read" },
      { label: "Rating", value: "Rating" },
    );
  }

  const [chosenSort, setChosenSort] = useState(0);
  // React navigation - core library
  const isFocused = useIsFocused();

  const searchInShelf = () => {
    console.log("searching for book in shelf");
  };

  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (isFocused) {
      const loadBooks = async () => {
        try {
          const allBooks = await getBooksFromShelf(shelf_name);
          setBooks(allBooks);
        } catch (error: any) {
          console.log("Error while retrieving books");
          console.error(error);
        }
      };
      loadBooks();
    }
  }, [
    end_user_id,
    shelf_id,
    shelf_name,
    title,
    isFocused,
    deletionState,
    changedTitle,
  ]);

  // Check if shelf name and not a custom shelf from api
  const checkIfDefaultShelf = () => {
    if (
      title === "Want to Read" ||
      title === "Dropped" ||
      title === "Currently Reading" ||
      title === "Read"
    ) {
      return true;
    }
    return false;
  };

  const handleEditClose = () => {
    setEditableTitle(false);
    setShelfTitle("");
  };

  const handleEditSave = async (new_name: string) => {
    try {
      if (new_name === currentShelfName) {
        handleEditClose();
        alert("Cannot use empty name or same name");
        return;
      }
      await editShelfName(shelf_name, shelfTitle.trim());
      setCurrentShelfName(shelfTitle.trim());
      setChangedTitle(!changedTitle);
      router.setParams({
        title: shelfTitle.trim(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setEditableTitle(false);
      setShelfTitle("");
    }
  };

  const handleBookRemoval = async (
    shelf_name: string,
    google_book_id: string,
  ) => {
    await removeBookFromShelf(shelf_name, google_book_id);
    setDeletionState(!deletionState);
  };

  const handleDeletion = async () => {
    console.log("Current Shelf Id: ", shelf_id);
    await deleteCustomShelf(shelf_name);
    router.replace("/shelves_v2");
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingRight: 0,
        backgroundColor: "#F6F2EA",
        paddingTop: 10,
        paddingBottom: tabBarHeight,
      }}
    >
      <View style={styles.titleView}>
        <Text style={styles.shelfTitle}>{title}</Text>
        {!checkIfDefaultShelf() && (
          <Pressable onPress={() => setEditableTitle(true)}>
            <Image
              style={{ height: 20, width: 20 }}
              source={require("@/assets/icons/edit.png")}
            />
          </Pressable>
        )}
      </View>

      <SearchBar
        searchText={searchParam}
        setSearchText={setSearchParam}
        submitSearchText={searchInShelf}
      />

      <View style={styles.sorting}>
        <Dropdown
          maxHeight={50}
          fontFamily={"Agbalumo"}
          iconColor={"black"}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          placeholderStyle={{ textAlign: "right" }}
          itemTextStyle={{ textAlign: "right" }}
          selectedTextStyle={{ textAlign: "right" }}
          activeColor={"#F6F2EA"}
          data={sortByValues}
          placeholder="Sort By"
          labelField={"label"}
          valueField={"value"}
          onChange={() => {}}
        />
        <SegmentedControl
          values={["Ascending", "Descending"]}
          selectedIndex={chosenSort}
          onChange={(chosen) => {
            setChosenSort(chosen.nativeEvent.selectedSegmentIndex);
          }}
          style={styles.sortSegment}
          activeFontStyle={{ color: "#A65926" }}
          fontStyle={{ fontFamily: "Agbalumo" }}
        />
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <ShelfBook
              key={book.google_book_id}
              shelf_name={shelf_name}
              google_book_id={book.google_book_id}
              title={book.title}
              authors={book.authors}
              description={book.description}
              number_of_pages={book.number_of_pages}
              categories={book.categories}
              published_date={book.published_date}
              onBookDelete={() =>
                handleBookRemoval(shelf_name, book.google_book_id)
              }
            />
          ))
        ) : (
          <Text style={styles.emptyShelfTxt}>Empty Shelf</Text>
        )}
        {!checkIfDefaultShelf() && (
          <Pressable style={styles.deleteBtn} onPress={handleDeletion}>
            <Text style={styles.deleteBtnText}>Delete Shelf</Text>
          </Pressable>
        )}
      </ScrollView>

      <Modal transparent={true} visible={editableTitle}>
        <View style={styles.editModal}>
          <Text style={styles.editTitle}>Edit Shelf Name</Text>
          <TextInput
            value={shelfTitle}
            placeholder={shelf_name}
            onChangeText={(e) => setShelfTitle(e)}
            style={styles.editInput}
          />
          <Pressable
            style={styles.saveBtn}
            onPress={() => handleEditSave(shelfTitle.trim())}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={handleEditClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ShelfDetails;

const styles = StyleSheet.create({
  titleView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  shelfTitle: {
    fontFamily: "Agbalumo",
    fontSize: 26,
    textAlign: "center",
  },
  deleteBtn: {
    backgroundColor: "#9B2426",
    marginVertical: 20,
    marginHorizontal: "auto",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  deleteBtnText: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    color: "white",
  },
  editModal: {
    width: "75%",
    backgroundColor: "#BDB59F",
    borderRadius: 30,
    marginVertical: "auto",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  editTitle: {
    fontFamily: "Agbalumo",
    color: "black",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },
  editInput: {
    borderRadius: 20,
    backgroundColor: "white",
    color: "black",
    fontFamily: "Agbalumo",
    paddingLeft: 10,
  },
  saveBtnText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  saveBtn: {
    backgroundColor: "#83884E",
    marginHorizontal: "auto",
    marginTop: 20,
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cancelBtnText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  cancelBtn: {
    backgroundColor: "#9B2426",
    marginHorizontal: "auto",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  emptyShelfTxt: {
    fontFamily: "Agbalumo",
    fontSize: 20,
    textAlign: "center",
  },
  sorting: {
    flexDirection: "column",
    width: "100%",
  },
  dropdown: {
    borderRadius: 10,
    textAlign: "right",
    height: 30,
    marginRight: 25,
  },
  dropdownContainer: {
    borderColor: "black",
    borderRadius: 20,
    color: "white",
    borderWidth: 1,
    width: "40%",
    marginLeft: "auto",
    marginRight: 25,
  },
  sortSegment: {
    marginLeft: "auto",
    marginRight: 20,
    backgroundColor: "#F6F2EA",
    width: "50%",
  },
});
