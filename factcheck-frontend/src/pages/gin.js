import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.username || !form.password) {
      setMsg({ type: 'error', text: 'Username and password are required' });
      return;
    }
    setLoading(true);
    setMsg(null);

    // Simulate auth (replace with real API call when backend auth is ready)
    setTimeout(() => {
      const userData = {
        username: form.username,
        email: form.email || `${form.username}@verifyit.io`,
        token: 'demo_token_' + Date.now(),
        joinedAt: new Date().toISOString(),
      };
      login(userData);
      setMsg({ type: 'success', text: `Welcome, ${form.username}! Redirecting...` });
      setTimeout(() => navigate('/'), 1000);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{textAlign:'center', marginBottom:'1.5rem'}}>
          <div style={{fontSize:'2.5rem', marginBottom:'0.5rem'}}>🔎</div>
          <h1 className="auth-title">VerifyIt</h1>
          <p className="auth-sub">{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="input" name="username" placeholder="your_username" value={form.username} onChange={handle} />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />
        </div>

        <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={submit} disabled={loading}>
          {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Sign In' : '🚀 Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Don't have an account? <a onClick={() => { setMode('register'); setMsg(null); }}>Register</a></>
          ) : (
            <>Already have an account? <a onClick={() => { setMode('login'); setMsg(null); }}>Sign In</a></>
          )}
        </div>

        <div style={{
          marginTop:'1.5rem', padding:'0.75rem',
          background:'var(--bg2)', borderRadius:'var(--radius)',
          border:'1px solid var(--border)',
          fontFamily:"'Share Tech Mono',monospace", fontSize:'0.68rem', color:'var(--text-dim)',
          textAlign:'center'
        }}>
          🔒 Secured by Polygon Amoy Testnet · Decentralized Identity
        </div>
      </div>
    </div>
  );
}