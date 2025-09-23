import { StyleSheet, Text, View } from "react-native";

// Props that the ProgressBar accepts
type ProgressBarProps = {
  progress: number;
  target: number;
  title?: string;
};

const ProgressBar = ({ progress, target, title }: ProgressBarProps) => {
  // calculates progress percentage
  const progressPercent = (progress / target) * 100;

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      <View style={styles.textOverlay}>
        <Text style={styles.goalText}>{title}</Text>
        <Text style={styles.goalText}>
          {progress} / {target}
        </Text>
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
  },
  progressFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#797D49",
    borderRadius: 20,
  },
  textOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    zIndex: 1,
  },
  goalText: {
    fontSize: 18,
    fontFamily: "Agbalumo",
    color: "#292c0eff",
  },
});
