import { useState, useEffect } from 'react';
import API from '../api/axios';

// Fetches the elders belonging to the currently authenticated family.
// Deliberately does NOT cache/persist across mounts (no localStorage, no
// module-level state) — every mount does a fresh request using whatever
// token is currently in localStorage, so switching accounts can never
// leak a previous family's elder list.
export function useFamilyElders() {
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchElders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await API.get('/family/elders');
        if (!cancelled) setElders(res.data.elders || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load elders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchElders();
    return () => { cancelled = true; };
  }, []);

  return { elders, loading, error };
}
