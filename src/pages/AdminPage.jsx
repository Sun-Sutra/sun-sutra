import { useState, useEffect } from 'react'
import { db, auth } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'
import { SectionLabel, SectionHeading, container, organicCardStyle } from '../components/utils'
import { 
  LogOut, Inbox, Bell, Calendar, Mail, Phone, MapPin, Building, 
  Trash2, CheckCircle, Eye, EyeOff, User, Lock, Search, ShieldAlert, 
  ShieldCheck, Shield, Plus, X, UserPlus, FileText 
} from 'lucide-react'
import navLogo from '../assets/shared/logo_rectangle.png'

const SUPER_ADMIN_EMAIL = (import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'superadmin@sunsutragroup.com').toLowerCase().trim()

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

const roleBadgeStyle = (role) => {
  const isSuper = role === 'superadmin' || role === 'Super Admin';
  const isAdminRole = role === 'admin' || role === 'Admin';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 9999,
    fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: isSuper ? 'rgba(193,140,93,0.18)' : isAdminRole ? 'rgba(93,112,82,0.15)' : 'rgba(100,100,100,0.1)',
    color: isSuper ? 'var(--secondary)' : isAdminRole ? 'var(--primary)' : 'var(--muted-foreground)',
    border: `1px solid ${isSuper ? 'rgba(193,140,93,0.4)' : isAdminRole ? 'rgba(93,112,82,0.3)' : 'rgba(100,100,100,0.2)'}`,
  }
}

const smallBtnStyle = (isDanger, isOutline) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  background: isOutline 
    ? (isDanger ? 'rgba(220, 38, 38, 0.08)' : 'transparent') 
    : (isDanger ? '#dc2626' : 'var(--primary)'),
  border: `1px solid ${isDanger ? '#dc2626' : 'var(--primary)'}`,
  borderRadius: '9999px',
  color: isOutline 
    ? (isDanger ? '#dc2626' : 'var(--primary)') 
    : '#ffffff',
  fontSize: 13, fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
  fontFamily: 'var(--ff-body)',
  boxShadow: isDanger && !isOutline ? '0 4px 14px rgba(220, 38, 38, 0.3)' : 'none',
})

/* ─── Toast Notification Component ─── */
function ToastNotification({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose && onClose()
    }, 3500)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const isErr = type === 'error'
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 3000,
      background: isErr ? '#dc2626' : '#1c1d20',
      color: '#ffffff',
      padding: '14px 24px',
      borderRadius: '9999px',
      boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 14, fontWeight: 700,
      animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'var(--ff-body)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      {isErr ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
      <span>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: 2, marginLeft: 6 }}>
        <X size={16} />
      </button>
    </div>
  )
}

