import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../utils/auth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetch('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          setToken(null);
          navigate('/login', { replace: true });
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {
        setToken(null);
        navigate('/login', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    setToken(null);
    navigate('/login', { replace: true });
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-slate-100 mb-6">Profile</h1>
        <div className="space-y-3 rounded-lg bg-slate-800/80 border border-slate-700 p-4">
          <p className="text-slate-300">
            <span className="font-medium text-slate-400">Name:</span>{' '}
            <span className="text-slate-100">{user.name}</span>
          </p>
          <p className="text-slate-300">
            <span className="font-medium text-slate-400">Email:</span>{' '}
            <span className="text-slate-100">{user.email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
