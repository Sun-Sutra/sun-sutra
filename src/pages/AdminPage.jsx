import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { SectionLabel, SectionHeading, SectionBody, container, organicCardStyle } from '../components/utils'
import { LogOut, Inbox, Bell, Calendar, Mail, Phone, MapPin, Building, Trash2, CheckCircle, Circle, Eye, EyeOff, User, Lock, Search, ShieldAlert } from 'lucide-react'
import navLogo from '../assets/shared/logo_rectangle.png'

/* ─── Styles ─── */
const pageStyle = {
  minHeight: '100vh',
  background: 'var(--background)',
  fontFamily: 'var(--ff-body)',
  color: 'var(--foreground)',
  position: 'relative',
  overflow: 'hidden',
  paddingBottom: '4rem',
}

const loginCardStyle = {
  ...organicCardStyle,
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 2rem)', maxWidth: 450,
  boxShadow: 'var(--shadow-deep)',
  borderRadius: '2rem 4rem 3rem 1.5rem',
}

const inputLoginStyle = {
  width: '100%', padding: '14px 20px 14px 46px',
  background: 'var(--background)',
  border: '1px solid rgba(222,216,207,0.8)',
  borderRadius: '9999px', color: 'var(--foreground)',
  fontSize: '1rem', outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  fontFamily: 'var(--ff-body)',
}

const btnStyle = {
  width: '100%', padding: '14px',
  background: 'var(--primary)',
  color: 'var(--primary-foreground)', border: 'none', borderRadius: '9999px',
  fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  fontFamily: 'var(--ff-body)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
}

const headerStyle = {
  padding: '1.25rem 0',
  borderBottom: '1px solid rgba(222,216,207,0.5)',
  background: 'var(--surface)',
  boxShadow: 'var(--shadow-soft)',
  position: 'sticky', top: 0, zIndex: 10,
  marginBottom: '3rem',
}

const statCardStyle = {
  ...organicCardStyle,
  padding: '1.5rem 2rem',
  flex: '1 1 240px',
  borderRadius: '1.5rem',
}

const msgCardStyle = {
  ...organicCardStyle,
  padding: '1.75rem',
  transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
  cursor: 'default',
  borderRadius: '1.5rem',
}

const badgeStyle = (read) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 12px',
  borderRadius: 9999,
  fontSize: 11, fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  background: read ? 'rgba(93,112,82,0.1)' : 'rgba(193,140,93,0.15)',
  color: read ? 'var(--primary)' : 'var(--secondary)',
  border: `1px solid ${read ? 'rgba(93,112,82,0.2)' : 'rgba(193,140,93,0.3)'}`,
})

const smallBtnStyle = (isDanger, isOutline) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  background: isOutline ? 'transparent' : isDanger ? 'var(--destructive)' : 'var(--primary)',
  border: isOutline ? `1px solid ${isDanger ? 'var(--destructive)' : 'var(--primary)'}` : 'none',
  borderRadius: '9999px',
  color: isOutline ? (isDanger ? 'var(--destructive)' : 'var(--primary)') : 'var(--primary-foreground)',
  fontSize: 13, fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.2s, background 0.2s',
  fontFamily: 'var(--ff-body)',
})

