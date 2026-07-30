import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function AddElder() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('hindi');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [elderId, setElderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await API.post('/elders/register', { name, phone, age: Number(age), language, password });
      setElderId(res.data.elder.id);
      setSuccess(`Elder registered successfully!`);
      setName(''); setPhone(''); setAge(''); setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register elder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.navLogo}>🛡️</span>
          <span style={s.navBrand}>Suraksha<span style={{ color: '#f5a623' }}>Digi</span></span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={s.backBtn}>← Back to dashboard</button>
      </div>

      <div style={s.wrap}>
        <div style={s.header}>
          <h1 style={s.title}>Add a new elder</h1>
          <p style={s.sub}>Register an elder under your care to start monitoring their safety</p>
        </div>

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}

          {success && (
            <div style={s.successBox}>
              <div style={s.successTitle}>✅ {success}</div>
              <div style={s.successSub}>Copy the Elder ID below — you'll need it to fetch alerts on the dashboard.</div>
              <div style={s.idBox}>
                <span style={s.idLabel}>Elder ID</span>
                <span style={s.idValue}>{elderId}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Suresh Sharma" autoComplete="off" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Phone Number</label>
              <input style={s.input} type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" autoComplete="off" required />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, ...s.field }}>
                <label style={s.label}>Age</label>
                <input style={s.input} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 68" required />
              </div>
              <div style={{ flex: 1, ...s.field }}>
                <label style={s.label}>Preferred Language</label>
                <select style={s.input} value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value="hindi">Hindi</option>
                  <option value="english">English</option>
                </select>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Set a Password</label>
              <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Elder will use this to log in" autoComplete="new-password" required />
            </div>
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Elder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f0f4f8', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  nav: { background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  navLogo: { fontSize: '20px' },
  navBrand: { fontSize: '17px', fontWeight: 700, color: '#0a1628', letterSpacing: '-0.3px' },
  backBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', color: '#666' },
  wrap: { maxWidth: '580px', margin: '0 auto', padding: '36px 20px' },
  header: { marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: 700, color: '#0a1628', letterSpacing: '-0.4px' },
  sub: { fontSize: '13px', color: '#888', marginTop: '5px' },
  card: { background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e8e8e8' },
  error: { background: '#fff0f0', color: '#e53935', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  successTitle: { fontSize: '14px', fontWeight: 600, color: '#166534' },
  successSub: { fontSize: '12px', color: '#166534', marginTop: '4px', opacity: 0.8 },
  idBox: { marginTop: '12px', background: '#fff', border: '1px solid #d1fae5', borderRadius: '8px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px' },
  idLabel: { fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' },
  idValue: { fontSize: '13px', fontWeight: 600, color: '#0a1628', wordBreak: 'break-all', fontFamily: 'monospace' },
  field: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '6px', letterSpacing: '0.4px', textTransform: 'uppercase' },
  input: { width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#fafafa', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0a1628' },
  btn: { width: '100%', height: '42px', background: '#0a1628', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' },
};

export default AddElder;