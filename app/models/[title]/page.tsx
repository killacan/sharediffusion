// this page is going to be for grabbing an individual post and displaying it.
import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const revalidate = 120



export default async function Post({ params: { title } }: { params: { title: string } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.from('posts').select('*').eq('title', title.replaceAll('%20', ' ')).single()

    let userData

    if (data) {
        userData = await supabase.from('users').select('username, description, profile_pic').eq('user_id', data.user_id).single()
        console.log(userData)
    }
    if (error) {
        console.log(error)
    }

    if (!data || !userData || error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                    <h1 className="text-3xl font-bold">Error getting model</h1>
                </div>
            </div>
        )

    }


    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <div className='flex '>
                    <div className='border border-white w-96 h-96'>
                        <p> Img / Imgs will go here.</p>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <p>Post</p>

                    </div>

                </div>
            </div>
        </div>
    )
}