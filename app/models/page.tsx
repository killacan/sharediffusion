export const runtime = 'edge';

// this is to display all the models that have been uploaded. 

import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { modelsState } from '../_components/modelsStore'
import { getPosts } from '../_components/serveractions'
import { useEffect } from 'react'
import ListModels from '../_components/listModels'
import { get } from 'http'

export const revalidate = 120

export default async function Models() {

  const initialModels = await getPosts(0)

  const fetchItems = async (offset: number) => {
    'use server'
    const models = await getPosts(offset)
    return models
  }

  
  if (initialModels.posts.length === 0) {

    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
          <h1 className="text-4xl font-bold text-center">404</h1>
          <p className="text-center">This page could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center py-6">

      <div className="animate-in gap-20 opacity-0 w-full px-10">
        <main className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center">Models</h1>
          <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-items-center '>
            <ListModels items={initialModels.posts} fetchItems={fetchItems} />

          </div>
        </main>
      </div>

    </div>
  )
}
