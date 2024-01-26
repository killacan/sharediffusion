'use client'

import { deletePost } from "./serveractions"

export default function DeleteButton({title}: {title: string}) {

    function handleDelete() {
        deletePost(title)
    }

    return (
        <button onClick={handleDelete} className='bg-red-500 flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground my-2 w-1/2 hover:bg-red-400'>Delete</button>
    )
}