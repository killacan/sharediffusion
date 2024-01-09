import AuthButton from '../../components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Nav() {

    const cookieStore = cookies()

    const canInitSupabaseClient = () => {
      // This function is just for the interactive tutorial.
      // Feel free to remove it once you have Supabase connected.
      try {
        createClient(cookieStore)
        return true
      } catch (e) {
        return false
      }
    }
  
    const isSupabaseConnected = canInitSupabaseClient()

  return (
    <nav className="w-full flex flex-col justify-center items-center border-b border-b-foreground/10 h-17">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Link className='' href={"/"}>Share Diffusion</Link>
          {isSupabaseConnected && <AuthButton />}
        </div>
        <div className="w-full max-w-4xl flex items-center p-3 text-sm">
          <Link className='' href={"/models"}>Models</Link>
        </div>
    </nav>
  )
}

