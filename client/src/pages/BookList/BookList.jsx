import { getBookList, SERVER_URL } from '../../services/Books.service';
import './BookList.scss'

import { useEffect, useState } from 'react'



export function BookList() {

   const [books, setBooks] = useState();

   useEffect(() => {
      getBookList()
         .then(setBooks)
         .catch(err => console.error('Error loading books:', err));
   }, [])

   return (
      <div className='BoolList'>
         {books && books.map((book, index) =>
            <div className='book'>
               <div className='img-wrap'>
                  <img src={`${SERVER_URL}${book.src}`} />
               </div>
               <div className="book-details" key={"book" + index}>
                  {book.name}
               </div>
            </div>
         )}
      </div>
   )
}