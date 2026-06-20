import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-[20px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#d0bcff_0%,transparent_60%)]" />

      <div className="w-full max-w-sm">
        <h1 className="font-headline text-[40px] font-black text-primary text-center mb-2 tracking-tighter">F-music</h1>
        <p className="text-[14px] text-on-surface-variant text-center mb-10">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-error-container/30 border border-error/30 rounded-[12px] text-error text-[14px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-on-primary text-[15px] font-semibold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[14px] text-on-surface-variant mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold">Register</Link>
        </p>
      </div>
    </div>
  )
}
