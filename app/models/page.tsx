// this is to display all the models that have been uploaded. 
import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export const revalidate = 120

export default async function Models() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)


  const { data, error } = await supabase
  .from('posts')
  .select('title, pictures(url)')

  if (error) {
    return redirect('/models?message=Could not get models')
  }

  if (data) {
    // console.log(data[9])
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center py-6">

      <div className="animate-in gap-20 opacity-0 w-full px-10">
        <main className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center">Models</h1>
          <div className=' grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 justify-items-center '>
            {data?.map((model, index) => (
              <Link 
                key={index} 
                href={`models/${model.title}`} 
                className='flex flex-col justify-center border border-white rounded-md mb-3 hover:scale-110 duration-300 w-full min-w-[18rem] max-w-xs '
              >
                {model.pictures.length > 0 && 
                  <div className='h-72 overflow-hidden rounded-lg relative'>
                    <Image className='rounded-lg object-cover' src={model.pictures[0].url} alt={model.title} fill={true} />
                  </div>
                }
                {model.pictures.length === 0 && <div className='rounded-lg bg-foreground/10 w-full h-72'>No Photo</div>}
                <h2 className='text-xl font-bold'>{model.title}</h2>
              </Link>
            ))}
          </div>
        </main>
      </div>

    </div>
  )
}
