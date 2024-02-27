'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ListItems({items, fetchItems}: {items: any[], fetchItems: (offset: number) => Promise<{ posts: any[]; }>}) {

    const [models, setModels] = useState(items)

    const handleFetchItems = async () => {
        const newModels = await fetchItems(models.length / 10)
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
            {models.length % 10 !== 0 && <button onClick={handleFetchItems}>Load more</button>}
          </>
    )
}