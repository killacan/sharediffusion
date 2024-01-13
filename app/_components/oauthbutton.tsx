'use client'
import { FaDiscord } from "react-icons/fa";

export default function OAuthWithDiscord({ signInWithDiscord }: { signInWithDiscord: any }) {
    return (
        <button
        onClick={signInWithDiscord}
          className="flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
        >
          Sign In with Discord <FaDiscord className='text-2xl mx-3' />
      </button>
    );
  }