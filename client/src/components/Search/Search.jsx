import './Search.scss'
import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce';


export default function Search({ searchHandler, title = "Search ..." }) {
   const [searchStr, setSearchStr] = useState("");

   const debouncedSearch = useRef(debounce((value) => {
      if (searchHandler) { searchHandler(value.trim()); }
   }, 500), [searchHandler]);

   useEffect(() => {
      debouncedSearch.current(searchStr);

      return () => { debouncedSearch.current?.cancel(); }
   }, [searchStr, debouncedSearch]);


   function handleInputChange(event) {
      setSearchStr(event.target.value);
   }

   function submitSearch() {
      if (searchHandler) {
         searchHandler(searchStr.trim());
      }
   }

   return (
      <div className='Search' key={'Search'}>
         <input type='text' placeholder={title} onChange={handleInputChange} value={searchStr}></input>
         <button onClick={submitSearch}>Search</button>
      </div>
   )
}