/* ─── Login Screen ─── */
function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  const { signup } = useAuth()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const handleLogin = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    
    if (!email.trim() || !password.trim() || (isRegistering && !name.trim())) {
      setError('Please fill in all fields')
      return
    }

    if (isRegistering && !email.toLowerCase().endsWith('@sunsutragroup.com')) {
      setError('Admin registration requires an @sunsutragroup.com email address')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    if (isRegistering && otpSent && !otp.trim()) {
      setError('Please enter the 6-digit OTP code')
      return
    }

    setLoading(true)
    setError('')
    try {
      if (isRegistering) {
        if (!otpSent) {
          // 1. Send OTP
          const res = await fetch(`${BACKEND_URL}/api/otp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim() })
          })
          const data = await res.json()
          if (!res.ok) throw new Error(data.error || 'Failed to send OTP')
          
          setOtpSent(true)
          setSuccessMsg('OTP code sent to your email. Please check your inbox.')
        } else {
          // 2. Verify OTP and Signup
          const verifyRes = await fetch(`${BACKEND_URL}/api/otp/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), otp: otp.trim() })
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) throw new Error(verifyData.error || 'Invalid OTP')

          await signup(name.trim(), email.trim(), password)
          setSuccessMsg('Account created successfully!')
          setIsRegistering(false)
          setOtpSent(false)
          setOtp('')
          setPassword('')
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      }
    } catch (err) {
      console.error(err)
      let displayError = err.message || (isRegistering ? 'Failed to register account' : 'Invalid email or password')
      if (err.code === 'auth/invalid-email') {
        displayError = 'Please enter a valid email address'
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        displayError = 'Incorrect email or password'
      } else if (err.code === 'auth/email-already-in-use') {
        displayError = 'An account with this email already exists'
      } else if (err.code === 'auth/weak-password') {
        displayError = 'Password should be at least 6 characters'
      } else if (err.code === 'auth/network-request-failed') {
        displayError = 'Network error. Please check your internet connection.'
      }
      setError(displayError)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageStyle}>
      {/* Background Blobs */}
      <div className="blob-bg blob-1" style={{ top: '10%', left: '-10%', width: 400, height: 400 }} />
      <div className="blob-bg blob-3" style={{ bottom: '10%', right: '-10%', width: 500, height: 500 }} />

      <div style={{
        ...loginCardStyle,
        animation: shake ? 'shake 0.5s ease' : 'fadeSlideUp 0.6s ease',
      }}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:6,background:'var(--primary)'}}/>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--primary)',
            border: '1px solid rgba(222,216,207,0.5)',
          }}>
            <Lock size={24} />
          </div>
          <SectionLabel>Restricted Access</SectionLabel>
          <SectionHeading style={{ fontSize: '2rem', marginBottom: 6 }}>
            {isRegistering ? 'Admin Registration' : 'Admin Sign In'}
          </SectionHeading>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
            {isRegistering ? 'Create a secure admin account' : 'Sign in using Firebase Authentication'}
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegistering && (
            <div style={{ position: 'relative' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                  type="text" value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputLoginStyle}
                  placeholder="Jane Doe"
                  disabled={loading}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(93,112,82,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputLoginStyle}
                placeholder="name@sunsutragroup.com"
                disabled={loading}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(93,112,82,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputLoginStyle}
                placeholder="••••••••"
                disabled={loading || otpSent}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(93,112,82,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          {isRegistering && otpSent && (
            <div style={{ position: 'relative', animation: 'fadeSlideUp 0.3s ease' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>6-Digit OTP Code</label>
              <div style={{ position: 'relative' }}>
                <CheckCircle size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                <input
                  type="text" value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{ ...inputLoginStyle, letterSpacing: '0.2em', fontWeight: 700 }}
                  placeholder="123456"
                  disabled={loading}
                  maxLength={6}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(93,112,82,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>
          )}
          
          {error && (
            <p style={{
              color: 'var(--destructive)', fontSize: 13, textAlign: 'center',
              background: 'rgba(168,84,72,0.08)', padding: '8px 12px',
              borderRadius: '9999px', border: '1px solid rgba(168,84,72,0.2)',
            }}>{error}</p>
          )}
          
          {successMsg && (
            <p style={{
              color: 'var(--primary)', fontSize: 13, textAlign: 'center',
              background: 'rgba(93,112,82,0.1)', padding: '8px 12px',
              borderRadius: '9999px', border: '1px solid rgba(93,112,82,0.2)',
            }}>{successMsg}</p>
          )}

          <button type="submit" style={btnStyle} className="btn-organic" disabled={loading}>
            {loading ? 'Processing...' : (isRegistering ? (otpSent ? 'Verify & Create Account' : 'Send OTP Code') : 'Sign In')}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
                setSuccessMsg('')
              }}
              style={{
                background: 'none', border: 'none', color: 'var(--secondary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              {isRegistering ? 'Already have an admin account? Sign in' : 'Need an admin account? Register'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate(-50%, -45%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%); }
          20% { transform: translate(calc(-50% + 10px), -50%); }
          40% { transform: translate(calc(-50% - 10px), -50%); }
          60% { transform: translate(calc(-50% + 6px), -50%); }
          80% { transform: translate(calc(-50% - 6px), -50%); }
        }
      `}</style>
    </div>
  )
}

/* ─── Media View ─── */
function MediaView() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/api/media')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMedia(data.files || [])
        } else {
          setError(data.error || 'Failed to fetch media')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Network error fetching media')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>Loading media files...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--destructive)' }}>{error}</div>

  if (media.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>
        No media files found in the bucket.
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 2rem 0', fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)' }}>
        Uploaded Media ({media.length})
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {media.map((file) => (
          <div key={file.key} style={{
            ...organicCardStyle,
            borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ height: 160, background: 'var(--muted)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {file.isPdf ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--muted-foreground)' }}>
                  <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '50%' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>PDF Document</span>
                </div>
              ) : (
                <img src={file.url} alt={file.key} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--foreground)', wordBreak: 'break-all' }}>
                {file.key.split('/').pop()}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)' }}>
                <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>{new Date(file.lastModified).toLocaleDateString()}</span>
              </div>
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  marginTop: 'auto', paddingTop: '0.75rem',
                  color: 'var(--primary)', fontSize: 12, fontWeight: 700,
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4
                }}
              >
                View Full Size <span style={{ fontSize: '1.2em' }}>↗</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Users View ─── */
function UsersView() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setUsers(data)
      setLoading(false)
    }, (err) => {
      console.error('Firestore users error:', err)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })

  const formatDate = (ts) => {
    if (!ts) return 'Unknown'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>Loading users...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)' }}>
          Registered Users ({users.length})
        </h3>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputLoginStyle, padding: '10px 16px 10px 42px', fontSize: '0.95rem' }}
          />
          <Search size={18} color="var(--muted-foreground)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <div style={{ ...organicCardStyle, padding: '1rem', borderRadius: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(222,216,207,0.8)' }}>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(222,216,207,0.4)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      {u.name || 'Unknown'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--foreground)' }}>{u.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{formatDate(u.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Dashboard ─── */
function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('messages') // 'messages' | 'users'
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all') // all | unread | read
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionError, setSessionError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setMessages(data)
      setLoading(false)
    }, (err) => {
      console.error('Firestore error:', err)
      setLoading(false)
      if (err.code === 'permission-denied') {
        setSessionError('Permission Denied: Your authentication token is expired or unauthorized to access database feeds.')
      }
    })
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const toggleRead = async (msg) => {
    try {
      await updateDoc(doc(db, 'contactMessages', msg.id), { read: !msg.read })
    } catch (err) {
      console.error('Error updating:', err)
    }
  }

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return
    try {
      await deleteDoc(doc(db, 'contactMessages', id))
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read
    if (filter === 'read') return m.read
    return true
  }).filter(m => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.company || '').toLowerCase().includes(q) ||
      (m.location || '').toLowerCase().includes(q)
    )
  })

  const totalCount = messages.length
  const unreadCount = messages.filter(m => !m.read).length
  const todayCount = messages.filter(m => {
    if (!m.createdAt) return false
    const d = m.createdAt.toDate()
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  const formatDate = (ts) => {
    if (!ts) return 'Just now'
    const d = ts.toDate()
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const tabBtnStyle = (isActive) => ({
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
    color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--ff-display)'
  })

  return (
    <div style={pageStyle}>
      {/* Background Blobs */}
      <div className="blob-bg blob-2" style={{ top: '5%', right: '-5%', width: 500, height: 500 }} />
      <div className="blob-bg blob-3" style={{ bottom: '10%', left: '-5%', width: 500, height: 500 }} />

      {/* Header */}
      <header style={headerStyle}>
        <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <img src={navLogo} alt="Sun Sutra" style={{ height: '34px', width: 'auto', objectFit: 'contain' }} />
            <div style={{ borderLeft: '1px solid rgba(222, 216, 207, 0.8)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--secondary)' }}>Admin Dashboard</span>
              <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: 0 }}>Signed in as {user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={smallBtnStyle(false, true)} className="btn-organic">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ ...container, display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setActiveTab('messages')} style={tabBtnStyle(activeTab === 'messages')}>
          Contact Messages
        </button>
        <button onClick={() => setActiveTab('users')} style={tabBtnStyle(activeTab === 'users')}>
          User Accounts
        </button>
        <button onClick={() => setActiveTab('media')} style={tabBtnStyle(activeTab === 'media')}>
          Uploaded Media
        </button>
      </div>

      <div style={container}>
        {activeTab === 'messages' && (
          <>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Messages', value: totalCount, icon: <Inbox size={22} />, color: 'var(--primary)' },
            { label: 'Unread Messages', value: unreadCount, icon: <Bell size={22} />, color: 'var(--secondary)' },
            { label: 'Received Today', value: todayCount, icon: <Calendar size={22} />, color: 'var(--primary)' },
          ].map((s, i) => (
            <div key={i} style={statCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--ff-display)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Session Error / Permission Denied Alert */}
        {sessionError && (
          <div style={{
            ...organicCardStyle,
            borderColor: 'var(--destructive)',
            background: 'rgba(168,84,72,0.08)',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <ShieldAlert size={28} color="var(--destructive)" />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)' }}>Security Alert</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted-foreground)' }}>{sessionError}</p>
            </div>
          </div>
        )}

        {/* Filters and Search toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['all', 'unread', 'read'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 20px',
                background: filter === f ? 'var(--primary)' : 'var(--surface)',
                border: `1px solid ${filter === f ? 'var(--primary)' : 'rgba(222,216,207,0.8)'}`,
                borderRadius: '9999px',
                color: filter === f ? 'var(--primary-foreground)' : 'var(--foreground)',
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.2s', fontFamily: 'var(--ff-body)',
              }} className="btn-organic">
                {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                background: 'var(--surface)',
                border: '1px solid rgba(222,216,207,0.8)',
                borderRadius: '9999px',
                fontSize: '13px',
                color: 'var(--foreground)',
                outline: 'none',
                fontFamily: 'var(--ff-body)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(222,216,207,0.8)'}
            />
            <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
          </div>
        </div>

        {/* Messages */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--muted-foreground)' }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }}>⏳</div>
            <p style={{ fontWeight: 600 }}>Syncing with Firestore...</p>
          </div>
        ) : filtered.length === 0 ? (
          searchQuery.trim() ? (
            /* No Search Results Empty State */
            <div style={{
              ...organicCardStyle,
              textAlign: 'center',
              padding: '5rem 2rem',
              borderStyle: 'dashed',
              borderColor: 'rgba(222,216,207,0.8)',
              background: 'rgba(222,216,207,0.05)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--muted)',
                color: 'var(--primary)',
                marginBottom: 16
              }}>
                <Search size={22} />
              </div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', marginBottom: 6 }}>No Search Results</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 14, maxWidth: 420, margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                We couldn't find any submissions matching <strong style={{ color: 'var(--foreground)' }}>"{searchQuery}"</strong>. Please verify spelling or clear search filter.
              </p>
              <button onClick={() => setSearchQuery('')} style={smallBtnStyle(false, true)} className="btn-organic">Clear Search Query</button>
            </div>
          ) : (
            /* Standard Empty State */
            <div style={{
              ...organicCardStyle,
              textAlign: 'center', padding: '5rem 2rem',
              borderStyle: 'dashed',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.7 }}>📭</div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', marginBottom: 6 }}>No Submissions Found</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
                {filter === 'all' ? 'All clear! Messages sent via the Contact form will automatically stream here in real-time.' : `There are no ${filter} messages.`}
              </p>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filtered.map((msg, idx) => (
              <div key={msg.id} style={{
                ...msgCardStyle,
                borderLeft: `5px solid ${msg.read ? 'rgba(93,112,82,0.4)' : 'var(--secondary)'}`,
                background: expandedId === msg.id ? 'var(--surface)' : 'var(--surface)',
                transform: expandedId === msg.id ? 'scale(1.01)' : 'none',
                boxShadow: expandedId === msg.id ? 'var(--shadow-float)' : 'var(--shadow-soft)',
                animation: `fadeIn 0.4s ease ${idx * 0.05}s both`,
              }}
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                onMouseEnter={e => { if (expandedId !== msg.id) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { if (expandedId !== msg.id) e.currentTarget.style.transform = 'none' }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expandedId === msg.id ? 20 : 0, gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)', margin: 0, fontFamily: 'var(--ff-body)' }}>
                        {msg.name || 'Anonymous Submission'}
                      </h3>
                      <span style={badgeStyle(msg.read)}>{msg.read ? 'Processed' : 'Action Required'}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0, fontWeight: 500 }}>
                      {msg.email} {msg.company && ` • ${msg.company}`}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                    {formatDate(msg.createdAt)}
                  </span>
                </div>

                {/* Expanded Details */}
                {expandedId === msg.id && (
                  <div style={{ animation: 'fadeIn 0.3s ease', marginTop: 16 }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem', marginBottom: '1.5rem',
                      padding: '1.25rem 1.5rem', background: 'var(--muted)',
                      borderRadius: '1rem', border: '1px solid rgba(222,216,207,0.5)',
                    }}>
                      {[
                        { label: 'Phone Number', value: msg.phone, icon: <Phone size={14} /> },
                        { label: 'Monthly Utility Bill', value: msg.bill, icon: <Inbox size={14} /> },
                        { label: 'Industrial Location', value: msg.location, icon: <MapPin size={14} /> },
                        { label: 'Company / Facility', value: msg.company, icon: <Building size={14} /> },
                      ].filter(f => f.value).map(f => (
                        <div key={f.label}>
                          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {f.icon} {f.label}
                          </div>
                          <div style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 600 }}>{f.value}</div>
                        </div>
                      ))}
                    </div>

                    {msg.message && (
                      <div style={{
                        padding: '1.25rem', background: 'var(--background)',
                        borderRadius: '1rem', marginBottom: '1.5rem',
                        borderLeft: '4px solid var(--primary)',
                      }}>
                        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message Notes</div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--foreground)', margin: 0, fontWeight: 500 }}>{msg.message}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleRead(msg) }} style={smallBtnStyle(false, true)} className="btn-organic">
                        {msg.read ? <EyeOff size={14} /> : <CheckCircle size={14} />}
                        {msg.read ? 'Mark Unread' : 'Mark Processed'}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteMsg(msg.id) }} style={smallBtnStyle(true, false)} className="btn-organic">
                        <Trash2 size={14} /> Delete Submission
                      </button>
                      {msg.email && (
                        <a href={`mailto:${msg.email}`} onClick={e => e.stopPropagation()} style={{
                          ...smallBtnStyle(false, false),
                          textDecoration: 'none', display: 'inline-flex',
                        }} className="btn-organic">
                          <Mail size={14} /> Compose Reply
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </>
        )}

        {activeTab === 'users' && (
          <UsersView />
        )}

        {activeTab === 'media' && (
          <MediaView />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [resendStatus, setResendStatus] = useState('')
  const { resendVerification } = useAuth()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setCheckingAuth(false)
    })
    return () => unsub()
  }, [])

  if (checkingAuth) {
    return (
      <div style={{
        ...pageStyle,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--muted-foreground)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Verifying credentials...</p>
      </div>
    )
  }

  if (user) {
    const isAdminDomain = user.email && user.email.toLowerCase().endsWith('@sunsutragroup.com');

    if (!isAdminDomain) {
      return (
        <div style={{
          ...pageStyle,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--foreground)',
        }}>
          <ShieldAlert size={48} color="var(--destructive)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem' }}>Unauthorized Access</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>This dashboard is restricted to authorized @sunsutragroup.com administrators.</p>
          <button 
            onClick={async () => { await signOut(auth); window.location.href = '/' }}
            style={{ padding: '12px 24px', borderRadius: '9999px', background: 'var(--primary)', color: 'white', fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            Sign Out & Return Home
          </button>
        </div>
      )
    }

    return <Dashboard user={user} />
  }

  return <LoginScreen />
}
