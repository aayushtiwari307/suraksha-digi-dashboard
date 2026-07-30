import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getDate = () => new Date().toLocaleDateString('en-IN', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

const ALERT_LABELS = {
  fraud: 'Fraud attempt',
  confusion: 'Confusion detected',
  inactivity: 'Inactivity',
  unusual_transaction: 'Unusual transaction',
  suspicious_link: 'Suspicious link'
};

function Dashboard() {
  const { family, logout } = useAuth();
  const navigate = useNavigate();
  const [elderId, setElderId] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const fetchAlerts = async () => {
    if (!elderId.trim()) return;
    setError(''); setFetched(false); setLoading(true);
    try {
      const res = await API.get(`/alerts/elder/${elderId}`);
      setAlerts(res.data.alerts);
      setFetched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await API.put(`/alerts/resolve/${alertId}`);
      setAlerts(prev => prev.map(a => a._id === alertId ? { ...a, isResolved: true } : a));
    } catch {
      setError('Failed to resolve alert');
    }
  };

  const unresolved = alerts.filter(a => !a.isResolved).length;
  const resolved = alerts.filter(a => a.isResolved).length;

  return (
    <div style={s.page}>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <i style={s.navIcon}>🛡️</i>
          <span style={s.navBrand}>Suraksha<span style={{ color: '#d97706' }}>Digi</span></span>
        </div>
        <div style={s.navRight}>
          <div style={s.userPill}>
            <div style={s.avatar}>{family?.name?.[0]?.toUpperCase()}</div>
            <span style={s.userName}>{family?.name}</span>
          </div>
          <button onClick={() => navigate('/add-elder')} style={s.addBtn}>
            + Add elder
          </button>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={s.body}>

        {/* HERO */}
        <div style={s.hero}>
          <div>
            <p style={s.dateText}>{getDate()}</p>
            <h1 style={s.greeting}>{getGreeting()}, {family?.name?.split(' ')[0]} 👋</h1>
            <p style={s.heroSub}>Monitor your elders' digital safety and stay informed in real time.</p>
          </div>
          <div style={s.activeBadge}>
            <span style={s.activeDot}></span>
            System active
          </div>
        </div>

        {/* STATS */}
        {fetched && (
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <p style={s.statLabel}>Total alerts</p>
              <p style={s.statNum}>{alerts.length}</p>
            </div>
            <div style={{ ...s.statCard, background: unresolved > 0 ? '#fff7ed' : undefined }}>
              <p style={s.statLabel}>Active alerts</p>
              <p style={{ ...s.statNum, color: unresolved > 0 ? '#c2410c' : '#16a34a' }}>{unresolved}</p>
            </div>
            <div style={s.statCard}>
              <p style={s.statLabel}>Resolved</p>
              <p style={{ ...s.statNum, color: '#16a34a' }}>{resolved}</p>
            </div>
          </div>
        )}

        {/* SEARCH */}
        <div style={s.searchCard}>
          <div style={s.searchTop}>
            <div>
              <p style={s.searchTitle}>View elder alerts</p>
              <p style={s.searchSub}>Enter the elder ID to fetch their safety alerts</p>
            </div>
          </div>
          <div style={s.searchRow}>
            <input
              type="text"
              placeholder="Paste elder ID here..."
              value={elderId}
              onChange={e => setElderId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchAlerts()}
              style={s.input}
              autoComplete="off"
            />
            <button onClick={fetchAlerts} style={s.fetchBtn} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch alerts'}
            </button>
          </div>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        {/* ALERTS */}
        {fetched && alerts.length === 0 && (
          <div style={s.empty}>
            <p style={s.emptyIcon}>✅</p>
            <p style={s.emptyTitle}>No alerts found</p>
            <p style={s.emptySub}>This elder has no recorded safety alerts.</p>
          </div>
        )}

        {alerts.map(alert => (
          <div key={alert._id} style={{
            ...s.alertCard,
            borderLeftColor: alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#16a34a'
          }}>
            <div style={s.alertTop}>
              <div style={s.alertLeft}>
                <span style={{
                  ...s.severityPill,
                  background: alert.severity === 'high' ? '#fef2f2' : alert.severity === 'medium' ? '#fffbeb' : '#f0fdf4',
                  color: alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#d97706' : '#16a34a',
                  border: `0.5px solid ${alert.severity === 'high' ? '#fca5a5' : alert.severity === 'medium' ? '#fcd34d' : '#86efac'}`
                }}>
                  {alert.severity} severity
                </span>
                <span style={s.alertTypeTag}>
                  {ALERT_LABELS[alert.type] || alert.type}
                </span>
              </div>
              {alert.isResolved
                ? <span style={s.resolvedTag}>✅ Resolved</span>
                : <button onClick={() => resolveAlert(alert._id)} style={s.resolveBtn}>Mark resolved</button>
              }
            </div>
            <p style={s.alertMsg}>{alert.message}</p>
            {alert.messageHindi && <p style={s.alertHindi}>{alert.messageHindi}</p>}
            <p style={s.alertTime}>{new Date(alert.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  nav: { background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  navIcon: { fontSize: '18px' },
  navBrand: { fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  userPill: { display: 'flex', alignItems: 'center', gap: '7px', background: '#f1f5f9', padding: '5px 12px 5px 5px', borderRadius: '100px', border: '0.5px solid #e2e8f0' },
  avatar: { width: '24px', height: '24px', background: '#0f172a', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 },
  userName: { fontSize: '13px', fontWeight: 500, color: '#0f172a' },
  addBtn: { padding: '7px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.1px' },
  logoutBtn: { padding: '7px 14px', background: 'transparent', border: '0.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' },
  body: { maxWidth: '800px', margin: '0 auto', padding: '32px 24px' },
  hero: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  dateText: { fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  greeting: { fontSize: '24px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 6px' },
  heroSub: { fontSize: '14px', color: '#64748b', margin: 0 },
  activeBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '0.5px solid #bbf7d0', borderRadius: '100px', padding: '6px 14px', fontSize: '12px', color: '#16a34a', fontWeight: 500, whiteSpace: 'nowrap' },
  activeDot: { width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '20px' },
  statCard: { background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px' },
  statLabel: { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' },
  statNum: { fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' },
  searchCard: { background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  searchTop: { marginBottom: '14px' },
  searchTitle: { fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 3px' },
  searchSub: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  searchRow: { display: 'flex', gap: '8px' },
  input: { flex: 1, height: '40px', padding: '0 14px', borderRadius: '8px', border: '0.5px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', fontFamily: 'monospace' },
  fetchBtn: { height: '40px', padding: '0 18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  errorBox: { background: '#fef2f2', border: '0.5px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' },
  empty: { textAlign: 'center', padding: '48px 0' },
  emptyIcon: { fontSize: '36px', margin: '0 0 12px' },
  emptyTitle: { fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' },
  emptySub: { fontSize: '13px', color: '#94a3b8', margin: 0 },
  alertCard: { background: '#fff', border: '0.5px solid #e2e8f0', borderLeft: '3px solid', borderRadius: '0 12px 12px 0', padding: '16px 20px', marginBottom: '10px' },
  alertTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  severityPill: { fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', textTransform: 'capitalize' },
  alertTypeTag: { fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px' },
  resolvedTag: { fontSize: '12px', color: '#16a34a', fontWeight: 600 },
  resolveBtn: { padding: '6px 14px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  alertMsg: { fontSize: '14px', color: '#0f172a', lineHeight: 1.6, margin: '0 0 6px' },
  alertHindi: { fontSize: '13px', color: '#64748b', lineHeight: 1.7, margin: '0 0 8px' },
  alertTime: { fontSize: '11px', color: '#cbd5e1', margin: 0 }
};

export default Dashboard;