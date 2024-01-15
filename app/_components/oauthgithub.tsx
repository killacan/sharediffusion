'use client'

import { FaGithub } from "react-icons/fa";
import { createClient } from '@/utils/supabase/client'
import { getURL } from "./getauthurl";
import AuthButton from "./authButton";

export default function OAuthWithGithub() {

  const supabase = createClient()

  const handleGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github', 
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
        handleFunction={handleGithub}
        >
          with Github <FaGithub className='text-2xl mx-3' />
      </AuthButton>
    );
  }