import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function AddMedication() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    elderId: '',
    medicineName: '',
    dosage: '',
    scheduledTime: '',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.elderId || !form.medicineName || !form.dosage || !form.scheduledTime) {
      setError('All fields are required.');
      return;
    }
    setError(''); setLoading(true);
    try {
      await API.post('/medications/add', form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <i style={s.navIcon}>🛡️</i>
          <span style={s.navBrand}>Suraksha<span style={{ color: '#d97706' }}>Digi</span></span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={s.backBtn}>
          ← Back to dashboard
        </button>
      </nav>

      <div style={s.body}>

        {/* HEADER */}
        <div style={s.header}>
          <p style={s.headerSub}>Medication schedule</p>
          <h1 style={s.headerTitle}>Add a new medication</h1>
          <p style={s.headerDesc}>Schedule a daily medicine reminder for your elder.</p>
        </div>

        {/* FORM CARD */}
        <div style={s.card}>

          {success && (
            <div style={s.successBox}>
              ✅ Medication added successfully! Redirecting...
            </div>
          )}

          {error && (
            <div style={s.errorBox}>{error}</div>
          )}

          <div style={s.field}>
            <label style={s.label}>Elder ID</label>
            <input
              name="elderId"
              value={form.elderId}
              onChange={handleChange}
              placeholder="Paste the elder's ID here"
              style={s.input}
              autoComplete="off"
            />
            <p style={s.hint}>You can find the elder ID from your MongoDB Atlas or elder profile.</p>
          </div>

          <div style={s.field}>
            <label style={s.label}>Medicine name</label>
            <input
              name="medicineName"
              value={form.medicineName}
              onChange={handleChange}
              placeholder="e.g. Paracetamol, Metformin"
              style={s.input}
              autoComplete="off"
            />
          </div>

          <div style={s.row}>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Dosage</label>
              <input
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                placeholder="e.g. 500mg, 1 tablet"
                style={s.input}
                autoComplete="off"
              />
            </div>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Scheduled time</label>
              <input
                name="scheduledTime"
                value={form.scheduledTime}
                onChange={handleChange}
                type="time"
                style={s.input}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Frequency</label>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              style={s.select}
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Adding medication...' : 'Add medication →'}
          </button>

        </div>
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
  backBtn: { padding: '7px 14px', background: 'transparent', border: '0.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer' },
  body: { maxWidth: '560px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '28px' },
  headerSub: { fontSize: '12px', color: '#d97706', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px' },
  headerTitle: { fontSize: '24px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 6px' },
  headerDesc: { fontSize: '14px', color: '#64748b', margin: 0 },
  card: { background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: '16px', padding: '28px' },
  successBox: { background: '#f0fdf4', border: '0.5px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 500, marginBottom: '20px' },
  errorBox: { background: '#fef2f2', border: '0.5px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px' },
  field: { marginBottom: '18px' },
  row: { display: 'flex', gap: '16px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '7px' },
  input: { width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '0.5px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', height: '42px', padding: '0 14px', borderRadius: '8px', border: '0.5px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' },
  hint: { fontSize: '11px', color: '#94a3b8', margin: '6px 0 0' },
  submitBtn: { width: '100%', height: '44px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.2px', marginTop: '8px' },
};

export default AddMedication;