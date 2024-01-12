'use client'
import { useCallback, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export default function AccountForm({ user }: { user: User | null }) {
    
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  
    const getProfile = useCallback(async () => {
      try {
        setLoading(true)
  
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user?.id)
          .single()
  
        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setUsername(data.username)
        }
      } catch (error) {
        alert('Error loading user data!')
      } finally {
        setLoading(false)
      }
    }, [user, supabase])
  
    useEffect(() => {
      getProfile()
    }, [user, getProfile])
  
    async function updateProfile({
      username,
    }: {
      username: string | null
    }) {
      try {
        setLoading(true)
  
        const { error } = await supabase.from('profiles').upsert({
          id: user?.id as string,
          username,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
        alert('Profile updated!')
      } catch (error) {
        alert('Error updating the data!')
      } finally {
        setLoading(false)
      }
    }
  
    return (
      <div className="form-widget">
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={user?.email} disabled />
        </div>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname || ''}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
  
        <div>
          <button
            className="button primary block"
            onClick={() => updateProfile({ username })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </button>
        </div>
  
        <div>
          <form action="/auth/signout" method="post">
            <button className="button block" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    )
  }