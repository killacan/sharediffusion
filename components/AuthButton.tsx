import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { userState } from '@/app/_components/user'
import { User } from '@supabase/supabase-js'

interface AuthButtonProps {
  user: User | null;
}

export default function AuthButton({user}: AuthButtonProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // const user = userState((state) => state.user)

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    // return redirect('/login')
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.user_metadata.username}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}
