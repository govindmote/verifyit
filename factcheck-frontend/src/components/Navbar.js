import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const logout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    
    { path: '/', label: '🏠 Home' },
    { path: '/submit', label: '📝 Submit' },
    { path: '/vote', label: '🗳️ Vote' },
    { path: '/verdict', label: '⚖️ Verdicts' },
    { path: '/search', label: '🔍 Search' },
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/explorer', label: '⛓ Explorer' },
    { path: '/admin', label: '⚙ Admin' },
  ];
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  return (
    <>
      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: var(--nav-bg);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--nav-border);
          padding: 0 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          height: 58px;
          transition: background 0.3s, border-color 0.3s;
        }
        .nav-brand {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: 'Orbitron', monospace;
          font-size: 1.05rem; font-weight: 700;
          color: var(--accent);
          text-decoration: none;
        }
        .nav-brand-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem; color: var(--text-muted);
          border: 1px solid var(--border2);
          border-radius: 4px; padding: 2px 6px;
          letter-spacing: 0.1em;
        }
        .nav-links { display: flex; align-items: center; gap: 0.25rem; }
        .nav-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem; font-weight: 500;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          text-decoration: none;
          color: var(--text-muted);
          transition: all 0.2s;
          letter-spacing: 0.03em;
        }
        .nav-link:hover { color: var(--accent); background: var(--nav-hover); }
        .nav-link.active {
          color: var(--accent);
          background: var(--nav-active);
          border: 1px solid rgba(0,245,255,0.15);
        }
        .nav-right { display: flex; align-items: center; gap: 0.6rem; }
        .theme-btn {
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border2);
          background: var(--surface);
          color: var(--text);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .theme-btn:hover { border-color: var(--accent); transform: rotate(20deg); }
        .nav-user {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; color: var(--text-muted);
        }
        .nav-user-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--green);
          animation: navPulse 2s ease infinite;
        }
        @keyframes navPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .nav-profile-btn {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          background: transparent;
          border: 1px solid rgba(0,245,255,0.35);
          color: #00f5ff;
          border-radius: 6px;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .nav-profile-btn:hover { background: rgba(0,245,255,0.08); border-color: #00f5ff; }
        .nav-logout {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          background: transparent;
          border: 1px solid var(--border2);
          color: var(--text-muted);
          border-radius: 6px;
          padding: 0.35rem 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-logout:hover { border-color: var(--red); color: var(--red); }
        @media (max-width: 768px) { .nav-links { display: none; } }
      `}</style>

      <nav className="navbar">
        <Link to="/" className="nav-brand">
          🔎 VerifyIt
          <span className="nav-brand-badge">BLOCKCHAIN FACT-CHECKER</span>
        </Link>

        <div className="nav-links">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className={`nav-link ${isActive(path) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <div className="nav-user">
                <div className="nav-user-dot" />
                {user.username}
              </div>
              <Link to="/profile" className="nav-profile-btn">👤 Profile</Link>
              <button className="nav-logout" onClick={() => setShowLogoutModal(true)}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {showLogoutModal && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(6px)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{background:'var(--surface,#0f1629)',border:'1px solid rgba(255,51,102,0.3)',borderRadius:'16px',padding:'2rem',width:'340px',textAlign:'center',fontFamily:"'Share Tech Mono',monospace",position:'relative'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔒</div>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:'0.95rem',color:'#ff3366',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>LOGOUT SESSION</div>
              <div style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'1.8rem',lineHeight:1.6}}>Do you want to logout your current session?<br/>Your votes are permanently recorded on-chain.</div>
              <div style={{display:'flex',gap:'0.75rem'}}>
                <button onClick={() => setShowLogoutModal(false)} style={{flex:1,padding:'0.7rem',background:'transparent',border:'1px solid rgba(36,48,85,0.9)',borderRadius:'8px',color:'#64748b',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',cursor:'pointer'}}>NO, STAY</button>
                <button onClick={logout} style={{flex:1,padding:'0.7rem',background:'linear-gradient(135deg,#ff3366,#aa0033)',border:'none',borderRadius:'8px',color:'#fff',fontFamily:"'Orbitron',monospace",fontSize:'0.68rem',fontWeight:'700',letterSpacing:'0.08em',cursor:'pointer'}}>YES, LOGOUT</button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
