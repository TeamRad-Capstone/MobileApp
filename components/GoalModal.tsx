import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// This si the GoalModal component. It is used for adding and editing goals.

type GoalModalProps = {
  visible: boolean;
  onClose: () => void; // function closes modal
  title: string;
  goalTarget: string;
  setTitle: (value: string) => void; // function updates title state
  setGoalTarget: (value: string) => void; // function updates goal target state
  onSave: () => void; // function saves goal
  onDelete?: () => void; // function deletes goal
  buttonText: string; // text for button is either add or save
};

// Modal component for adding and editing goals
export default function GoalModal({
  visible,
  onClose,
  title,
  goalTarget,
  setTitle,
  setGoalTarget,
  onSave,
  onDelete,
  buttonText,
}: GoalModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Goal Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Goal Target"
            value={goalTarget}
            onChangeText={setGoalTarget}
            keyboardType="numeric"
            style={styles.input}
          />
          {/* general button style used for save, delete, cancel */}
          <Pressable onPress={onSave} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
          {/* if onDelete is passed as a prop then show it */}
          {onDelete && (
            <Pressable onPress={onDelete} style={styles.button}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
          )}
          <Pressable onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#BE6A53",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Agbalumo",
  },
});
