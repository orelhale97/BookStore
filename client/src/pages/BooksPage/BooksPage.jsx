import Book from '../../components/Book/Book';
import BookView from '../../components/BookView/BookView';
import Search from '../../components/Search/Search';
import { useAuth } from '../../context/AuthContext';
import { fetchBooks } from '../../services/user.service';
import './BooksPage.scss'

import { useCallback, useEffect, useState } from 'react'



export default function BooksPage() {
   const { user, setShowPopup } = useAuth();

   const [books, setBooks] = useState();

   useEffect(() => {
      searchBooks()
   }, [])

   function searchBooks(search) {
      fetchBooks(search)
         .then(setBooks)
         .catch(err => console.error('Error loading books:', err));
   }

   const onSelectBook = useCallback((book) => setShowPopup(<BookView book={book} />), []);


   return (
      <div className='BoolList' key={"BoolList"}>
         <Search searchHandler={searchBooks} title='Test Search'></Search>

         <div className='booksContainer'>
            {!books?.length
               ? <p>No books found.</p>
               : books.map((book, index) => <Book key={"book" + index} book={book} user={user} onSelectBook={onSelectBook} />)
            }
         </div>
      </div>
   )
}