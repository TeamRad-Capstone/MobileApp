import { StyleSheet, View, Text, Image, Pressable, Modal } from "react-native";
import { useState } from "react";

type UpcomingBookProps = {
  title: string;
  author: string;
  coverUrl: string;
};

const UpcomingBook = ({ title, author, coverUrl }: UpcomingBookProps) => {
  const [openState, setOpenState] = useState(false);

  const changeOpenState = () => {
    setOpenState(!openState);
  };
  return (
    <>
      <Pressable onPress={changeOpenState}>
        <Image
          style={styles.bookImg}
          source={{
            uri: `https://books.google.com/books?id=${coverUrl}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
          }}
          accessibilityLabel={`Image of book title: ${title}`}
        />
      </Pressable>

      <Modal transparent={true} visible={openState}>
        <Pressable style={styles.modal} onPress={changeOpenState}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{title}</Text>
            <Text style={styles.modalText}>{author}</Text>
            <Image
              style={styles.modalImg}
              source={{
                uri: `https://books.google.com/books?id=${coverUrl}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
              }}
              accessibilityLabel={`Image of book title: ${title}`}
            />
            <Pressable>
              <View style={styles.button}>
                <Text style={styles.modalText}>Move to Shelf</Text>
                <Image
                  style={{ width: 20, height: 20, marginTop: 5 }}
                  source={require("@/assets/icons/dropdown.png")}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default UpcomingBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookImg: {
    height: 200,
    width: 130,
    borderRadius: 20,
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#83884E",
    marginHorizontal: "20%",
    marginVertical: "auto",
    paddingVertical: 20,
    borderRadius: 50,
  },
  modalText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 6,
  },
  modalImg: {
    height: 200,
    width: 130,
    marginVertical: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#A65926",
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    marginVertical: 20,
  },
});
