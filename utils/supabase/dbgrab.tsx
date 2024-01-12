'use server'

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { User } from "@supabase/supabase-js"

export async function lookupUser (username: string) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: user } = await supabase.from('users').select('*').eq('username', username)

    return user
}