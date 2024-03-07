export const runtime = 'edge';

import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers";
import Image from 'next/image';



export default async function Photo({ params: { file_name } }: { params: { file_name: string } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.from('pictures').select('*').eq('file_name', file_name).single()

    console.log(data, file_name, error)

    if (!data || error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                    <h1 className="text-4xl font-bold text-center">404</h1>
                    <p className="text-center">This photo could not be found.</p>
                </div>
            </div>
        )
    }


    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <div>
                    <Image src={data.url} alt={data.file_name} width={700} height={700} />
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}