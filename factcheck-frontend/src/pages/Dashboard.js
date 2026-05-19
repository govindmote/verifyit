import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/claims?status=all&limit=100')
      .then(res => {
        const data = res.data.claims || res.data;
        setClaims(Array.isArray(data) ? data : []);
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  const getTV = (c) => c.votes?.true || 0;
  const getFV = (c) => c.votes?.false || 0;

  const total = claims.length;
  const verified = claims.filter(c => c.verdict === 'TRUE').length;
  const fake = claims.filter(c => c.verdict === 'FALSE').length;
  const pending = claims.filter(c => !c.verdict || c.verdict === 'pending').length;
  const totalVotes = Math.round(claims.reduce((a, c) => a + getTV(c) + getFV(c), 0));
  const accuracy = total > 0 ? Math.round(((verified + fake) / total) * 100) : 0;

  const dashCards = [
    { value: total,        label: 'Total Claims',     color: 'var(--accent)', bg: 'linear-gradient(135deg,#00f5ff,#0099cc)' },
    { value: verified,     label: 'Verified True',    color: 'var(--green)',  bg: 'linear-gradient(135deg,#00ff88,#00aa55)' },
    { value: fake,         label: 'Marked Fake',      color: 'var(--red)',    bg: 'linear-gradient(135deg,#ff3366,#aa0033)' },
    { value: pending,      label: 'Awaiting Verdict', color: 'var(--yellow)', bg: 'linear-gradient(135deg,#ffd700,#cc8800)' },
    { value: totalVotes,   label: 'Total Votes Cast', color: '#a78bfa',       bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
    { value: accuracy+'%', label: 'Resolution Rate',  color: 'var(--accent)', bg: 'linear-gradient(135deg,#00f5ff,#7c3aed)' },
  ];

  const recentActivity = [...claims]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const topVoted = [...claims]
    .sort((a, b) => (getTV(b) + getFV(b)) - (getTV(a) + getFV(a)))
    .slice(0, 3);

  const getVerdictBadge = (v) => {
    if (v === 'TRUE') return <span className="badge badge-green">TRUE</span>;
    if (v === 'FALSE') return <span className="badge badge-red">FALSE</span>;
    if (v === 'UNVERIFIED') return <span className="badge badge-yellow">UNVERIFIED</span>;
    if (v === 'UNVERIFIED') return <span className="badge badge-yellow">UNVERIFIED</span>;
    return <span className="badge badge-yellow">PENDING</span>;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Dashboard</h2>
          <Link to="/submit" className="btn btn-primary btn-sm">+ New Claim</Link>
        </div>

        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'0.75rem 1.25rem',display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'1.5rem',flexWrap:'wrap',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem'}}>
          <span style={{color:'var(--green)'}}>● NETWORK LIVE</span>
          <span style={{color:'var(--text-muted)'}}>Chain: <span style={{color:'var(--accent)'}}>Polygon Amoy Testnet</span></span>
          <span style={{color:'var(--text-muted)'}}>Block: <span style={{color:'var(--accent)'}}>#49271834</span></span>
          <span style={{color:'var(--text-muted)'}}>Gas: <span style={{color:'var(--yellow)'}}>~0.001 POL</span></span>
          <span style={{color:'var(--text-muted)'}}>Contract: <span style={{color:'var(--text-muted)'}}>0x7f3a...e2c1</span></span>
        </div>

        <div className="dashboard-grid">
          {dashCards.map((c, i) => (
            <div key={i} className="dash-card">
              <div className="dash-card-accent" style={{background:c.bg}} />
              <div className="dash-card-value" style={{color:c.color}}>{c.value}</div>
              <div className="dash-card-label">{c.label}</div>
            </div>
          ))}
        </div>

        {total > 0 && (
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem',marginBottom:'1.5rem'}}>
            <h3 className="section-title" style={{marginBottom:'1.25rem'}}>Verdict Distribution</h3>
            <div style={{display:'flex',gap:'8px',height:'32px',borderRadius:'6px',overflow:'hidden',marginBottom:'0.75rem'}}>
              {verified > 0 && <div style={{flex:verified,background:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontFamily:"'Share Tech Mono',monospace",color:'#000',fontWeight:'700'}}>{Math.round(verified/total*100)}%</div>}
              {fake > 0    && <div style={{flex:fake,   background:'var(--red)',  display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontFamily:"'Share Tech Mono',monospace",color:'#fff',fontWeight:'700'}}>{Math.round(fake/total*100)}%</div>}
              {pending > 0 && <div style={{flex:pending,background:'var(--border2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontFamily:"'Share Tech Mono',monospace",color:'var(--text-muted)',fontWeight:'700'}}>{Math.round(pending/total*100)}%</div>}
            </div>
            <div style={{display:'flex',gap:'1.5rem',fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem'}}>
              <span style={{color:'var(--green)'}}>■ Verified ({verified})</span>
              <span style={{color:'var(--red)'}}>■ Fake ({fake})</span>
              <span style={{color:'var(--text-muted)'}}>■ Pending ({pending})</span>
            </div>
          </div>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem'}}>
            <h3 className="section-title" style={{marginBottom:'1.25rem'}}>Recent Activity</h3>
            {recentActivity.length === 0
              ? <p className="muted">No activity yet</p>
              : recentActivity.map((c, i) => (
                <div key={c._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.6rem 0',borderBottom:i<recentActivity.length-1?'1px solid var(--border)':'none'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'0.85rem',fontWeight:600,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.title}</div>
                    <div style={{fontSize:'0.7rem',fontFamily:"'Share Tech Mono',monospace",color:'var(--text-dim)',marginTop:'2px'}}>
                      👍 {getTV(c)} · 👎 {getFV(c)} · {new Date(c.createdAt||Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{marginLeft:'0.75rem'}}>{getVerdictBadge(c.verdict)}</div>
                </div>
              ))
            }
          </div>

          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:'1.5rem'}}>
            <h3 className="section-title" style={{marginBottom:'1.25rem'}}>Most Voted</h3>
            {topVoted.length === 0
              ? <p className="muted">No votes yet</p>
              : topVoted.map((c) => {
                const tv = getTV(c);
                const fv = getFV(c);
                const tot = tv + fv;
                const pct = tot > 0 ? Math.round(tv/tot*100) : 50;
                return (
                  <div key={c._id} style={{marginBottom:'1rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                      <span style={{fontSize:'0.85rem',fontWeight:600,color:'var(--text)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.title}</span>
                      <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:'0.72rem',color:'var(--text-muted)',marginLeft:'8px'}}>{tot} votes</span>
                    </div>
                    <div className="vote-bar"><div className="vote-bar-fill" style={{width:`${pct}%`}} /></div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',fontFamily:"'Share Tech Mono',monospace",marginTop:'3px'}}>
                      <span style={{color:'var(--green)'}}>👍 {tv} ({pct}%)</span>
                      <span style={{color:'var(--red)'}}>👎 {fv} ({100-pct}%)</span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

      </div>
    </div>
  );
}
