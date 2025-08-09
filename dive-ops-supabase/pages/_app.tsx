
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import '../styles/app.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div>
      <div className="container">
        <div className="header">
          <div>
            <h1>Dive Centre Ops — Rental + QR</h1>
            <div className="small">Supabase-connected (Phase 1)</div>
          </div>
          <div>
            {session ? (
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <div className="small">{session.user.email}</div>
                <button className="btn" onClick={()=>supabase.auth.signOut()}>Sign out</button>
              </div>
            ) : (
              <a className="btn" href="/login">Sign in</a>
            )}
          </div>
        </div>
      </div>
      <Component {...pageProps} session={session} />
    </div>
  )
}
