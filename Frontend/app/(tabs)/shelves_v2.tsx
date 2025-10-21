import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Shelf, getCustomShelves, getDefaultShelves, createShelf } from "@/services/api";
import DefaultShelf from "@/components/DefaultShelf";
import { useIsFocused } from "@react-navigation/core";

const Shelves = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [defaultShelves, setDefaultShelves] = useState<Shelf[]>([]);
  const [shelfModalVisible, setShelfModalVisible] = useState(false);
  const [shelfTitle, setShelfTitle] = useState("");
  const [refreshShelves, setRefreshShelves] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const loadShelves = async () => {
        try {
          const customList = await getCustomShelves();
          const list = await getDefaultShelves();
          setDefaultShelves(list);
          setShelves(customList);
        } catch (error: any) {
          console.log("Error while retrieving custom shelves");
          console.error(error);
        }
      };
      loadShelves();
    }
  }, [refreshShelves, isFocused]);

  const handleModalOpen = () => {
    setShelfTitle("");
    setShelfModalVisible(true);
  };

  const handleShelfCreate = async () => {
    console.log("Attempt to add shelf to DB table");
    await createShelf(shelfTitle);
    setShelfModalVisible(false);
    setRefreshShelves(!refreshShelves);
  };

  return (
    <SafeAreaView
      style={{
        paddingBottom: tabBarHeight,
        flex: 1,
        backgroundColor: "#F6F2EA",
      }}
    >
      <ScrollView>
        <Text style={styles.headingText}>Shelves</Text>
        <View style={styles.defaultView}>
          {defaultShelves.map((mappedShelf, index) => (
            <DefaultShelf
              key={index}
              end_user_id={mappedShelf.end_user_id}
              shelf_id={mappedShelf.shelf_id}
              shelf_name={mappedShelf.shelf_name}
            />
          ))}
        </View>

        <View style={styles.customView}>
          {shelves.map((mappedShelf, index) => (
            <DefaultShelf
              key={index}
              end_user_id={mappedShelf.end_user_id}
              shelf_id={mappedShelf.shelf_id}
              shelf_name={mappedShelf.shelf_name}
            />
          ))}
        </View>

        <Pressable style={styles.addBtn} onPress={handleModalOpen}>
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </ScrollView>

      {/*  Modal for adding a new shelf */}
      <Modal transparent={true} visible={shelfModalVisible}>
        <View style={styles.modalContainer}>
          <View style={{marginTop: 20}}>
            <TextInput
              style={styles.input}
              placeholder={"Title"}
              value={shelfTitle}
              onChangeText={setShelfTitle}
            />
          </View>
          <Pressable style={styles.saveBtn} onPress={handleShelfCreate}>
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
          <Pressable
            style={styles.cancelBtn}
            onPress={() => setShelfModalVisible(false)}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Shelves;

const styles = StyleSheet.create({
  headingText: {
    fontFamily: "Agbalumo",
    fontSize: 24,
    textAlign: "center",
  },
  defaultView: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 30,
    gap: 10,
  },
  customView: {
    marginTop: 50,
    marginHorizontal: 40,
    gap: 20
  },
  addBtn: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#A65926",
    marginHorizontal: "auto",
    paddingHorizontal: 44,
    paddingVertical: 6,
    borderRadius: 30,
  },
  addBtnText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    height: 30,
    width: 30,
  },
  modalContainer: {
    justifyContent: "center",
    backgroundColor: "#BDB59F",
    marginVertical: "auto",
    marginHorizontal: "14%",
    borderRadius: 40,
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
});
