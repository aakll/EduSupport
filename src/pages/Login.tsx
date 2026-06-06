import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
  }

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input className="border p-2 block mb-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border p-2 block mb-2 w-full" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 mr-2 rounded" onClick={handleLogin}>Login</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}