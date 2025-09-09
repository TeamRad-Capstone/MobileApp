import Book from "@/components/Book";
import { ScrollView } from "react-native";

// This component displays a shelf of books. It takes in an array of book objects and renders them using the Book component.

type ShelfProps = {
  books: { title: string; author: string; coverUrl: string }[];
};

const Shelf = ({ books }: ShelfProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {books.map((book, index) => (
        <Book
          key={index}
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
        />
      ))}
    </ScrollView>
  );
};

export default Shelf;
