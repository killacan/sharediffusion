'use client'

export default function FetchButton({handleFetchItems}: {handleFetchItems: () => Promise<void>}) {

    return (
        <button onClick={handleFetchItems} className='bg-blue-600 border border-white rounded-md p-2 hover:bg-blue-500 duration-300 text-center cursor-pointer w-full h-72'>Load More</button>
    )
}