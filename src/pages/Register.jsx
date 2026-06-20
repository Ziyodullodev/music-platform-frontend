import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', password2: '', first_name: '', last_name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/otp-verify', { state: { email: form.email } })
    } catch (err) {
      const msg = err.data ? Object.values(err.data).flat().join(' ') : err.message
      setError(msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">{label}</label>
      <input
        type={type}
        required
        className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-[20px] py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#d0bcff_0%,transparent_60%)]" />

      <div className="w-full max-w-sm">
        <h1 className="font-headline text-[40px] font-black text-primary text-center mb-2 tracking-tighter">F-music</h1>
        <p className="text-[14px] text-on-surface-variant text-center mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('first_name', 'First Name', 'text', 'John')}
          {field('last_name', 'Last Name', 'text', 'Doe')}
          {field('email', 'Email', 'email', 'your@email.com')}
          {field('password', 'Password', 'password', '••••••••')}
          {field('password2', 'Confirm Password', 'password', '••••••••')}

          {error && (
            <div className="px-4 py-3 bg-error-container/30 border border-error/30 rounded-[12px] text-error text-[14px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-on-primary text-[15px] font-semibold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[14px] text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
