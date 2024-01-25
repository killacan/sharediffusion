// this is to display all the models that have been uploaded. 
import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const revalidate = 120

export default async function Models() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)


  const { data, error } = await supabase.from('posts').select('*')

  if (error) {
    return redirect('/models?message=Could not get models')
  }

  if (data) {
    // console.log(data)
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center py-6">

      <div className="animate-in gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-center">Models</h1>
          <div className='grid grid-cols-3 gap-10'>
            {data?.map((model) => (
              <Link href={`models/${model.title}`} className='border border-white rounded-md w-72 h-72'>
                <h2 className='text-xl font-bold'>{model.title}</h2>
              </Link>
            ))}
          </div>
        </main>
      </div>

    </div>
  )
}
