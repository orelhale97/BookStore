import './Main.scss'

import BooksPage from '../../pages/BooksPage/BooksPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import PurchasesPage from '../../pages/PurchasesPage/PurchasesPage'
import AuthorsPage from '../../pages/AuthorsPage/AuthorsPage'
import PublisherPage from '../../pages/publisherPage/publisherPage'

export default function Main() {

    return (
        <div className='app-main'>
            <Routes>
                <Route path="/" element={<Navigate to="/books" replace />} />
                <Route path="books" element={<BooksPage />} />
                <Route path="history" element={<PurchasesPage />} />
                <Route path="authors" element={<AuthorsPage />} />
                <Route path="publishers" element={<PublisherPage />} />
                <Route path="*" element={<h1 style={{ color: "red", textAlign: "center", marginTop: "200px" }}>Page not found</h1>} />
            </Routes>
        </div>
    )
}