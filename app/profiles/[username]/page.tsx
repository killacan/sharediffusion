// export const runtime = 'edge';

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export interface UserData {
    user_id: string,
    username: string,
    email: string,
    description: string,
    profile_image: string,
    followers: number,

}

export default async function ProfilePage({ params: { username } }: { params: { username: string } }  ) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {data, error} = await supabase.from('users').select('*').eq('username', username).single()
    if (error) {
        return (
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <h1 className="text-3xl font-bold">Profile</h1>
                    <p>Username: {username}</p>
                    <p>This user does not exist.</p>
                </div>
            </div>
        )
    }
    // const dataUsername: string = data.username
    let dataDescription: string = ''
    if (data.description) {
        dataDescription = data.description
    } 
    
    // console.log(data, error)

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
            <h1 className="text-3xl font-bold">Profile</h1>
                {<p>Username: {data.username}</p>}
                {<p>Description: {dataDescription}</p>}

            </div>
        </div>
    )
}