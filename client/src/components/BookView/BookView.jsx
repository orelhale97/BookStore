
import './BookView.scss'


export default function BookView({ book }) {
  return (
    <div className='BookView'>
      <img src={book.src} className="book-image" />
      <div className="book-details">
        <h2>{book.name}</h2>
        <p><strong>Author:</strong> {book.author.name}</p>
        <p><strong>Publisher:</strong> {book.publisher.name}</p>
        {/* <p><strong>Description:</strong> { "Still in development"}</p> */}
      </div>
    </div>
  )
}