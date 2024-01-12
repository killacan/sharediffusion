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
    console.log(data, error)

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <h1>Profile Page</h1>
                {data && <p>Username: {data.username}</p>}
            </div>
        </div>
    )
}