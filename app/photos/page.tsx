export const runtime = 'edge';

import { getImgs } from '../_components/serveractions'
import ListPhotos from '../_components/listPhotos'

export const revalidate = 120

export default async function Photos() {

  const initialPhotos = await getImgs(0)

  return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">

        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-3">
          <main className="flex-1 flex flex-col gap-6 mx-auto">
          <h1 className="text-3xl font-bold text-center">Photos</h1>
            <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-items-center'>
              <ListPhotos items={initialPhotos.imgs} fetchItems={getImgs} />
            </div>
          </main>
        </div>
  
      </div>
    )
}