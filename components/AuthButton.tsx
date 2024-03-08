import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Session, User } from '@supabase/supabase-js'
import LinkComponent from '@/app/_components/link'

interface AuthButtonProps {
  session: Session | null;
}

export default function AuthButton({session}: AuthButtonProps) {

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    // return redirect('/login')
  }

  // console.log(session, 'session')

  return session ? (
    <div className="flex items-center gap-4">
      <LinkComponent href={`/profiles/${session.user.user_metadata.username}`}>{session.user.user_metadata.username}!</LinkComponent>
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
