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

export const revalidate = 120

interface Versions {
    error: any,
    data: [Version]
}

interface Version {
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

    const selectionBuilder = (versions: PostgrestSingleResponse<any[]>) => {
        console.log(versions, "this is the version")


        if (!versions.data) {
            return (
                <SelectItem value="No Versions">No Versions</SelectItem>
            )
        }

        let selectionItems = versions.data.map((version: Version) => (
            <SelectItem value={`${version.name}`}>{version.name}</SelectItem>
        ))

        return selectionItems
    }

    // console.log(version)


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
                        {versions.data && <Select defaultValue={`${versions?.data[0].name}`}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder='Please Select'/>
                        </SelectTrigger>
                        <SelectContent>
                            {selectionBuilder(versions)}
                        </SelectContent>
                        </Select>}
                    </div>

                </div>
            </div>
        </div>
    )
}