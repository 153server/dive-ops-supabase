import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import '../styles/app.css'

interface Session {
  user: {
    email: string;
    // Add other user properties as needed
  };
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        setSession(data.session)
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="header py-4 border-b border-gray-200 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Dive Centre Ops</h1>
            </div>
            <div>
              {loading ? (
                <div className="text-gray-500 text-sm">Loading...</div>
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 hidden md:block">
                    {session.user.email}
                  </div>
                  <button 
                    className="btn bg-red-600 hover:bg-red-700"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn bg-blue-600 hover:bg-blue-700">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Component {...pageProps} session={session} />
    </div>
  )
}