/* ─── Confirm Dialog Modal Component ─── */
function ConfirmDialogModal({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, isDanger = true }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '1.5rem',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onCancel}>
      <div style={{
        ...organicCardStyle,
        width: '100%', maxWidth: '440px',
        padding: '2.25rem 2rem', borderRadius: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        background: '#ffffff',
        textAlign: 'center',
        border: '1px solid rgba(222, 216, 207, 0.8)',
        animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: isDanger ? '#fef2f2' : 'rgba(93,112,82,0.12)',
          color: isDanger ? '#dc2626' : 'var(--primary)',
          border: `1px solid ${isDanger ? '#fecaca' : 'rgba(93,112,82,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          {isDanger ? <Trash2 size={28} /> : <ShieldCheck size={28} />}
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--ff-display)', color: '#1c1d20' }}>
          {title}
        </h3>
        <p style={{ margin: '0 0 1.75rem 0', fontSize: 14, color: '#6c757d', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            ...smallBtnStyle(false, true),
            padding: '12px 22px', flex: 1, justifyContent: 'center'
          }} className="btn-organic">
            {cancelText}
          </button>
          <button onClick={onConfirm} style={{
            ...smallBtnStyle(isDanger, false),
            padding: '12px 22px', flex: 1, justifyContent: 'center'
          }} className="btn-organic">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Login Screen ─── */
function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPass = password.trim()

    if (!trimmedEmail || !trimmedPass) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')
    try {
      // Secure Server-side Super Admin Check
      if (trimmedEmail === SUPER_ADMIN_EMAIL) {
        const authRes = await fetch(`${BACKEND_URL}/api/admin/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail, password: trimmedPass })
        })
        const authData = await authRes.json()
        if (!authRes.ok) {
          throw new Error(authData.error || 'Invalid Super Admin credentials')
        }

        // Verified by server! Now authenticate / bootstrap with Firebase Auth
        try {
          await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass)
        } catch (authErr) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass)
            await setDoc(doc(db, 'admins', trimmedEmail), {
              email: trimmedEmail,
              name: 'Super Admin',
              role: 'superadmin',
              createdAt: serverTimestamp()
            })
            await setDoc(doc(db, 'users', userCred.user.uid), {
              name: 'Super Admin',
              email: trimmedEmail,
              role: 'superadmin',
              createdAt: serverTimestamp()
            })
          } else {
            throw authErr
          }
        }
        return
      }

      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass)
    } catch (err) {
      console.error(err)
      let displayError = err.message || 'Invalid email or password'
      if (err.code === 'auth/invalid-email') {
        displayError = 'Please enter a valid email address'
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        displayError = 'Incorrect email or password'
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
            Admin Portal Sign In
          </SectionHeading>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14 }}>
            Sign in using authorized Admin or Super Admin credentials
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                disabled={loading}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(93,112,82,0.1)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(222,216,207,0.8)'; e.target.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          {error && (
            <p style={{
              color: 'var(--destructive)', fontSize: 13, textAlign: 'center',
              background: 'rgba(168,84,72,0.08)', padding: '8px 12px',
              borderRadius: '9999px', border: '1px solid rgba(168,84,72,0.2)',
            }}>{error}</p>
          )}

          <button type="submit" style={btnStyle} className="btn-organic" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
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

