// this page is going to be for grabbing an individual post and displaying it.
import { createClient } from '@/utils/supabase/server'
import { headers, cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../_components/ui/select"
import { PostgrestSingleResponse } from '@supabase/postgrest-js'
import VersionSelect from '@/app/_components/versionSelect'

export const revalidate = 120



export interface Version {
    version_id: number,
    post_id: number,
    version_magnet: string,
    upload_date: string,
    name: string,
    user_id: string,
}

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
    let versions
    if (userData) {
        versions = await supabase.from('versions').select('*').eq('post_id', data.post_id)
    }

    if (!data || !userData || error || !versions) {
        return (
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                    <h1 className="text-3xl font-bold">Error getting model and versions</h1>
                </div>
            </div>
        )

    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <div className='flex gap-3'>
                    <div className='border border-white w-96 h-96 text-center rounded-md'>
                        <p> Img / Imgs will go here.</p>
                    </div>
                    <div className='w-72 border border-gray-500 rounded-md'>
                        <h1 className="text-3xl font-bold text-center">{data.title}</h1>
                        <VersionSelect versions={versions} />
                        <p></p>
                    </div>

                </div>
            </div>
        </div>
    )
}