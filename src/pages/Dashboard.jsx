import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { family, logout } = useAuth();
  const navigate = useNavigate();
  const [elderId, setElderId] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [fetched, setFetched] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const fetchAlerts = async () => {
    setError(''); setFetched(false);
    try {
      const res = await API.get(`/alerts/elder/${elderId}`);
      setAlerts(res.data.alerts);
      setFetched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      await API.put(`/alerts/resolve/${alertId}`);
      fetchAlerts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve alert');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.navLogo}>🛡️</span>
          <span style={s.navBrand}>Suraksha<span style={{ color: '#f5a623' }}>Digi</span></span>
        </div>
        <div style={s.navRight}>
          <div style={s.userPill}>
            <div style={s.avatar}>{family?.name?.[0]?.toUpperCase()}</div>
            <span style={s.userName}>{family?.name}</span>
          </div>
          <button onClick={() => navigate('/add-elder')} style={s.addBtn}>+ Add Elder</button>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={s.hero}>
        <div>
          <h1 style={s.heroTitle}>Good morning, {family?.name?.split(' ')[0]} 👋</h1>
          <p style={s.heroSub}>Monitor your elders' health alerts and stay informed in real time.</p>
        </div>
        <div style={s.heroBadge}>
          <span style={s.heroDot}></span> System active
        </div>
      </div>

      <div style={s.searchCard}>
        <div style={s.searchLabel}>
          <span style={s.searchIcon}>🔍</span>
          <div>
            <div style={s.searchTitle}>View elder alerts</div>
            <div style={s.searchSub}>Enter an elder ID to fetch their health alerts</div>
          </div>
        </div>
        <div style={s.searchRow}>
          <input
            type="text"
            placeholder="Paste Elder ID here (e.g. 6873fa2b...)"
            value={elderId}
            onChange={e => setElderId(e.target.value)}
            style={s.input}
            autoComplete="off"
          />
          <button onClick={fetchAlerts} style={s.fetchBtn}>Fetch Alerts</button>
        </div>
      </div>

      {error && <div style={s.error}>{error}</div>}

      {fetched && alerts.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>✅</div>
          <div style={s.emptyTitle}>No alerts found</div>
          <div style={s.emptySub}>This elder has no recorded alerts yet.</div>
        </div>
      )}

      {alerts.map(alert => (
        <div key={alert._id} style={{ ...s.alertCard, borderLeft: `4px solid ${alert.severity === 'high' ? '#e53935' : '#f5a623'}` }}>
          <div style={s.alertTop}>
            <div style={s.alertLeft}>
              <span style={{
                ...s.severityBadge,
                background: alert.severity === 'high' ? '#fff0f0' : '#fffbea',
                color: alert.severity === 'high' ? '#e53935' : '#f59e0b'
              }}>
                {alert.severity === 'high' ? '🔴' : '🟡'} {alert.severity} severity
              </span>
              <span style={s.alertType}>{alert.type?.toUpperCase()}</span>
            </div>
            {alert.isResolved
              ? <span style={s.resolvedTag}>✅ Resolved</span>
              : <button onClick={() => resolveAlert(alert._id)} style={s.resolveBtn}>Mark resolved</button>
            }
          </div>
          <p style={s.alertMsg}>{alert.message}</p>
          {alert.messageHindi && <p style={s.alertHindi}>{alert.messageHindi}</p>}
          <div style={s.alertTime}>{new Date(alert.createdAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  nav: { background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLogo: { fontSize: '20px' },
  navBrand: { fontSize: '17px', fontWeight: 700, color: '#0a1628', letterSpacing: '-0.3px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  userPill: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', padding: '6px 12px 6px 6px', borderRadius: '100px' },
  avatar: { width: '26px', height: '26px', background: '#0a1628', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 },
  userName: { fontSize: '13px', fontWeight: 500, color: '#0a1628' },
  addBtn: { padding: '8px 16px', background: '#0a1628', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#666' },
  hero: { padding: '32px 32px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  heroTitle: { fontSize: '24px', fontWeight: 700, color: '#0a1628', letterSpacing: '-0.4px' },
  heroSub: { fontSize: '13px', color: '#888', marginTop: '5px' },
  heroBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: '#e8f5e9', color: '#388e3c', fontSize: '12px', fontWeight: 500, padding: '6px 14px', borderRadius: '100px' },
  heroDot: { width: '7px', height: '7px', background: '#4caf50', borderRadius: '50%', display: 'inline-block' },
  searchCard: { margin: '20px 32px', background: '#fff', borderRadius: '14px', padding: '20px 24px', border: '1px solid #e8e8e8' },
  searchLabel: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  searchIcon: { fontSize: '20px' },
  searchTitle: { fontSize: '14px', fontWeight: 600, color: '#0a1628' },
  searchSub: { fontSize: '12px', color: '#999', marginTop: '2px' },
  searchRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#fafafa', fontSize: '13px', outline: 'none', color: '#0a1628' },
  fetchBtn: { height: '42px', padding: '0 20px', background: '#0a1628', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' },
  error: { margin: '0 32px 16px', background: '#fff0f0', color: '#e53935', padding: '12px 16px', borderRadius: '10px', fontSize: '13px' },
  empty: { margin: '40px auto', textAlign: 'center' },
  emptyIcon: { fontSize: '36px', marginBottom: '12px' },
  emptyTitle: { fontSize: '16px', fontWeight: 600, color: '#0a1628' },
  emptySub: { fontSize: '13px', color: '#999', marginTop: '4px' },
  alertCard: { margin: '0 32px 12px', background: '#fff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e8e8e8' },
  alertTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  alertLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  severityBadge: { fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '100px' },
  alertType: { fontSize: '11px', fontWeight: 600, color: '#999', letterSpacing: '0.5px' },
  resolvedTag: { fontSize: '12px', color: '#388e3c', fontWeight: 600 },
  resolveBtn: { padding: '6px 14px', background: '#0a1628', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  alertMsg: { fontSize: '14px', color: '#0a1628', lineHeight: 1.5, marginBottom: '6px' },
  alertHindi: { fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '8px' },
  alertTime: { fontSize: '11px', color: '#bbb' }
};

export default Dashboard;