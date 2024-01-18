// this is to display all the models that have been uploaded. 
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Models() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from('posts').select('*')

  if (error) {
    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">

        <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
          <main className="flex-1 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Models</h1>
            <p>There was an error getting the posts from the database</p>
          </main>
        </div>

      </div>
    )
  }


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Models</h1>
        </main>
      </div>

    </div>
  )
}
