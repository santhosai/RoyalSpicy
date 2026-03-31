import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b35, #e55a25)',
            margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 800, color: 'white',
            fontFamily: 'Poppins, sans-serif',
          }}>RS</div>
          <h1>Royal Spicy</h1>
          <p>Admin Login — Restaurant POS</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-wrap">
            <label className="input-label">Email Address</label>
            <input
              className="input-field"
              type="email"
              placeholder="admin@royalspicy.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="input-wrap">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={loading}
            style={{ marginTop: 6 }}
          >
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--txt2)', marginTop: 16 }}>
          Royal Spicy Restaurant POS v2.0
        </p>
      </div>
    </div>
  )
}
