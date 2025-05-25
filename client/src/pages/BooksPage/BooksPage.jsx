import "./BooksPage.scss";

import Book from "../../components/Book/Book";
import BookView from "../../components/BookView/BookView";
import Search from "../../components/Search/Search";
import { useAppContext } from "../../context/AppContext";
import { fetchBooks } from "../../services/user.service";
import { updateBook } from "../../services/admin.service";
import DetailsGroup from "../../components/DetailsGroup/DetailsGroup";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useCallback, useEffect, useState } from "react";
import { SERVER_URL } from "../../services/api.service";

export default function BooksPage() {
  const { user, setShowPopup } = useAppContext();
  const [books, setBooks] = useState();

  useEffect(() => { searchBooks(); }, []);

  const handleAddBook = () => {
    setShowPopup(
      <DetailsGroup
        object={{}}
        isAdmin={true}
        onUpdate={handleCreateBook}
        mode={"create"}
        onClose={setShowPopup}
      />
    );
  };

  const handleCreateBook = (updatedBook) => {
    const copyBooks = [...books];
    copyBooks.push(updatedBook);
    setBooks(copyBooks);
    setShowPopup(null);
  };

  function searchBooks(search) {
    fetchBooks(search)
      .then(setBooks)
      .catch((err) => console.error("Error loading books:", err));
  }


  const onSelectBook = useCallback((book) => setShowPopup(<BookView book={book} />), []);


  const handleBookDeleted = useCallback((deletedBookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedBookId));
  }, []);



  const handleEditBook = useCallback(
    (book) => {
      console.log("Opening edit popup for book:", book);
      setShowPopup(
        <DetailsGroup
          object={book}
          isAdmin={user?.role === "admin"}
          onClose={setShowPopup}
          onUpdate={async (updatedData) => {
            console.log("Updating book with data:", updatedData);
            try {
              const copyUpdatedData = { ...updatedData };

              if (copyUpdatedData?.src) { copyUpdatedData.src = copyUpdatedData.src.replaceAll(SERVER_URL, ""); }
              if (copyUpdatedData.publisher) { delete copyUpdatedData.publisher; }
              if (copyUpdatedData.author) { delete copyUpdatedData.author; }

              const updatedBook = await updateBook(book.id, copyUpdatedData);
              console.log("Book updated successfully:", updatedBook);

              setBooks((prevBooks) => {
                const newBooks = [...prevBooks].map((b) => b.id === book.id ? updatedBook : b);
                console.log("Updated books list:", newBooks);
                return newBooks;
              });

              setShowPopup(null);
            } catch (error) {
              console.error("Error updating book:", error);
            }
          }}
        />
      );
    },
    [user?.role, setShowPopup]
  );

  return (
    <div className="BoolList">
      <Search searchHandler={searchBooks} title="Test Search"></Search>

      <div className="booksContainer">
        {!books?.length ?
          (<p>No books found.</p>) :
          (books.map((book, index) => (<Book
            key={"book" + index}
            book={book}
            user={user}
            onSelectBook={onSelectBook}
            onBookDeleted={handleBookDeleted}
            onEdit={handleEditBook}
          />)))
        }
      </div>

      {user?.role == "admin" && <button className="floating-action-button" onClick={handleAddBook} title="Add New Book"><AddCircleOutlineIcon /></button>}
    </div>
  );
}