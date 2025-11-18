import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";

type UpcomingBookProps = {
  title: string;
  author: string;
  coverUrl: string;
  onCurrentMove: () => void;
  onImagePress: () => void;
};

const UpcomingBook = ({
  title,
  author,
  coverUrl,
  onCurrentMove,
  onImagePress,
}: UpcomingBookProps) => {
  const [openState, setOpenState] = useState(false);

  const openModalState = () => {
    setOpenState(true);
  };

  const closeModalState = () => {
    setOpenState(false);
  };

  const handleMoveToCurrent = () => {
    console.log("Move to current");
  };
  return (
    <>
      <Pressable onPress={openModalState}>
        <Image
          style={styles.bookImg}
          source={{
            uri: `https://books.google.com/books?id=${coverUrl}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
          }}
          accessibilityLabel={`Image of book title: ${title}`}
        />
      </Pressable>

      <Modal transparent={true} visible={openState}>
        <Pressable style={styles.modal} onPress={closeModalState}>
          <View
            style={styles.modalContainer}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView>
              <Text style={styles.modalText}>{title}</Text>
              <Text style={styles.modalText}>{author}</Text>
              <Pressable onPress={onImagePress}>
                <Image
                  style={styles.modalImg}
                  source={{
                    uri: `https://books.google.com/books?id=${coverUrl}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
                  }}
                  accessibilityLabel={`Image of book title: ${title}`}
                />
              </Pressable>
              <Pressable onPress={onCurrentMove}>
                <View style={styles.button}>
                  <Text style={styles.modalText}>Currently Reading?</Text>
                </View>
              </Pressable>
            </ScrollView>
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
    height: 250,
    width: 150,
    borderRadius: 20,
    marginBottom: 20,
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    verticalAlign: "middle",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#83884E",
    marginHorizontal: "14%",
    marginVertical: "auto",
    paddingVertical: 20,
    borderRadius: 50,
    height: 500,
  },
  modalText: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 6,
  },
  modalImg: {
    height: 300,
    width: 200,
    marginVertical: 20,
    marginHorizontal: "auto",
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
    marginHorizontal: "auto",
  },
});
