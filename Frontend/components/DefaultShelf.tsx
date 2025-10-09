import { StyleSheet, View, Text, Pressable } from "react-native";
import { Shelf } from "@/services/api";
import { useRouter, Link } from "expo-router";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import search from "@/app/(tabs)/search";

const DefaultShelf = ({ end_user_id, shelf_id, shelf_name }: Shelf) => {

  return (
    <Pressable style={styles.container}>
      <Link
        href={{
          pathname:"/(tabs)/[shelf]",
          params: {
            shelf: shelf_id,
            user_id: end_user_id,
            title: shelf_name,
          }
        }}
      >
        <Text style={styles.shelfTitle}>{shelf_name}</Text>
      </Link>
    </Pressable>
  );
};

export default DefaultShelf;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#83884E",
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "40%"
  },
  shelfTitle: {
    fontFamily: "Agbalumo",
    fontSize: 18,
    textAlign: "center",
    color: "white",
  },
});
