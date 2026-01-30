import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch {
        if (!cancelled) {
          setStatus('error');
          setMessage('Network error.');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-xl bg-slate-800/50 border border-slate-700 p-8 shadow-xl text-center">
        <h1 className="text-2xl font-semibold text-slate-100 mb-6">Verify email</h1>
        {status === 'loading' && (
          <p className="text-slate-400">Verifying your email...</p>
        )}
        {status === 'success' && (
          <>
            <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-cyan-600 px-4 py-2.5 font-medium text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Go to login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-slate-600 px-4 py-2.5 font-medium text-slate-200 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
