import React, { useEffect, useState } from 'react';
import { login } from '../api/authApi';
import { getToken } from '../auth/token';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // Track auth status in state so we don't redirect during the render phase
  const [isAuthed, setIsAuthed] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (isAuthed) {
      // Use replace() to avoid leaving the login page in history
      window.location.replace('/');
    }
  }, [isAuthed]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(username, password); // stores token on success
      setIsAuthed(true);               // trigger redirect via effect
    } catch (error) {
      console.error(error);
      setErr('Invalid username or password');
      setPassword('');                 // optional: clear only the password
    } finally {
      setLoading(false);
    }
  }

  // If we’re authenticated, render nothing while the effect navigates
  if (isAuthed) return null;

  return (
    <div className="d-flex justify-content-center align-items-center pt-5">
      <div className="card shadow p-4" style={{ minWidth: '350px' }}>
        <h2 className="text-center mb-4">Sign In</h2>

        {err && (
          <div className="alert alert-danger text-center" role="alert">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
