import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Search() {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState([]);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/claims?status=all&limit=100')
      .then(res => {
        const data = res.data.claims || res.data;
        const arr = Array.isArray(data) ? data : [];
        setAll(arr);
        setResults(arr);
      })
      .catch(() => {
        setAll([]);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    const q = query.toLowerCase().trim();
    let filtered = q
      ? all.filter(c =>
          (c.title || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
        )
      : all;
    if (filter !== 'all') {
      filtered = filtered.filter(c => (c.verdict || 'pending') === filter);
    }
    setResults(filtered);
    setSearched(true);
  };

  const handleFilter = (f) => {
    setFilter(f);
    const q = query.toLowerCase().trim();
    let filtered = q
      ? all.filter(c =>
          (c.title || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
        )
      : all;
    if (f !== 'all') {
      filtered = filtered.filter(c => (c.verdict || 'pending') === f);
    }
    setResults(filtered);
  };

  const getVerdict = (v) => {
    if (v === 'TRUE')  return { label: 'VERIFIED TRUE', cls: 'badge-green', color: '#00ff88' };
    if (v === 'FALSE') return { label: 'MARKED FALSE',  cls: 'badge-red',   color: '#ff3366' };
    if (v === 'UNVERIFIED') return { label: 'UNVERIFIED', cls: 'badge-yellow', color: '#ffd700' };
    return { label: 'PENDING', cls: 'badge-yellow', color: '#ffd700' };
  };

  const displayList = results;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        .sp-wrap { padding: 2rem; max-width: 1200px; margin: 0 auto; }

        .sp-hero { margin-bottom: 2rem; }
        .sp-title { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700;
          color: var(--accent, #00f5ff); text-transform: uppercase; letter-spacing: 0.1em;
          border-left: 3px solid var(--accent, #00f5ff); padding-left: 0.75rem; margin-bottom: 0.4rem; }
        .sp-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem;
          color: var(--text-muted, #64748b); margin-bottom: 1.5rem; padding-left: 1rem; }

        .sp-bar { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
        .sp-input { flex: 1; background: rgba(0,0,0,0.35); border: 1px solid rgba(36,48,85,0.9);
          border-radius: 10px; padding: 0.85rem 1.1rem; color: var(--text, #e2e8f0);
          font-family: 'Share Tech Mono', monospace; font-size: 0.88rem; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; }
        .sp-input:focus { border-color: rgba(0,245,255,0.5); box-shadow: 0 0 0 3px rgba(0,245,255,0.07); }
        .sp-input::placeholder { color: rgba(100,116,139,0.4); }
        .sp-btn { background: linear-gradient(135deg,#00f5ff,#0088bb); border: none; border-radius: 10px;
          padding: 0.85rem 1.6rem; color: #000; font-family: 'Orbitron', monospace; font-size: 0.72rem;
          font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .sp-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(0,245,255,0.35); }

        .sp-filters { display: flex; gap: 0.5rem; margin-bottom: 1.8rem; flex-wrap: wrap; }
        .sp-filter { background: transparent; border: 1px solid rgba(36,48,85,0.9); border-radius: 6px;
          padding: 0.35rem 0.9rem; color: var(--text-muted, #64748b); font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s; }
        .sp-filter:hover { border-color: rgba(0,245,255,0.4); color: #00f5ff; }
        .sp-filter.active-all   { border-color: #00f5ff; color: #00f5ff; background: rgba(0,245,255,0.07); }
        .sp-filter.active-true  { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.07); }
        .sp-filter.active-false { border-color: #ff3366; color: #ff3366; background: rgba(255,51,102,0.07); }
        .sp-filter.active-pending { border-color: #ffd700; color: #ffd700; background: rgba(255,215,0,0.07); }

        .sp-count { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem;
          color: var(--text-muted, #64748b); margin-bottom: 1rem; }
        .sp-count span { color: #00f5ff; }

        .sp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }

        .sp-card { background: var(--surface, rgba(15,22,41,0.95)); border: 1px solid rgba(26,39,68,0.8);
          border-radius: 14px; padding: 1.3rem; transition: border-color 0.2s, transform 0.2s;
          position: relative; overflow: hidden; }
        .sp-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
        .sp-card.v-true::before  { background: linear-gradient(90deg, transparent, #00ff88, transparent); }
        .sp-card.v-false::before { background: linear-gradient(90deg, transparent, #ff3366, transparent); }
        .sp-card.v-pending::before { background: linear-gradient(90deg, transparent, #ffd700, transparent); }
        .sp-card:hover { border-color: rgba(0,245,255,0.25); transform: translateY(-2px); }

        .sp-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
        .sp-badge { display: inline-flex; align-items: center; padding: 0.2rem 0.6rem; border-radius: 4px;
          font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.06em; }
        .sp-badge.g { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.25); }
        .sp-badge.r { background: rgba(255,51,102,0.1); color: #ff3366; border: 1px solid rgba(255,51,102,0.25); }
        .sp-badge.y { background: rgba(255,215,0,0.1);  color: #ffd700; border: 1px solid rgba(255,215,0,0.25); }
        .sp-id { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; color: rgba(100,116,139,0.5); }

        .sp-card-title { font-family: 'Orbitron', monospace; font-size: 0.82rem; font-weight: 700;
          color: var(--text, #e2e8f0); margin-bottom: 0.5rem; line-height: 1.4; }
        .sp-card-desc { font-size: 0.8rem; color: var(--text-muted, #64748b); line-height: 1.6;
          margin-bottom: 0.9rem; }

        .sp-vbar { height: 5px; background: rgba(26,39,68,0.8); border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem; }
        .sp-vfill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #00ff88, #00f5ff); transition: width 0.4s; }
        .sp-vstats { display: flex; justify-content: space-between; font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem; margin-bottom: 0.9rem; }

        .sp-card-foot { display: flex; align-items: center; justify-content: space-between; }
        .sp-date { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(100,116,139,0.5); }
        .sp-vote-btn { background: transparent; border: 1px solid rgba(36,48,85,0.9); border-radius: 6px;
          padding: 0.3rem 0.8rem; color: var(--text-muted, #64748b); font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem; cursor: pointer; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .sp-vote-btn:hover { border-color: #00f5ff; color: #00f5ff; }

        .sp-empty { text-align: center; padding: 4rem 2rem; }
        .sp-empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .sp-empty-title { font-family: 'Orbitron', monospace; font-size: 1rem; color: var(--text, #e2e8f0); margin-bottom: 0.5rem; }
        .sp-empty-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: var(--text-muted, #64748b); }

        .sp-loading { display: flex; align-items: center; justify-content: center; height: 200px;
          font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; color: #00f5ff; gap: 0.75rem; }
        .sp-spin { width: 18px; height: 18px; border: 2px solid rgba(0,245,255,0.2);
          border-top-color: #00f5ff; border-radius: 50%; animation: spspin 0.7s linear infinite; }
        @keyframes spspin { to { transform: rotate(360deg); } }

        /* light theme */
        [data-theme="light"] .sp-input { background: rgba(240,244,255,0.9); border-color: rgba(203,213,225,0.9); color: #1e293b; }
        [data-theme="light"] .sp-input:focus { border-color: rgba(0,119,170,0.5); box-shadow: 0 0 0 3px rgba(0,119,170,0.08); }
        [data-theme="light"] .sp-btn { background: linear-gradient(135deg,#0077aa,#005580); color: #fff; }
        [data-theme="light"] .sp-filter { border-color: rgba(203,213,225,0.9); color: #64748b; }
        [data-theme="light"] .sp-filter:hover { border-color: rgba(0,119,170,0.5); color: #0077aa; }
        [data-theme="light"] .sp-filter.active-all { border-color: #0077aa; color: #0077aa; background: rgba(0,119,170,0.07); }
        [data-theme="light"] .sp-card { background: rgba(255,255,255,0.97); border-color: rgba(203,213,225,0.8); }
        [data-theme="light"] .sp-card:hover { border-color: rgba(0,119,170,0.3); }
        [data-theme="light"] .sp-card-title { color: #1e293b; }
        [data-theme="light"] .sp-vbar { background: rgba(203,213,225,0.8); }
        [data-theme="light"] .sp-vote-btn { border-color: rgba(203,213,225,0.9); color: #64748b; }
        [data-theme="light"] .sp-vote-btn:hover { border-color: #0077aa; color: #0077aa; }
        [data-theme="light"] .sp-count span { color: #0077aa; }
      `}</style>

      <div className="sp-wrap">
        <div className="sp-hero">
          <div className="sp-title">Search Claims</div>
          <div className="sp-sub">// search the blockchain-verified claim database</div>

          <div className="sp-bar">
            <input
              className="sp-input"
              type="text"
              placeholder="Search claims, rumors, news..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="sp-btn" onClick={handleSearch}>🔍 SEARCH</button>
          </div>

          <div className="sp-filters">
            {[
              { key: 'all',     label: '⬡ ALL' },
              { key: 'TRUE',    label: '✓ VERIFIED TRUE' },
              { key: 'FALSE',   label: '✗ MARKED FALSE' },
              { key: 'UNVERIFIED', label: '◎ PENDING' },
            ].map(f => (
              <button
                key={f.key}
                className={`sp-filter ${filter === f.key ? f.key === 'TRUE' ? 'active-true' : f.key === 'FALSE' ? 'active-false' : f.key === 'UNVERIFIED' ? 'active-pending' : 'active-all' : ''}`}
                onClick={() => handleFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="sp-loading">
            <div className="sp-spin" />
            SCANNING BLOCKCHAIN...
          </div>
        ) : displayList.length === 0 ? (
          <div className="sp-empty">
            <span className="sp-empty-icon">🔍</span>
            <div className="sp-empty-title">No Results Found</div>
            <div className="sp-empty-sub" style={{ marginBottom: '1.5rem' }}>
              {searched ? `No claims match "${query}"` : 'No claims in the database yet'}
            </div>
            <Link to="/submit" className="sp-btn" style={{ textDecoration: 'none', display: 'inline-block', padding: '0.7rem 1.4rem' }}>
              📝 Submit a Claim
            </Link>
          </div>
        ) : (
          <>
            <div className="sp-count">
              Showing <span>{displayList.length}</span> claim{displayList.length !== 1 ? 's' : ''}
              {searched && query && <> for "<span>{query}</span>"</>}
            </div>
            <div className="sp-grid">
              {displayList.map(claim => {
                const verdict = claim.verdict || 'pending';
                const v = getVerdict(verdict);
                const total = ((claim.votes?.true || 0)) + ((claim.votes?.false || 0));
                const pct = total > 0 ? Math.round(((claim.votes?.true || 0)) / total * 100) : 50;
                const vClass = verdict === 'TRUE' ? 'v-true' : verdict === 'FALSE' ? 'v-false' : 'v-pending';
                const badgeCls = verdict === 'TRUE' ? 'g' : verdict === 'FALSE' ? 'r' : 'y';
                return (
                  <div key={claim._id} className={`sp-card ${vClass}`}>
                    <div className="sp-card-top">
                      <span className={`sp-badge ${badgeCls}`}>{v.label}</span>
                      <span className="sp-id">#{(claim._id || '').slice(-6)}</span>
                    </div>
                    <div className="sp-card-title">{claim.title}</div>
                    <div className="sp-card-desc">
                      {(claim.description || '').slice(0, 110)}{(claim.description || '').length > 110 ? '...' : ''}
                    </div>
                    <div className="sp-vbar">
                      <div className="sp-vfill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="sp-vstats">
                      <span style={{ color: '#00ff88' }}>👍 {(claim.votes?.true || 0)} true</span>
                      <span style={{ color: '#ff3366' }}>👎 {(claim.votes?.false || 0)} false</span>
                    </div>
                    <div className="sp-card-foot">
                      <span className="sp-date">{new Date(claim.createdAt || Date.now()).toLocaleDateString()}</span>
                      <Link to={`/vote/${claim._id}`} className="sp-vote-btn">Vote →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}





