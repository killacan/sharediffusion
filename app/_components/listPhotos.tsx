'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FetchButton from "./loadMoreButton";

export default function listPhotos({items, fetchItems}: {items: any[], fetchItems: (offset: number) => Promise<{ imgs: any[]; }>}) {

    const [photos, setPhotos] = useState(items)
    const [loadMore, setLoadMore] = useState(items.length > 10 ? true : false)

    const handleFetchItems = async () => {
        const newPhotos = await fetchItems(photos.length / 10)
        if (newPhotos.imgs.length === 0) {
            setLoadMore(false)
            return
        }
        setPhotos([...photos, ...newPhotos.imgs])
    }

    return (
        <>
            {photos.map((photo, index) => (
                  <Link href={`photos/${photo.file_name}`} key={index} className='flex flex-col justify-center border border-white rounded-md mb-3 hover:scale-110 duration-300 w-full min-w-[18rem] max-w-xs h-72'>
                    <div className='w-full h-full overflow-hidden rounded-lg relative'>
                        <Image className='rounded-lg object-contain' src={photo.url} alt={photo.file_name} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                </Link>
            ))}
            {loadMore && <FetchButton  handleFetchItems={handleFetchItems}></FetchButton>}
          </>
    )
}