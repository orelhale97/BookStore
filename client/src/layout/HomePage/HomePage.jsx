import BookList from '../../pages/BookList/BookList'
import './HomePage.scss'
import { useEffect, useState } from 'react'


export default function HomePage() {

    // const [temp, setTemp] = useState();

    // useEffect(() => { }, [])

    return (
        <div className='HomePage'>
            <BookList />
        </div>
    )
}