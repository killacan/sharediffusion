'use client'

import { FaDiscord } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client'
import { getURL } from "./getauthurl";
import AuthButton from "./authButton";

export default function OAuthWithDiscord() {

  const supabase = createClient()

  const handleDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord', 
      options: {
        redirectTo: getURL(),
      },
    })

    if (error) {
      console.log(error)
    }
  }

    return (
        <AuthButton
        handleFunction={handleDiscord}
        >
          with Discord <FaDiscord className='text-2xl mx-3' />
      </AuthButton>
    );
  }