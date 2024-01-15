import { headers, cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OAuthWithDiscord from '../_components/oauthbutton'
import OAuthWithGithub from '../_components/oauthgithub'
import { signIn, signUp } from '../_components/loginactions'


export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {

  // const signIn = async (formData: FormData) => {
  //   'use server';

  //   const email = formData.get('email') as string
  //   const password = formData.get('password') as string
  //   const username = formData.get('username') as string
  //   const cookieStore = cookies()
  //   const supabase = createClient(cookieStore)

  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   })

  //   if (error) {
  //     return redirect('/login?message=Could not authenticate user')
  //   }

  //   return redirect('/')
  // }

  // const signUp = async (formData: FormData) => {
  //   'use server';

  //   const cookieStore = cookies()
  //   const supabase = createClient(cookieStore)

  //   const origin = headers().get('origin')
  //   const email = formData.get('email') as string
  //   const password = formData.get('password') as string
  //   const username = formData.get('username') as string
  //   const { data: user } = await supabase.from('users').select('*').eq('username', username).single()

  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: {
  //         username,
  //       },
  //       emailRedirectTo: `${origin}/auth/callback`,
  //     },
  //   })

  //   if (user) {
  //     return redirect('/login?message=Username already taken')
  //   }

  //   if (error) {
  //     console.log(error)
  //     return redirect('/login?message=Could not authenticate user')
  //   }

  //   return redirect('/login?message=Check email to continue sign in process')
  // }


  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md gap-2 place-content-center">
      {/* <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link> */}

      <form
        className="animate-in flex flex-col w-full justify-center gap-2 text-foreground"
        action={signIn}
      >
        <label className="text-md" htmlFor="username">
          Username
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="username"
          placeholder="FrankTheTanks69420"
          required
        />
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Sign In
        </button>
        <button
          formAction={signUp}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign Up
        </button>



        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
      <div className='flex justify-center w-full'>
        <OAuthWithDiscord />
        <OAuthWithGithub />
      </div>
    </div>
  )
}
