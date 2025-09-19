import { StyleSheet, View } from "react-native";

type ProgressLineProps = {
  progress: number;
  target: number;
};

const ProgressLine = ({ progress, target }: ProgressLineProps) => {
  // calculates progress percentage
  const progressPercent = (progress / target) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
    </View>
  );
};

export default ProgressLine;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BDBDBD",
    borderRadius: 10,
    height: 6,
  },
  progressFill: {
    backgroundColor: "#A65926",
    borderRadius: 10,
    height: 6,
  }
});
