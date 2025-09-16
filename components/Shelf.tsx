import Book from "@/components/Book";
import { ScrollView } from "react-native";

// This is the Shelf component. It displays a scrollable list of books.

type ShelfProps = {
  books: {
    title: string;
    authors: string[];
    coverUrl: string;
    description: string;
    numOfPages: number;
    categories: string[];
    publishedDate: string;
  }[];
  context?: string;
};

// Shelf component takes an array of books and context (which page it was used on)
const Shelf = ({ books, context }: ShelfProps) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
      {books.map((book, index) => (
        <Book
          key={index}
          title={book.title}
          authors={book.authors}
          coverUrl={book.coverUrl}
          context={context}
          description={book.description}
          numOfPages={book.numOfPages}
          categories={book.categories}
          publishedDate={book.publishedDate}
        />
      ))}
    </ScrollView>
  );
};

export default Shelf;
