import AuthButton from '../../components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LinkComponent from './link'
import { create } from 'zustand'
import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'

export default async function Nav() {

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="w-full flex flex-col justify-center items-center border-b border-b-foreground/10 h-17">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <div className='flex gap-2'>
            <a className='text-xl' href={"/"}>Share Diffusion</a>
            {user && <LinkComponent href={"/createpost"}>Post A Model</LinkComponent>}
          </div>
          <AuthButton user={user}/>
        </div>
        <div className="w-full max-w-4xl flex items-center p-3 text-sm">
          <LinkComponent href={"/models"}>Models</LinkComponent>
          <LinkComponent href={"/photos"}>Photos</LinkComponent>
        </div>
    </nav>
  )
}

