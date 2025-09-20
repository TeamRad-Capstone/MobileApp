import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type GoalModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  goalTarget?: string;
  setTitle: (value: string) => void;
  setGoalTarget?: (value: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  buttonText: string;
  context?: "goalPage" | "other";
};

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
  context = "other",
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
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          {context === "readBook" && setGoalTarget && (
            <TextInput
              placeholder="Goal Target"
              value={goalTarget}
              onChangeText={setGoalTarget}
              keyboardType="numeric"
              style={styles.input}
            />
          )}
          <Pressable onPress={onSave} style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
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
