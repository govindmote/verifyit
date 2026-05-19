import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AnimatedCounter({ target, duration = 1500, color }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) { setCount(target); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span style={{ color }}>{count}</span>;
}

export default function Home() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, verified: 0, fake: 0, pending: 0, onChain: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/claims?status=all&limit=100')
      .then(res => {
        const data = res.data.claims || res.data;
        const list = Array.isArray(data) ? data : [];
        setClaims(list);
        setStats({
          total: list.length,
          verified: list.filter(c => String(c.verdict||'').toUpperCase() === 'TRUE').length,
          fake: list.filter(c => String(c.verdict||'').toUpperCase() === 'FALSE').length,
          pending: list.filter(c => !c.verdict).length,
          onChain: list.filter(c => c.blockchain?.txHash && c.blockchain.txHash !== 'already-recorded').length,
        });
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  const getVerdict = (v) => {
    const val = String(v || '').toUpperCase();
    if (val === 'TRUE')       return { label: '✅ VERIFIED TRUE',  cls: 'badge-green' };
    if (val === 'FALSE')      return { label: '❌ MARKED FALSE',   cls: 'badge-red' };
    if (val === 'UNVERIFIED') return { label: '⚠️ UNVERIFIED',    cls: 'badge-yellow' };
    return                           { label: '⏳ PENDING',        cls: 'badge-yellow' };
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .hm-hero{text-align:center;padding:4rem 2rem 2rem;position:relative;}
    .hm-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(0,245,255,0.06) 0%,transparent 70%);pointer-events:none;}
    .hm-badge{display:inline-flex;align-items:center;gap:0.5rem;padding:0.3rem 1rem;background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.15);border-radius:20px;font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:#00f5ff;letter-spacing:0.15em;margin-bottom:1.5rem;}
    .hm-badge-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;animation:hmpulse 2s infinite;}
    @keyframes hmpulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
    .hm-title{font-family:'Orbitron',monospace;font-size:3.5rem;font-weight:900;background:linear-gradient(135deg,#00f5ff,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1rem;letter-spacing:0.05em;}
    .hm-sub{font-family:'Exo 2',sans-serif;font-size:1rem;color:rgba(100,116,139,0.8);max-width:600px;margin:0 auto 2rem;line-height:1.7;}
    .hm-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:3rem;}
    .hm-btn-primary{padding:0.75rem 1.8rem;background:linear-gradient(135deg,#00f5ff,#0088bb);border:none;border-radius:10px;color:#000;font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;cursor:pointer;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;}
    .hm-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,245,255,0.3);}
    .hm-btn-outline{padding:0.75rem 1.8rem;background:transparent;border:1px solid rgba(0,245,255,0.3);border-radius:10px;color:#00f5ff;font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;cursor:pointer;text-decoration:none;transition:all 0.2s;}
    .hm-btn-outline:hover{background:rgba(0,245,255,0.06);border-color:#00f5ff;}
    .hm-btn-purple{padding:0.75rem 1.8rem;background:linear-gradient(135deg,#7c3aed,#4c1d95);border:none;border-radius:10px;color:#fff;font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:0.08em;cursor:pointer;text-decoration:none;transition:transform 0.2s;}
    .hm-btn-purple:hover{transform:translateY(-2px);}

    .hm-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:1rem;max-width:1100px;margin:0 auto 3rem;padding:0 2rem;}
    .hm-stat{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;padding:1.5rem;text-align:center;position:relative;overflow:hidden;transition:transform 0.2s,border-color 0.2s;}
    .hm-stat:hover{transform:translateY(-3px);border-color:rgba(0,245,255,0.2);}
    .hm-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .hm-stat:nth-child(1)::before{background:linear-gradient(90deg,transparent,#00f5ff,transparent);}
    .hm-stat:nth-child(2)::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .hm-stat:nth-child(3)::before{background:linear-gradient(90deg,transparent,#ff3366,transparent);}
    .hm-stat:nth-child(4)::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .hm-stat:nth-child(5)::before{background:linear-gradient(90deg,transparent,#a78bfa,transparent);}
    .hm-stat-icon{font-size:1.8rem;margin-bottom:0.5rem;}
    .hm-stat-val{font-family:'Orbitron',monospace;font-size:2rem;font-weight:900;margin-bottom:0.3rem;display:block;}
    .hm-stat-label{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.6);letter-spacing:0.1em;}

    .hm-section{max-width:1100px;margin:0 auto;padding:0 2rem 3rem;}
    .hm-section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;}
    .hm-section-title{font-family:'Orbitron',monospace;font-size:0.9rem;color:#00f5ff;letter-spacing:0.1em;}
    .hm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
    .hm-card{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:transform 0.2s,border-color 0.2s;}
    .hm-card:hover{transform:translateY(-3px);border-color:rgba(0,245,255,0.15);}
    .hm-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .hm-card.v-true::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .hm-card.v-false::before{background:linear-gradient(90deg,transparent,#ff3366,transparent);}
    .hm-card.v-pending::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .hm-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;}
    .hm-card-id{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.4);}
    .hm-card-title{font-family:'Exo 2',sans-serif;font-size:0.88rem;font-weight:600;color:var(--text,#e2e8f0);margin-bottom:0.5rem;line-height:1.4;}
    .hm-card-desc{font-family:'Exo 2',sans-serif;font-size:0.75rem;color:rgba(100,116,139,0.7);margin-bottom:0.75rem;line-height:1.5;}
    .hm-bar{height:4px;background:rgba(26,39,68,0.9);border-radius:2px;overflow:hidden;margin-bottom:0.5rem;}
    .hm-bar-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#00ff88,#00f5ff);}
    .hm-vote-stats{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:0.62rem;margin-bottom:0.75rem;}
    .hm-chain{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:rgba(100,116,139,0.35);margin-bottom:0.75rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .hm-card-ftr{display:flex;align-items:center;justify-content:space-between;}
    .hm-card-date{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.4);}
    .hm-vote-btn{padding:0.35rem 0.9rem;background:transparent;border:1px solid rgba(0,245,255,0.25);border-radius:6px;color:#00f5ff;font-family:'Share Tech Mono',monospace;font-size:0.65rem;cursor:pointer;text-decoration:none;transition:all 0.2s;}
    .hm-vote-btn:hover{background:rgba(0,245,255,0.08);border-color:#00f5ff;}
    .hm-loading{text-align:center;padding:3rem;font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;}
    .hm-empty{text-align:center;padding:3rem;font-family:'Share Tech Mono',monospace;font-size:0.75rem;color:rgba(100,116,139,0.5);}

    [data-theme="light"] .hm-stat,[data-theme="light"] .hm-card{background:#ffffff;border-color:rgba(0,0,0,0.1);}
    [data-theme="light"] .hm-card-title{color:#1e293b;}
    [data-theme="light"] .hm-card-desc{color:#64748b;}
    [data-theme="light"] .hm-stat-label{color:#475569;}
    [data-theme="light"] .hm-bar{background:rgba(0,0,0,0.08);}
    [data-theme="light"] .hm-hero::before{background:radial-gradient(ellipse at 50% 0%,rgba(3,105,161,0.06) 0%,transparent 70%);}
  `;

  return (
    <><style>{css}</style>
    <div>
      <div className="hm-hero">
        <div className="hm-badge"><span className="hm-badge-dot"/>LIVE ON POLYGON AMOY TESTNET</div>
        <div className="hm-title">VerifyIt</div>
        <div className="hm-sub">Decentralized Fact-Checking powered by community consensus and blockchain immutability. Every verdict is permanently recorded on Polygon Amoy.</div>
        <div className="hm-actions">
          <Link to="/submit" className="hm-btn-primary">&#128221; Submit a Claim</Link>
          <Link to="/vote" className="hm-btn-outline">&#128123; Vote on Claims</Link>
          <Link to="/dashboard" className="hm-btn-purple">&#128202; Dashboard</Link>
          <Link to="/howto" className="hm-btn-outline">&#10067; How It Works</Link>
        </div>
      </div>

      <div className="hm-stats">
        <div className="hm-stat">
          <div className="hm-stat-icon">&#128196;</div>
          <span className="hm-stat-val"><AnimatedCounter target={stats.total} color="#00f5ff"/></span>
          <div className="hm-stat-label">Total Claims</div>
        </div>
        <div className="hm-stat">
          <div className="hm-stat-icon">&#9989;</div>
          <span className="hm-stat-val"><AnimatedCounter target={stats.verified} color="#00ff88"/></span>
          <div className="hm-stat-label">Verified True</div>
        </div>
        <div className="hm-stat">
          <div className="hm-stat-icon">&#10060;</div>
          <span className="hm-stat-val"><AnimatedCounter target={stats.fake} color="#ff3366"/></span>
          <div className="hm-stat-label">Marked False</div>
        </div>
        <div className="hm-stat">
          <div className="hm-stat-icon">&#9203;</div>
          <span className="hm-stat-val"><AnimatedCounter target={stats.pending} color="#ffd700"/></span>
          <div className="hm-stat-label">Pending Vote</div>
        </div>
        <div className="hm-stat">
          <div className="hm-stat-icon">&#9935;</div>
          <span className="hm-stat-val"><AnimatedCounter target={stats.onChain} color="#a78bfa"/></span>
          <div className="hm-stat-label">On-Chain Records</div>
        </div>
      </div>

      <div className="hm-section">
        <div className="hm-section-hdr">
          <span className="hm-section-title">&#128248; RECENT CLAIMS</span>
          <Link to="/vote" className="hm-vote-btn">View All →</Link>
        </div>
        {loading ? (
          <div className="hm-loading">Fetching claims from chain...</div>
        ) : claims.length === 0 ? (
          <div className="hm-empty">No claims yet. <Link to="/submit" style={{color:"#00f5ff"}}>Submit one →</Link></div>
        ) : (
          <div className="hm-grid">
            {claims.slice(0,6).map(claim => {
              const v = getVerdict(claim.verdict);
              const tv = claim.votes?.true || 0;
              const fv = claim.votes?.false || 0;
              const total = tv + fv;
              const pct = total > 0 ? Math.round(tv/total*100) : 50;
              const vClass = String(claim.verdict||'').toUpperCase() === 'TRUE' ? 'v-true' : String(claim.verdict||'').toUpperCase() === 'FALSE' ? 'v-false' : 'v-pending';
              return (
                <div key={claim._id} className={`hm-card ${vClass}`}>
                  <div className="hm-card-hdr">
                    <span className={`badge ${v.cls}`}>{v.label}</span>
                    <span className="hm-card-id">#{(claim._id||'').slice(-6)}</span>
                  </div>
                  <div className="hm-card-title">{claim.title}</div>
                  <div className="hm-card-desc">{(claim.description||'').slice(0,90)}...</div>
                  <div className="hm-bar"><div className="hm-bar-fill" style={{width:`${pct}%`}}/></div>
                  <div className="hm-vote-stats">
                    <span style={{color:'#00ff88'}}>&#128077; {tv} True</span>
                    <span style={{color:'#ff3366'}}>&#128078; {fv} False</span>
                  </div>
                  <div className="hm-chain">
                    {claim.blockchain?.txHash && claim.blockchain.txHash !== 'already-recorded'
                      ? `⛓ ${claim.blockchain.txHash.slice(0,18)}...${claim.blockchain.txHash.slice(-6)}`
                      : '⛓ Pending on-chain recording'}
                  </div>
                  <div className="hm-card-ftr">
                    <span className="hm-card-date">{new Date(claim.createdAt||Date.now()).toLocaleDateString()}</span>
                    <Link to={`/vote/${claim._id}`} className="hm-vote-btn">Vote →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div></>
  );
}




