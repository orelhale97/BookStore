






import { BookList } from '../BookList/BookList'
import './HomePage.scss'
import { useEffect, useState } from 'react'


export function HomePage() {

    // const [temp, setTemp] = useState();

    // useEffect(() => { }, [])

    return (
        <div className='HomePage'>
            <BookList></BookList>
        </div>
    )
}