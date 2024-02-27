'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function listModels({items, fetchItems}: {items: any[], fetchItems: (offset: number) => Promise<{ posts: any[]; }>}) {

    const [models, setModels] = useState(items)
    const [loadMore, setLoadMore] = useState(items.length > 10 ? true : false)

    const handleFetchItems = async () => {
        const newModels = await fetchItems(models.length / 10)
        if (newModels.posts.length === 0) {
            setLoadMore(false)
            return
        }
        setModels([...models, ...newModels.posts])
    }

    return (
        <>
            {models.map((model, index) => (
                <Link 
                key={index} 
                href={`models/${model.title}`} 
                className='flex flex-col justify-center border border-white rounded-md mb-3 hover:scale-110 duration-300 w-full min-w-[18rem] max-w-xs '
                >
                {model.pictures !== undefined && 
                    <div className='h-72 overflow-hidden rounded-lg relative'>
                    <Image className='rounded-lg object-cover' src={model.pictures[0].url} alt={model.title} fill={true} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                    </div>
                }
                {model.pictures === undefined && <div className='rounded-lg bg-foreground/10 w-full h-72'>No Photo</div>}
                <h2 className='text-xl font-bold'>{model.title}</h2>
                </Link>
            ))}
            {loadMore && <button className='bg-blue-600 border border-white rounded-md p-2 hover:bg-blue-500 duration-300 text-center cursor-pointer w-full h-72' onClick={handleFetchItems}>Load more</button>}
          </>
    )
}