import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const revalidate = 120

export default async function Photos() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('pictures').select('*').order('updated_at', { ascending: false })

  if (error) {
    return redirect('/photos?message=Could not get photos')
  }

  if (data) {
    console.log(data)
  }

  return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">

        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-3">
          <main className="flex-1 flex flex-col gap-6 mx-auto">
          <h1 className="text-3xl font-bold text-center">Photos</h1>
            <div className='grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-items-center'>
              {data?.map((photo) => (
                  <Link href={`photos/${photo.file_name}`} className='flex flex-col justify-center border border-white rounded-md mb-3 hover:scale-110 duration-300 w-full min-w-[18rem] max-w-xs h-72'>
                    <div className='w-full h-full overflow-hidden rounded-lg relative'>
                      <Image className='rounded-lg object-contain' src={photo.url} alt={photo.file_name} fill={true} />
                    </div>
                  </Link>
                ))}
            </div>
          </main>
        </div>
  
      </div>
    )
}