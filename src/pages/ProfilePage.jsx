import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { organicCardStyle, btnStyle, inputStyle } from '../components/utils';
import { User, Mail, LogOut, Settings, Key, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Edit Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    
    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    try {
      setProfileLoading(true);
      await updateProfile(name, email);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Generate simple initials avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div style={{
      minHeight: '80vh',
      padding: '4rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        ...organicCardStyle,
        width: '100%',
        maxWidth: '800px',
        padding: '3rem',
        boxShadow: 'var(--shadow-deep)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        {/* Header & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #059669)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--ff-display)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.2rem', margin: 0, color: 'var(--foreground)' }}>
                {user?.name}
              </h2>
              <p style={{ color: 'var(--muted-foreground)', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--primary)" /> Standard User
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px', borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Profile Info & Edit Forms */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Left Column: Details & Edit Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Settings size={20} /> Profile Details
            </h3>

            {profileMsg.text && (
              <div style={{
                background: profileMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: profileMsg.type === 'success' ? '#10b981' : '#ef4444',
                padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem',
                border: `1px solid ${profileMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
              }}>
                {profileMsg.text}
              </div>
            )}

            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '4px' }}>Full Name</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <User size={18} /> {user?.name}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '4px' }}>Email Address</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <Mail size={18} /> {user?.email}
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ ...btnStyle, marginTop: '0.5rem', background: 'var(--foreground)', color: 'var(--background)', padding: '10px' }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" disabled={profileLoading} style={{ ...btnStyle, flex: 1, padding: '10px' }}>
                    {profileLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} disabled={profileLoading} style={{ ...btnStyle, flex: 1, padding: '10px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Key size={20} /> Security
            </h3>

            {passwordMsg.text && (
              <div style={{
                background: passwordMsg.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: passwordMsg.type === 'success' ? '#10b981' : '#ef4444',
                padding: '10px 14px', borderRadius: '8px', fontSize: '0.9rem',
                border: `1px solid ${passwordMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
              }}>
                {passwordMsg.text}
              </div>
            )}

            {!isChangingPassword ? (
              <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', marginTop: 0 }}>
                  Ensure your account is using a long, random password to stay secure.
                </p>
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  style={{ ...btnStyle, background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)', padding: '10px' }}
                >
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Current Password</label>
                  <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Confirm New Password</label>
                  <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" disabled={passwordLoading} style={{ ...btnStyle, flex: 1, padding: '10px' }}>
                    {passwordLoading ? 'Updating...' : 'Update'}
                  </button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} disabled={passwordLoading} style={{ ...btnStyle, flex: 1, padding: '10px', background: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
