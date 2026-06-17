import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/family/login', { phone, password });
      login(res.data.token, res.data.family);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>🛡️ Preventive Safety System</div>
        <h1 style={styles.logo}>Suraksha<span style={{ color: '#D4820A' }}>Digi</span></h1>
        <p style={styles.subtitle}>Sign in to monitor your family's safety</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>Protecting elders, one alert at a time 🙏</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FAF6F0 0%, #FEF3DC 100%)',
    padding: '20px'
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 12px 40px rgba(26,18,8,0.1)',
    border: '1px solid rgba(212,130,10,0.15)'
  },
  badge: {
    display: 'inline-block',
    background: '#FEF3DC',
    color: '#D4820A',
    fontSize: '11px',
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: '100px',
    marginBottom: '20px',
    letterSpacing: '0.5px'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1A1208',
    marginBottom: '6px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#8C7B6B',
    marginBottom: '28px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#4A4035',
    marginBottom: '6px',
    marginTop: '16px'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid rgba(212,130,10,0.2)',
    outline: 'none',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '13px',
    background: '#1D6B6B',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '24px',
    cursor: 'pointer'
  },
  error: {
    background: '#FDECEA',
    color: '#C84B3C',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px'
  },
  footer: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#8C7B6B',
    marginTop: '24px'
  }
};

export default Login;