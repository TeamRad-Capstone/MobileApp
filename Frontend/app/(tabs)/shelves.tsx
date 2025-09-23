import GoalModal from "@/components/GoalModal";
import Shelf from "@/components/Shelf";
import booksData from "@/data/books.json";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Shelves = () => {
  const [selectedShelf, setSelectedShelf] = useState<
    null | (typeof booksData.defaultShelves)[0]
  >(null);
  const [customShelves, setCustomShelves] = useState(booksData.customShelves);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentShelf, setCurrentShelf] = useState<{
    id?: number;
    name: string;
  }>({ name: "" });

  const handleSaveShelf = () => {
    if (currentShelf.id) {
      setCustomShelves((prev) =>
        prev.map((s) =>
          s.id === currentShelf.id
            ? (currentShelf as { id: number; name: string })
            : s
        )
      );
    } else {
      const newShelf = { id: Date.now(), name: currentShelf.name };
      setCustomShelves([...customShelves, newShelf]);
    }
    setModalVisible(false);
    setCurrentShelf({ name: "" });
  };

  const handleDeleteShelf = () => {
    if (currentShelf.id) {
      setCustomShelves((prev) => prev.filter((s) => s.id !== currentShelf.id));
    }
    setModalVisible(false);
    setCurrentShelf({ name: "" });
  };

  const handleOpenShelfModal = (shelf?: (typeof customShelves)[0]) => {
    setCurrentShelf(shelf || { name: "" });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        {selectedShelf ? selectedShelf.name : "Shelves"}
      </Text>

      {selectedShelf ? (
        <>
          <Pressable
            onPress={() => setSelectedShelf(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          {customShelves.find((s) => s.id === selectedShelf.id) && (
            <Pressable
              style={styles.editShelfButton}
              onPress={() => handleOpenShelfModal(selectedShelf)}
            >
              <Text style={styles.editShelfButtonText}>Edit</Text>
            </Pressable>
          )}

          <Shelf
            shelfId={selectedShelf.id}
            context={
              selectedShelf.name === "Want to Read"
                ? "wantToReadShelf"
                : "readBook"
            }
          />
        </>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.grid}>
            {booksData.defaultShelves.map((shelf) => (
              <Pressable
                key={shelf.id}
                style={styles.shelfContainer}
                onPress={() => setSelectedShelf(shelf)}
              >
                <Text style={styles.shelfText}>{shelf.name}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.customContainer}>
            {customShelves.map((shelf) => (
              <Pressable
                key={shelf.id}
                style={styles.customShelfContainer}
                onPress={() => setSelectedShelf(shelf)}
              >
                <Text style={styles.shelfText}>{shelf.name}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.addShelfButton}
            onPress={() => handleOpenShelfModal()}
          >
            <Text style={{ fontSize: 25, color: "white" }}>+</Text>
          </Pressable>
        </ScrollView>
      )}

      <GoalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={currentShelf.name}
        goalTarget=""
        setTitle={(name) => setCurrentShelf((prev) => ({ ...prev, name }))}
        setGoalTarget={() => {}}
        onSave={handleSaveShelf}
        onDelete={currentShelf.id ? handleDeleteShelf : undefined}
        buttonText={currentShelf.id ? "Save" : "Add"}
      />
    </SafeAreaView>
  );
};

export default Shelves;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F2EA", alignItems: "center" },
  heading: {
    fontSize: 24,
    marginTop: 70,
    marginBottom: 20,
    fontFamily: "Agbalumo",
  },
  backButton: { position: "absolute", top: 30, left: 10, zIndex: 1 },
  backButtonText: { fontSize: 40, fontFamily: "Agbalumo" },
  editShelfButton: {
    position: "absolute",
    top: 30,
    right: 10,
    backgroundColor: "#BE6A53",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    zIndex: 1,
  },
  editShelfButtonText: { color: "#fff", fontFamily: "Agbalumo" },
  scrollContainer: { paddingBottom: 60, alignItems: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  shelfContainer: {
    backgroundColor: "#797D49",
    width: 160,
    height: 80,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  customContainer: { width: "100%", alignItems: "center", marginTop: 10 },
  customShelfContainer: {
    backgroundColor: "#5A5D37",
    width: "80%",
    height: 60,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  shelfText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
  addShelfButton: {
    marginTop: 20,
    backgroundColor: "#8C4E24",
    paddingHorizontal: 40,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },
});
