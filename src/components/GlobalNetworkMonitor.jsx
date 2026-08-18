import { useState, useEffect } from 'react';
import { WifiOff, Activity } from 'lucide-react';

export default function GlobalNetworkMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let conn;
    const updateConn = () => {
      if (conn) {
        setIsSlow(conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g');
      }
    };

    if (navigator.connection) {
      conn = navigator.connection;
      conn.addEventListener('change', updateConn);
      updateConn();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn) conn.removeEventListener('change', updateConn);
    };
  }, []);

  if (isOnline && !isSlow) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none', // Allow clicks to pass through
      padding: '12px'
    }}>
      {!isOnline ? (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: '9999px',
          background: 'var(--destructive)',
          color: 'var(--primary-foreground)',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(168, 84, 72, 0.4)',
          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
        }}>
          <WifiOff size={16} />
          YOU ARE OFFLINE
        </div>
      ) : isSlow ? (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: '9999px',
          background: '#eab308', // warning yellow
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)',
          animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
        }}>
          <Activity size={16} />
          SLOW CONNECTION DETECTED
        </div>
      ) : null}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
