import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const submit = async (event) => { event.preventDefault(); setError(''); try { await signIn(form) } catch { setError('Unable to sign in. Check your credentials and try again.') } }
  return <main className="auth-page"><div className="auth-card panel"><span className="brand-mark">V</span><p className="eyebrow">WELCOME BACK</p><h1>Sign in to Vault.</h1><p>Continue to your trusted digital asset workspace.</p><form onSubmit={submit}><label>Email address<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <div className="form-error">{error}</div>}<button className="primary-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'} <span>→</span></button></form><button className="google-button">Continue with Google</button><small>New to Vault? <a href="/register">Create an account</a></small></div></main>
}
