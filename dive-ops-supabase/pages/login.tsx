
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function signIn(e:any){
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="container">
      <div className="panel" style={{maxWidth:420, margin:'0 auto'}}>
        <h2>Sign in</h2>
        <p className="small">Enter your email to receive a one-time sign-in link.</p>
        <form onSubmit={signIn} style={{display:'grid', gap:8}}>
          <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          <button className="btn primary" type="submit">Send magic link</button>
        </form>
        {sent && <div className="small" style={{marginTop:8}}>Check your email for the sign-in link.</div>}
        {error && <div className="small" style={{color:'#b91c1c'}}>{error}</div>}
      </div>
    </div>
  )
}
