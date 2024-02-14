import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const revalidate = 120

export default async function Photos() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('pictures').select('*')

  if (error) {
    return redirect('/photos?message=Could not get photos')
  }

  if (data) {
    console.log(data)
  }

  return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">

        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
          <main className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-center">Photos</h1>
            <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6'>
              {data?.map((photo) => (
                  <Link href={`photos/${photo.file_name}`} className='border border-white rounded-md w-72 h-72'>
                    <div className='w-72 h-72 overflow-hidden rounded-lg relative'>
                      <Image className='rounded-lg object-cover' src={photo.url} alt={photo.file_name} fill={true} />
                    </div>
                  </Link>
                ))}
            </div>
          </main>
        </div>
  
      </div>
    )
}