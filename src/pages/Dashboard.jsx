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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchAlerts = async () => {
    setError('');
    try {
      const res = await API.get(`/alerts/elder/${elderId}`);
      setAlerts(res.data.alerts);
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
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.logo}>Suraksha<span style={{ color: '#D4820A' }}>Digi</span></h1>
          <p style={styles.welcome}>Welcome, <strong>{family?.name}</strong> ({family?.phone})</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/add-elder')} style={styles.addBtn}>+ Add Elder</button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.searchCard}>
        <label style={styles.label}>View Elder's Alerts</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <input
            type="text"
            placeholder="Enter Elder ID"
            value={elderId}
            onChange={(e) => setElderId(e.target.value)}
            style={styles.input}
          />
          <button onClick={fetchAlerts} style={styles.fetchBtn}>Fetch Alerts</button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div>
        {alerts.length === 0 && <p style={styles.empty}>No alerts to show</p>}
        {alerts.map((alert) => (
          <div
            key={alert._id}
            style={{
              ...styles.alertCard,
              background: alert.severity === 'high' ? '#FDECEA' : '#FEF3DC',
              borderColor: alert.severity === 'high' ? '#C84B3C' : '#D4820A'
            }}
          >
            <div style={styles.alertHeader}>
              <span style={styles.alertType}>{alert.type.toUpperCase()}</span>
              <span style={styles.severity}>{alert.severity} severity</span>
            </div>
            <p style={styles.alertMsg}>{alert.message}</p>
            {alert.messageHindi && <p style={styles.alertMsgHindi}>{alert.messageHindi}</p>}
            <div style={styles.alertFooter}>
              <small style={styles.timestamp}>{new Date(alert.createdAt).toLocaleString()}</small>
              {alert.isResolved ? (
                <span style={styles.resolvedTag}>✅ Resolved</span>
              ) : (
                <button onClick={() => resolveAlert(alert._id)} style={styles.resolveBtn}>
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1A1208'
  },
  welcome: {
    fontSize: '13px',
    color: '#8C7B6B',
    marginTop: '4px'
  },
  logoutBtn: {
    padding: '9px 18px',
    background: 'transparent',
    border: '1.5px solid rgba(26,18,8,0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500
  },
  addBtn: {
    padding: '9px 18px',
    background: '#D4820A',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600
  },
  searchCard: {
    background: '#fff',
    border: '1px solid rgba(212,130,10,0.15)',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '24px'
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#4A4035'
  },
  input: {
    flex: 1,
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid rgba(212,130,10,0.2)',
    outline: 'none',
    fontSize: '14px'
  },
  fetchBtn: {
    padding: '11px 20px',
    background: '#1D6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px'
  },
  error: {
    background: '#FDECEA',
    color: '#C84B3C',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px'
  },
  empty: {
    textAlign: 'center',
    color: '#8C7B6B',
    fontSize: '14px',
    padding: '40px 0'
  },
  alertCard: {
    border: '1px solid',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '14px'
  },
  alertHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  alertType: {
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.5px'
  },
  severity: {
    fontSize: '12px',
    color: '#4A4035',
    fontWeight: 500,
    textTransform: 'capitalize'
  },
  alertMsg: {
    fontSize: '14px',
    color: '#1A1208',
    marginBottom: '6px',
    lineHeight: 1.5
  },
  alertMsgHindi: {
    fontSize: '14px',
    color: '#4A4035',
    marginBottom: '10px',
    lineHeight: 1.6
  },
  alertFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px'
  },
  timestamp: {
    color: '#8C7B6B',
    fontSize: '11px'
  },
  resolvedTag: {
    color: '#1D6B6B',
    fontSize: '12px',
    fontWeight: 600
  },
  resolveBtn: {
    padding: '6px 14px',
    background: '#1D6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default Dashboard;