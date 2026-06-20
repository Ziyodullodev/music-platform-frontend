import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api/client'

export default function OtpVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputs = useRef([])

  function handleChange(i, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...code]
    next[i] = val.slice(-1)
    setCode(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...code]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setCode(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fullCode = code.join('')
    if (fullCode.length < 6) return
    setLoading(true)
    setError('')
    try {
      await api.verifyOtp({ email, code: fullCode })
      navigate('/login')
    } catch (err) {
      setError(err.data?.error || err.message || 'Invalid code')
      setCode(['', '', '', '', '', ''])
      inputs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await api.resendOtp('otp', { email })
    } catch {}
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-[20px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#d0bcff_0%,transparent_60%)]" />

      <div className="w-full max-w-sm">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-primary text-[32px]">mark_email_read</span>
        </div>

        <h1 className="font-headline text-[28px] font-bold text-on-surface text-center mb-2">Check your email</h1>
        <p className="text-[14px] text-on-surface-variant text-center mb-8">
          We sent a 6-digit code to<br />
          <span className="text-primary font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-[22px] font-bold bg-surface-container-high border border-white/10 rounded-[12px] text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all caret-primary"
              />
            ))}
          </div>

          {error && (
            <div className="px-4 py-3 bg-error-container/30 border border-error/30 rounded-[12px] text-error text-[14px] mb-4 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.join('').length < 6}
            className="w-full h-14 bg-primary text-on-primary text-[15px] font-semibold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="text-center text-[14px] text-on-surface-variant mt-6">
          Didn't receive the code?{' '}
          <button className="text-primary font-semibold" onClick={handleResend}>Resend</button>
        </p>

        <button
          className="w-full text-center text-[13px] text-on-surface-variant mt-4 hover:text-on-surface transition-colors"
          onClick={() => navigate('/register')}
        >
          ← Back to Register
        </button>
      </div>
    </div>
  )
}
