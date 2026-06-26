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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await API.post('/elders/register', {
        name,
        phone,
        age: Number(age),
        language,
        password
      });

      setSuccess(`Elder registered! Elder ID: ${res.data.elder.id}`);
      setName('');
      setPhone('');
      setAge('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register elder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.logo}>Suraksha<span style={{ color: '#D4820A' }}>Digi</span></h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Add a New Elder</h2>
        <p style={styles.subtitle}>Register an elder under your care to start monitoring their safety</p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Suresh Sharma"
            style={styles.input}
            required
          />

          <label style={styles.label}>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            style={styles.input}
            required
          />

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 68"
                style={styles.input}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.input}
              >
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
              </select>
            </div>
          </div>

          <label style={styles.label}>Set a Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Elder will use this to log in"
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register Elder'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '600px',
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
  backBtn: {
    padding: '9px 16px',
    background: 'transparent',
    border: '1.5px solid rgba(26,18,8,0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(212,130,10,0.15)',
    borderRadius: '16px',
    padding: '32px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '6px'
  },
  subtitle: {
    fontSize: '13px',
    color: '#8C7B6B',
    marginBottom: '24px'
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
  success: {
    background: '#E0F4F1',
    color: '#1D6B6B',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px',
    wordBreak: 'break-all'
  }
};

export default AddElder;