'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers'
import { formSchema } from '../post/page';
import { signinFormSchema, signupFormSchema } from '../login/page' 
import { z } from 'zod';


export async function signIn(values: z.infer<typeof signinFormSchema>) {
    'use server';

    const email = values.email as string
    const password = values.password as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')

}

export async function signUp(values: z.infer<typeof signupFormSchema>) {
  'use server';

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const origin = headers().get('origin')
  const email = values.email as string
  const password = values.password as string
  const username = values.username as string
  console.log(email, password, username, origin)
  // const { data: user } = await supabase.from('users').select('*').eq('username', username).single()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  // if (user) {
  //   return redirect('/login?message=Username already taken')
  // }

  if (error) {
    console.log(error)
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/login?message=Check email to continue sign in process')
}

export async function createPost(values: z.infer<typeof formSchema>) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const title = values.title
  const magnet = values.magnet
  const description = values.description

  console.log(title, magnet, description)
}