/* ─── Media View (With In-App R2 Bill Previewer & Delete) ─── */
function MediaView({ showToast, showConfirm }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const fetchMedia = () => {
    setLoading(true)
    fetch(`${BACKEND_URL}/api/media`)
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
  }

  useEffect(() => {
    let active = true
    fetch(`${BACKEND_URL}/api/media`)
      .then(res => res.json())
      .then(data => {
        if (!active) return
        if (data.success) {
          setMedia(data.files || [])
        } else {
          setError(data.error || 'Failed to fetch media')
        }
      })
      .catch(err => {
        if (!active) return
        console.error(err)
        setError('Network error fetching media')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [BACKEND_URL])

  const handleDeleteFile = (file) => {
    const filename = file.key.split('/').pop()
    if (showConfirm) {
      showConfirm(
        'Delete Bill File?',
        `Are you sure you want to permanently delete "${filename}" from Cloudflare R2 storage? This cannot be undone.`,
        async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/api/media/delete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key: file.key })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to delete file')

            showToast && showToast(`File "${filename}" deleted from storage`, 'success')
            if (selectedFile?.key === file.key) setSelectedFile(null)
            fetchMedia()
          } catch (err) {
            console.error(err)
            showToast && showToast('Failed to delete file: ' + err.message, 'error')
          }
        },
        'Delete File'
      )
    }
  }

  const filteredMedia = media.filter(file => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return file.key.toLowerCase().includes(q)
  })

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>Loading media files from R2 Bucket...</div>
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: '#dc2626' }}>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)' }}>
            Uploaded Bills & Media ({media.length})
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
            Preview consumer bills stored in R2 Bucket directly in-browser without downloading.
          </p>
        </div>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search bills by consumer number or name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputLoginStyle, padding: '10px 16px 10px 42px', fontSize: '0.95rem' }}
          />
          <Search size={18} color="var(--muted-foreground)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <div style={{
          ...organicCardStyle,
          textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed'
        }}>
          <FileText size={48} color="var(--muted-foreground)" style={{ marginBottom: 12, opacity: 0.6 }} />
          <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem' }}>No Consumer Bills Found</h4>
          <p style={{ color: 'var(--muted-foreground)', fontSize: 14, margin: 0 }}>
            {searchQuery.trim() ? `No bills matching "${searchQuery}".` : 'No uploaded bills found in R2 bucket.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredMedia.map((file) => (
            <div key={file.key} style={{
              ...organicCardStyle,
              borderRadius: '1.25rem', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div 
                onClick={() => setSelectedFile(file)}
                style={{ 
                  height: 170, background: 'var(--muted)', position: 'relative', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                {file.isPdf ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--muted-foreground)' }}>
                    <div style={{ padding: '16px', background: 'var(--surface)', borderRadius: '50%', boxShadow: 'var(--shadow-soft)' }}>
                      <FileText size={32} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>PDF Bill Document</span>
                  </div>
                ) : (
                  <img src={file.url} alt={file.key} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                )}
                
                {/* Overlay hover badge */}
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s',
                  color: 'white', fontWeight: 700, fontSize: 13, gap: 6
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <Eye size={18} /> Preview Bill
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--foreground)', wordBreak: 'break-all', fontFamily: 'var(--ff-body)' }}>
                  {file.key.split('/').pop()}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600 }}>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>{new Date(file.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(222,216,207,0.6)', alignItems: 'center' }}>
                  <button
                    onClick={() => setSelectedFile(file)}
                    style={{
                      flex: 1, background: 'none', border: 'none',
                      color: 'var(--primary)', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 0', textAlign: 'left'
                    }}
                  >
                    <Eye size={15} /> Preview
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteFile(file) }}
                    style={{
                      ...smallBtnStyle(true, true),
                      padding: '6px 12px', fontSize: 12
                    }}
                    className="btn-organic"
                    title="Delete file from storage"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App Bill Viewer Modal (No Download Forced) */}
      {selectedFile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1.5rem',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setSelectedFile(null)}>
          <div style={{
            ...organicCardStyle,
            width: '100%', maxWidth: '950px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            borderRadius: '1.5rem', overflow: 'hidden', padding: 0,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            background: 'var(--surface)'
          }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(222,216,207,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: 'rgba(93,112,82,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--secondary)' }}>
                    In-Browser Bill Preview (No Download Required)
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--foreground)' }}>
                    {selectedFile.key.split('/').pop()}
                  </h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => handleDeleteFile(selectedFile)}
                  style={{
                    ...smallBtnStyle(true, true),
                    padding: '6px 14px', fontSize: 12
                  }}
                  className="btn-organic"
                >
                  <Trash2 size={14} /> Delete File
                </button>
                <button 
                  onClick={() => setSelectedFile(null)} 
                  style={{
                    background: 'var(--muted)', border: 'none', cursor: 'pointer', color: 'var(--foreground)',
                    padding: 8, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: Embed / iFrame / Image */}
            <div style={{ padding: '1rem', flex: 1, overflow: 'auto', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selectedFile.isPdf ? (
                <iframe
                  src={selectedFile.url}
                  title={selectedFile.key}
                  style={{ width: '100%', height: '72vh', border: 'none', borderRadius: '0.75rem' }}
                />
              ) : (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.key}
                  style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '0.75rem', boxShadow: 'var(--shadow-soft)' }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.75rem', borderTop: '1px solid rgba(222,216,207,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--surface)', fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 600
            }}>
              <span>File Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              <span>Uploaded On: {new Date(selectedFile.lastModified).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Users View ─── */
function UsersView({ showToast, showConfirm }) {
  const [users, setUsers] = useState([])
  const [adminsList, setAdminsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  useEffect(() => {
    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setUsers(data)
      setLoading(false)
    }, (err) => {
      console.warn('Firestore users note:', err.message)
      setLoading(false)
    })

    fetch(`${BACKEND_URL}/api/admin/list`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAdminsList((data.admins || []).map(a => (a.email || '').toLowerCase()))
        }
      })
      .catch(err => console.warn('Backend admin fetch note:', err))

    return () => unsubUsers()
  }, [BACKEND_URL])

  const handleDeleteUser = (u) => {
    if (showConfirm) {
      showConfirm(
        'Delete User Account?',
        `Are you sure you want to remove the registered user account for "${u.name || u.email}"?`,
        async () => {
          try {
            await deleteDoc(doc(db, 'users', u.id))
            showToast && showToast(`User account removed for ${u.email}`, 'success')
          } catch (err) {
            console.error('Error deleting user:', err)
            showToast && showToast('Failed to delete user: ' + err.message, 'error')
          }
        },
        'Delete User'
      )
    }
  }

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })

  const getUserRole = (u) => {
    const userEmail = (u.email || '').toLowerCase()
    if (userEmail === SUPER_ADMIN_EMAIL || u.role === 'superadmin') return 'Super Admin'
    if (adminsList.includes(userEmail) || userEmail.endsWith('@sunsutragroup.com') || u.role === 'admin') return 'Admin'
    return 'User'
  }

  const formatDate = (ts) => {
    if (!ts) return 'Unknown'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>Loading user accounts...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)' }}>
            Registered User Accounts ({users.length})
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
            Real-time feed of all registered users on the Sun Sutra platform.
          </p>
        </div>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputLoginStyle, padding: '10px 16px 10px 42px', fontSize: '0.95rem' }}
          />
          <Search size={18} color="var(--muted-foreground)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <div style={{ ...organicCardStyle, padding: '1rem', borderRadius: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(222,216,207,0.8)' }}>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>User Name</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>Joined Date</th>
              <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                  No registered users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => {
                const role = getUserRole(u)
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(222,216,207,0.4)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        {u.name || 'Anonymous User'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--foreground)' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={roleBadgeStyle(role)}>
                        {role === 'Super Admin' && <ShieldCheck size={12} />}
                        {role === 'Admin' && <Shield size={12} />}
                        {role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{formatDate(u.createdAt)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {role !== 'Super Admin' && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          style={{ ...smallBtnStyle(true, true), padding: '6px 12px', fontSize: 12 }}
                          className="btn-organic"
                          title="Delete user account"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── Manage Admins View (Super Admin Only) ─── */
function AdminsView({ currentUser, showToast, showConfirm }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/list`)
      const data = await res.json()
      if (data.success) {
        setAdmins(data.admins || [])
      }
    } catch (err) {
      console.warn('Error listing admins:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    fetch(`${BACKEND_URL}/api/admin/list`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setAdmins(data.admins || [])
        }
      })
      .catch(err => console.warn('Error listing admins:', err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [BACKEND_URL])

  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()
    const trimmedPass = password.trim()

    if (!trimmedEmail || !trimmedName || !trimmedPass) {
      setError('Please provide name, email, and password.')
      return
    }

    if (!trimmedEmail.endsWith('@sunsutragroup.com')) {
      setError('Admin email must end with @sunsutragroup.com.')
      return
    }

    if (trimmedPass.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setCreating(true)
    try {
      // 1. Create admin via Express Backend API
      const res = await fetch(`${BACKEND_URL}/api/admin/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password: trimmedPass })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create admin account.')
      }

      // 2. Optional Firebase Auth account creation attempt
      try {
        await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass)
      } catch (authErr) {
        // Ignore auth error if user exists
      }

      // 3. Optional Firestore write wrapped silently in try-catch
      try {
        await setDoc(doc(db, 'admins', trimmedEmail), {
          email: trimmedEmail,
          name: trimmedName,
          role: 'admin',
          createdAt: serverTimestamp(),
          createdBy: currentUser?.email || 'superadmin'
        })
      } catch (firestoreErr) {
        // Silent catch for client-side permission restrictions
      }

      const msg = `Admin account created for ${trimmedEmail}!`
      setSuccess(msg)
      showToast && showToast(msg, 'success')
      setName('')
      setEmail('')
      setPassword('')
      fetchAdmins()
    } catch (err) {
      console.error('Error creating admin:', err)
      setError(err.message || 'Failed to create admin account.')
      showToast && showToast(err.message || 'Failed to create admin account', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAdmin = (adminDoc) => {
    if (adminDoc.email.toLowerCase() === SUPER_ADMIN_EMAIL) {
      showToast && showToast('Super Admin account cannot be deleted.', 'error')
      return
    }

    if (showConfirm) {
      showConfirm(
        'Revoke Admin Access?',
        `Are you sure you want to remove admin access for ${adminDoc.email}?`,
        async () => {
          try {
            const res = await fetch(`${BACKEND_URL}/api/admin/delete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: adminDoc.email })
            })
            const data = await res.json()
            if (!res.ok) {
              throw new Error(data.error || 'Failed to delete admin.')
            }

            try {
              await deleteDoc(doc(db, 'admins', adminDoc.id || adminDoc.email))
            } catch (firestoreErr) {
              console.warn('Firestore admin delete note:', firestoreErr.message)
            }

            showToast && showToast(`Admin permissions revoked for ${adminDoc.email}`, 'success')
            fetchAdmins()
          } catch (err) {
            console.error('Error deleting admin:', err)
            showToast && showToast('Failed to delete admin: ' + err.message, 'error')
          }
        },
        'Revoke Access'
      )
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>Loading administrators...</div>
  }

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--foreground)' }}>
          Manage Administrators
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
          As Super Admin, you can grant or revoke admin permissions across the platform.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Create Admin Form */}
        <div style={{ ...organicCardStyle, padding: '1.75rem', borderRadius: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(93,112,82,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={20} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Create New Admin</h4>
          </div>

          <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }}>Full Name</label>
              <input
                type="text"
                placeholder="Admin Name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ ...inputLoginStyle, padding: '10px 16px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }}>Email Address (@sunsutragroup.com)</label>
              <input
                type="email"
                placeholder="admin@sunsutragroup.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputLoginStyle, padding: '10px 16px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputLoginStyle, padding: '10px 16px' }}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--destructive)', fontSize: 12, margin: 0, background: 'rgba(168,84,72,0.1)', padding: '8px 12px', borderRadius: '9999px' }}>
                {error}
              </p>
            )}
            {success && (
              <p style={{ color: 'var(--primary)', fontSize: 12, margin: 0, background: 'rgba(93,112,82,0.1)', padding: '8px 12px', borderRadius: '9999px' }}>
                {success}
              </p>
            )}

            <button type="submit" disabled={creating} style={{ ...btnStyle, marginTop: 6 }} className="btn-organic">
              {creating ? 'Creating Admin...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* Admins Table */}
        <div style={{ ...organicCardStyle, padding: '1.75rem', borderRadius: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', fontWeight: 700 }}>Authorized Admins ({admins.length})</h4>
          
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(222,216,207,0.8)' }}>
                  <th style={{ padding: '8px 12px', color: 'var(--muted-foreground)' }}>Admin</th>
                  <th style={{ padding: '8px 12px', color: 'var(--muted-foreground)' }}>Role</th>
                  <th style={{ padding: '8px 12px', color: 'var(--muted-foreground)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Fixed Super Admin Row */}
                <tr style={{ borderBottom: '1px solid rgba(222,216,207,0.4)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>
                    <div>Super Admin</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 400 }}>{SUPER_ADMIN_EMAIL}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={roleBadgeStyle('superadmin')}><ShieldCheck size={12} /> Super Admin</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', color: 'var(--muted-foreground)', fontSize: 11 }}>
                    Protected
                  </td>
                </tr>

                {admins.filter(a => (a.email || '').toLowerCase() !== SUPER_ADMIN_EMAIL).map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid rgba(222,216,207,0.4)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <div>{a.name || 'Admin'}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 400 }}>{a.email}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={roleBadgeStyle('admin')}><Shield size={12} /> Admin</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteAdmin(a)}
                        style={{ ...smallBtnStyle(true, true), padding: '6px 12px', fontSize: 12 }}
                        className="btn-organic"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Dashboard ─── */
function Dashboard({ user, isSuperAdmin }) {
  const [activeTab, setActiveTab] = useState('messages') // 'messages' | 'users' | 'media' | 'admins'
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all') // all | unread | read
  const [searchQuery, setSearchQuery] = useState('')
  const [sessionError, setSessionError] = useState(null)

  // Custom Toast & Modal state
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Delete' })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const showConfirm = (title, message, onConfirm, confirmText = 'Delete') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }))
        onConfirm()
      }
    })
  }

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

  const deleteMsg = (msg) => {
    showConfirm(
      'Delete Submission?',
      `Are you sure you want to permanently delete the message submission from ${msg.name || msg.email || 'this user'}?`,
      async () => {
        try {
          await deleteDoc(doc(db, 'contactMessages', msg.id))
          showToast('Contact message deleted successfully', 'success')
        } catch (err) {
          console.error('Error deleting:', err)
          showToast('Failed to delete message: ' + err.message, 'error')
        }
      },
      'Delete Permanently'
    )
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
    const d = m.createdAt.toDate ? m.createdAt.toDate() : new Date(m.createdAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length

  const formatDate = (ts) => {
    if (!ts) return 'Just now'
    const d = ts.toDate ? ts.toDate() : new Date(ts)
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
    fontFamily: 'var(--ff-display)',
    display: 'flex', alignItems: 'center', gap: 6
  })

  return (
    <div style={pageStyle}>
      <div className="blob-bg blob-2" style={{ top: '5%', right: '-5%', width: 500, height: 500 }} />
      <div className="blob-bg blob-3" style={{ bottom: '10%', left: '-5%', width: 500, height: 500 }} />

      {/* Header */}
      <header style={headerStyle}>
        <div className="admin-header-container" style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <img src={navLogo} alt="Sun Sutra" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <div style={{ borderLeft: '1px solid rgba(222, 216, 207, 0.8)', paddingLeft: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--secondary)' }}>Admin Dashboard</span>
                <span style={roleBadgeStyle(isSuperAdmin ? 'superadmin' : 'admin')}>
                  {isSuperAdmin ? <ShieldCheck size={12} /> : <Shield size={12} />}
                  {isSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: 0 }}>Signed in as {user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={smallBtnStyle(false, true)} className="btn-organic admin-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs-container" style={{ ...container, display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('messages')} style={tabBtnStyle(activeTab === 'messages')}>
          Contact Messages
        </button>
        <button onClick={() => setActiveTab('users')} style={tabBtnStyle(activeTab === 'users')}>
          User Accounts
        </button>
        <button onClick={() => setActiveTab('media')} style={tabBtnStyle(activeTab === 'media')}>
          Uploaded Media / Bills
        </button>
        {isSuperAdmin && (
          <button onClick={() => setActiveTab('admins')} style={tabBtnStyle(activeTab === 'admins')}>
            <ShieldCheck size={18} color="var(--secondary)" /> Manage Admins
          </button>
        )}
      </div>

      <div style={container}>
        {activeTab === 'messages' && (
          <>
            <div className="admin-stat-grid" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Messages', value: totalCount, icon: <Inbox size={22} />, color: 'var(--primary)' },
                { label: 'Unread Messages', value: unreadCount, icon: <Bell size={22} />, color: 'var(--secondary)' },
                { label: 'Received Today', value: todayCount, icon: <Calendar size={22} />, color: 'var(--primary)' },
              ].map((s, i) => (
                <div key={i} style={statCardStyle} className="admin-stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--foreground)', fontFamily: 'var(--ff-display)' }}>{s.value}</div>
                </div>
              ))}
            </div>

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

            <div className="admin-toolbar" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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

              <div className="admin-search-container" style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
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

            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--muted-foreground)' }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }}>⏳</div>
                <p style={{ fontWeight: 600 }}>Syncing with Firestore...</p>
              </div>
            ) : filtered.length === 0 ? (
              searchQuery.trim() ? (
                <div style={{
                  ...organicCardStyle,
                  textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed',
                  borderColor: 'rgba(222,216,207,0.8)', background: 'rgba(222,216,207,0.05)'
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--muted)', color: 'var(--primary)', marginBottom: 16 }}>
                    <Search size={22} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', marginBottom: 6 }}>No Search Results</h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: 14, maxWidth: 420, margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                    We couldn't find any submissions matching <strong style={{ color: 'var(--foreground)' }}>"{searchQuery}"</strong>.
                  </p>
                  <button onClick={() => setSearchQuery('')} style={smallBtnStyle(false, true)} className="btn-organic">Clear Search Query</button>
                </div>
              ) : (
                <div style={{ ...organicCardStyle, textAlign: 'center', padding: '5rem 2rem', borderStyle: 'dashed' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedId === msg.id ? 20 : 0, gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)', margin: 0, fontFamily: 'var(--ff-body)' }}>
                            {msg.name || 'Anonymous Submission'}
                          </h3>
                          <span style={badgeStyle(msg.read)}>{msg.read ? 'Processed' : 'Action Required'}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: 0, fontWeight: 500 }}>
                          {msg.email} {msg.company && ` • ${msg.company}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {formatDate(msg.createdAt)}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMsg(msg) }}
                          title="Delete Submission"
                          style={{
                            ...smallBtnStyle(true, true),
                            padding: '6px 14px',
                            fontSize: 12,
                            background: 'rgba(220, 38, 38, 0.1)',
                            borderColor: 'rgba(220, 38, 38, 0.4)',
                            color: '#dc2626',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                          className="btn-organic"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>

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
                          <button onClick={(e) => { e.stopPropagation(); deleteMsg(msg) }} style={smallBtnStyle(true, false)} className="btn-organic">
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

        {activeTab === 'users' && <UsersView showToast={showToast} showConfirm={showConfirm} />}
        {activeTab === 'media' && <MediaView showToast={showToast} showConfirm={showConfirm} />}
        {activeTab === 'admins' && isSuperAdmin && <AdminsView currentUser={user} showToast={showToast} showConfirm={showConfirm} />}
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText || 'Delete'}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isDanger={true}
      />

      {/* Floating Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* Responsive Styles for Phone & Small Screens */
        @media (max-width: 768px) {
          .admin-header-container {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .admin-header-container > div:first-child {
            width: 100%;
          }
          .admin-logout-btn {
            align-self: flex-end;
            margin-top: -38px;
          }
          .admin-tabs-container {
            overflow-x: auto !important;
            white-space: nowrap !important;
            padding-bottom: 8px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .admin-tabs-container::-webkit-scrollbar {
            display: none;
          }
          .admin-tabs-container button {
            flex-shrink: 0 !important;
            padding: 10px 16px !important;
            font-size: 0.9rem !important;
          }
          .admin-toolbar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .admin-search-container {
            width: 100% !important;
          }
          .admin-stat-grid {
            flex-direction: column !important;
          }
          .admin-stat-card {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const emailLower = (currentUser.email || '').toLowerCase().trim()
        const isSuper = emailLower === SUPER_ADMIN_EMAIL
        setIsSuperAdmin(isSuper)

        if (isSuper || emailLower.endsWith('@sunsutragroup.com')) {
          setIsAdmin(true)
        } else {
          try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
            const res = await fetch(`${BACKEND_URL}/api/admin/list`)
            const data = await res.json()
            if (data.success && (data.admins || []).some(a => (a.email || '').toLowerCase() === emailLower)) {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
            }
          } catch (err) {
            setIsAdmin(false)
          }
        }
      } else {
        setIsSuperAdmin(false)
        setIsAdmin(false)
      }
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
    if (!isAdmin) {
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

    return <Dashboard user={user} isSuperAdmin={isSuperAdmin} />
  }

  return <LoginScreen />
}
