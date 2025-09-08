import { ScrollView } from "react-native";
import Book from "./Book";

type ShelfProps = {
  books: { coverUrl: string }[];
};

const Shelf = ({ books }: ShelfProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {books.map((book, index) => (
        <Book key={index} coverUrl={book.coverUrl} />
      ))}
    </ScrollView>
  );
};

export default Shelf;
