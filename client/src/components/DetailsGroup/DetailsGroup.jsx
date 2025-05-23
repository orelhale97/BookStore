import './DetailsGroup.scss'


export default function DetailsGroup({ object }) {
   const detailsGroupArray = [
      { header: "Name: ", key: "name" },
      { header: "Author: ", key: "author" },
      { header: "Publisher: ", key: "publisher" },
   ]


   return (
      < >
         {/* <div className='headers'>
            {detailsGroupArray.map(({ header }) => <span>{header}</span>)}
         </div>
         <div className='data'>
            {detailsGroupArray.map(({ key }) => <span>
               {(typeof object?.[key] == 'object') ? (object[key]?.name || '') : object[key] || ""}
            </span>)}
         </div> */}

         <div className='Detalies'>
            {detailsGroupArray.map(({ header, key }) => <>
               {/* <span className='headers'>{header}</span> */}
               <span className='data'>{(typeof object?.[key] == 'object') ? (object[key]?.name || '') : object[key] || ""}</span>
            </>
            )}
         </div>
      </>
   )
}
