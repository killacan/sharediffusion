import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers";



export default async function Photo({ params: { file_name } }: { params: { file_name: string } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.from('photos').select('*').eq('file_name', file_name).single()
}