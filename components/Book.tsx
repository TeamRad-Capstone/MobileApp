import { Image, StyleSheet, View } from "react-native";

// This is the book component. It takes a url as a prop. For now, this only displays the books cover.

type BookProps = {
  coverUrl: string;
};

const Book = ({ coverUrl }: BookProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.cover}
        resizeMode="cover"
      />
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
});
