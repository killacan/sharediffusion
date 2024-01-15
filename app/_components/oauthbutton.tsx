'use client'

import { FaDiscord } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client'

export default function OAuthWithDiscord() {

  const supabase = createClient()

  const handleDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord', 
      options: {
        redirectTo: 'http://localhost:3000/auth/v1/callback/',
      },
    })

    if (error) {
      console.log(error)
    }
  }

    return (
        <button
        onClick={handleDiscord}
          className="flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In with Discord <FaDiscord className='text-2xl mx-3' />
      </button>
    );
  }