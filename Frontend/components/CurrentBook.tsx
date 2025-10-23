import ProgressLine from "@/components/ProgressLine";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getCustomShelves, getDefaultShelves } from "@/services/api";
import { useEffect, useState } from "react";

type CurrentBookProps = {
  title: string;
  authors: string[];
  googleBookId: string;
  progress: number;
  numOfPages: number;
  description: string;
  categories: string;
  publishedDate: string;
  context?: string;
};

const CurrentBook = ({
  title,
  authors,
  googleBookId,
  progress,
  numOfPages,
  description,
  categories,
  publishedDate,
  context,
}: CurrentBookProps) => {

  const [shelvesList, setShelvesList] = useState([]);
  const [customList, setCustomList] = useState([]);
  const [allShelves, setAllShelves] = useState([]);

  useEffect(() => {
    const loadShelves = async () => {
      try {
        setShelvesList(await getDefaultShelves());
        setCustomList(await getCustomShelves());
        setAllShelves([...shelvesList, ...customList]);

      } catch (error: any) {
        console.log("Error while retrieving default shelves");
        console.error(error);
      }
    }
    loadShelves();
  }, []);

  return (
    <Link
      href={{
        pathname: "/(tabs)/(book)/[shelfBook]",
        params: {
          shelfBook: googleBookId,
          shelfName: "Currently Reading",
          pagesRead: 100,
          rating: 1.5,
          title: title,
          authors: authors,
          categories: categories,
          allShelves: JSON.stringify(allShelves),
          numOfPages: numOfPages,
          description: description,
        },
      }}
      style={styles.linkWrapper}
    >
      <View style={styles.container}>
        <Image style={styles.imageCover} source={{
          uri: `https://books.google.com/books?id=${googleBookId}&printsec=frontcover&img=1&zoom=4&edge=curl&source=gbs_api`,
        }} />
        <View style={styles.details}>
          <Text numberOfLines={3} style={styles.detailsTitle}>
            {title}
          </Text>
          <Text numberOfLines={2} style={styles.detailsAuthor}>
            {authors.map((author) => `${author}\n`)}
          </Text>
          <ProgressLine progress={progress} target={numOfPages} />
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Log</Text>
          </Pressable>
        </View>
      </View>
    </Link>
  );
};

export default CurrentBook;

const styles = StyleSheet.create({
  linkWrapper: {
    marginVertical: 10,
    alignSelf: "center",
  },
  container: {
    flexDirection: "row",
    width: 270,
    height: 230,
    backgroundColor: "#CFC6AE",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  imageCover: {
    width: 125,
    height: 200,
    borderRadius: 15,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
    height: "100%",
  },
  detailsTitle: {
    fontFamily: "Agbalumo",
    fontSize: 16,
  },
  detailsAuthor: {
    fontFamily: "Agbalumo",
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#A65926",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontFamily: "Agbalumo",
    fontSize: 16,
    color: "white",
  },
});
