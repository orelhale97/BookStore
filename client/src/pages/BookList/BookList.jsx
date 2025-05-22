import { Search } from '../../components/Search/Search';
import { fetchBooks, SERVER_URL } from '../../services/Books.service';
import './BookList.scss'

import { useEffect, useState } from 'react'



export function BookList() {
   const [books, setBooks] = useState();

   useEffect(() => {
      searchBooks()
   }, [])

   function searchBooks(search) {
      fetchBooks(search)
         .then(setBooks)
         .catch(err => console.error('Error loading books:', err));
   }


   return (
      <div className='BoolList' key={"BoolList"}>
         <Search searchHandler={searchBooks} title='Test Search'></Search>

         {books && books.map((book, index) =>
            <div className='book' key={"book" + index}>

               <div className='img-wrap'>
                  <img src={`${SERVER_URL}${book.src}`} />
               </div>

               <div className="book-details">{book.name}</div>

            </div>
         )}

      </div>
   )
}