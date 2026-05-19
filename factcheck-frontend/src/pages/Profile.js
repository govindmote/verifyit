import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState({});
  const [reputation, setReputation] = useState(1.0);
  const username = user?.username || "guest";

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    axios.get("http://localhost:5000/api/claims?status=all&limit=100")
      .then(res => { const data = res.data.claims || res.data; setClaims(Array.isArray(data) ? data : []); })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
    axios.get("http://localhost:5000/api/votes/user/" + username)
      .then(res => {
        const votes = res.data.votes || [];
        const map = {};
        votes.forEach(v => { map[v.claimId] = v.choice; });
        setUserVotes(map);
      }).catch(() => {});
    axios.get("http://localhost:5000/api/auth/reputation/" + username)
      .then(res => { setReputation(res.data.reputation || 1.0); }).catch(() => {});
  }, []);

  const votedIds = Object.keys(userVotes);
  const submittedClaims = claims.filter(c => c.submittedBy === username);
  const votedClaimsList = claims.filter(c => votedIds.includes(c._id));
  const totalVotes = votedIds.length;
  const correctVotes = votedClaimsList.filter(c => {
    const myVote = String(userVotes[c._id] || "").toUpperCase();
    const verdict = String(c.verdict || "").toUpperCase();
    return verdict && myVote === verdict;
  }).length;
  const accuracy = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 0;
  const onChain = submittedClaims.filter(c => c.blockchain?.txHash && c.blockchain.txHash !== "already-recorded").length;
  const repColor = reputation >= 1.5 ? "#00ff88" : reputation >= 1.0 ? "#00f5ff" : reputation >= 0.7 ? "#ffd700" : "#ff3366";
  const repLabel = reputation >= 1.5 ? "TRUSTED" : reputation >= 1.0 ? "STANDARD" : reputation >= 0.7 ? "CAUTION" : "LOW";

  const getVerdict = (v) => {
    const val = String(v || "").toUpperCase();
    if (val === "TRUE")       return { label: "VERIFIED TRUE",  cls: "g", icon: "✅" };
    if (val === "FALSE")      return { label: "MARKED FALSE",   cls: "r", icon: "❌" };
    if (val === "UNVERIFIED") return { label: "UNVERIFIED",     cls: "y", icon: "⚠️" };
    return                           { label: "PENDING",        cls: "p", icon: "⏳" };
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .pp{padding:2rem;max-width:1200px;margin:0 auto;}
    .pp-hero{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:20px;padding:2rem;margin-bottom:1.5rem;position:relative;overflow:hidden;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:2rem;}
    .pp-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00f5ff 40%,#7c3aed 60%,transparent);}
    .pp-avatar{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#00f5ff,#7c3aed);display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:2rem;font-weight:900;color:#000;box-shadow:0 0 40px rgba(0,245,255,0.3),0 0 0 3px rgba(0,245,255,0.15);}
    .pp-info .pp-name{font-family:'Orbitron',monospace;font-size:1.5rem;font-weight:900;color:#00f5ff;letter-spacing:0.1em;margin-bottom:0.3rem;}
    .pp-info .pp-role{font-family:'Share Tech Mono',monospace;font-size:0.68rem;color:rgba(100,116,139,0.7);letter-spacing:0.2em;margin-bottom:0.6rem;}
    .pp-info .pp-email{font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:rgba(100,116,139,0.5);}
    .pp-chain-badge{display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;}
    .pp-chain-badge .cb-label{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.5);letter-spacing:0.1em;}
    .pp-chain-badge .cb-val{font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:#00ff88;background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);border-radius:6px;padding:0.3rem 0.75rem;}
    .pp-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:1rem;margin-bottom:1.5rem;}
    .pp-stat{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:14px;padding:1.2rem;text-align:center;position:relative;overflow:hidden;transition:transform 0.2s;}
    .pp-stat:hover{transform:translateY(-2px);}
    .pp-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .pp-stat:nth-child(1)::before{background:linear-gradient(90deg,transparent,#00f5ff,transparent);}
    .pp-stat:nth-child(2)::before{background:linear-gradient(90deg,transparent,#7c3aed,transparent);}
    .pp-stat:nth-child(3)::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .pp-stat:nth-child(4)::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .pp-stat:nth-child(5)::before{background:linear-gradient(90deg,transparent,#ff3366,transparent);}
    .pp-stat:nth-child(6)::before{background:linear-gradient(90deg,transparent,#a78bfa,transparent);}
    .pp-stat-icon{font-size:1.4rem;margin-bottom:0.4rem;}
    .pp-stat-val{font-family:'Orbitron',monospace;font-size:1.4rem;font-weight:900;margin-bottom:0.2rem;}
    .pp-stat-label{font-family:'Share Tech Mono',monospace;font-size:0.55rem;color:rgba(100,116,139,0.6);letter-spacing:0.08em;}
    .pp-cols{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
    .pp-section{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;overflow:hidden;}
    .pp-section-hdr{padding:1rem 1.5rem;border-bottom:1px solid rgba(26,39,68,0.8);display:flex;align-items:center;justify-content:space-between;background:rgba(0,245,255,0.02);}
    .pp-section-title{font-family:'Orbitron',monospace;font-size:0.78rem;color:#00f5ff;letter-spacing:0.1em;}
    .pp-section-count{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:rgba(100,116,139,0.5);background:rgba(26,39,68,0.8);padding:0.2rem 0.6rem;border-radius:10px;}
    .pp-section-body{padding:0.5rem 0;max-height:420px;overflow-y:auto;}
    .pp-item{display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1.5rem;border-bottom:1px solid rgba(26,39,68,0.4);gap:1rem;transition:background 0.15s;}
    .pp-item:last-child{border-bottom:none;}
    .pp-item:hover{background:rgba(0,245,255,0.02);}
    .pp-item-left{flex:1;min-width:0;}
    .pp-item-title{font-family:'Exo 2',sans-serif;font-size:0.8rem;color:var(--text,#e2e8f0);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:3px;}
    .pp-item-meta{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.5);}
    .pp-item-meta.correct{color:#00ff88;}
    .pp-item-meta.wrong{color:#ff3366;}
    .pp-badge{display:inline-flex;align-items:center;gap:3px;padding:0.2rem 0.55rem;border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:0.58rem;font-weight:700;white-space:nowrap;flex-shrink:0;}
    .pp-badge.g{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.25);}
    .pp-badge.r{background:rgba(255,51,102,0.1);color:#ff3366;border:1px solid rgba(255,51,102,0.25);}
    .pp-badge.y{background:rgba(255,215,0,0.1);color:#ffd700;border:1px solid rgba(255,215,0,0.25);}
    .pp-badge.p{background:rgba(100,116,139,0.1);color:#94a3b8;border:1px solid rgba(100,116,139,0.2);}
    .pp-acc-wrap{padding:1rem 1.5rem;border-top:1px solid rgba(26,39,68,0.6);}
    .pp-acc-label{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.6);margin-bottom:0.5rem;display:flex;justify-content:space-between;}
    .pp-acc-bar{height:6px;background:rgba(26,39,68,0.9);border-radius:3px;overflow:hidden;}
    .pp-acc-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#00ff88,#00f5ff);transition:width 1s;}
    .pp-empty{text-align:center;padding:2.5rem 1.5rem;font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:rgba(100,116,139,0.4);}
    .pp-empty a{color:#00f5ff;text-decoration:none;}
    .pp-loading{display:flex;align-items:center;justify-content:center;height:300px;font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;gap:0.75rem;}
    .pp-spin{width:18px;height:18px;border:2px solid rgba(0,245,255,0.2);border-top-color:#00f5ff;border-radius:50%;animation:ppspin 0.7s linear infinite;}
    @keyframes ppspin{to{transform:rotate(360deg);}}
    [data-theme="light"] .pp-hero,[data-theme="light"] .pp-stat,[data-theme="light"] .pp-section{background:#ffffff;border-color:rgba(0,0,0,0.1);}
    [data-theme="light"] .pp-section-hdr{background:rgba(0,0,0,0.02);border-color:rgba(0,0,0,0.08);}
    [data-theme="light"] .pp-item-title{color:#1e293b;}
    [data-theme="light"] .pp-item-meta{color:#64748b;}
    [data-theme="light"] .pp-item{border-color:rgba(0,0,0,0.06);}
    [data-theme="light"] .pp-stat-label{color:#475569;}
    [data-theme="light"] .pp-section-title{color:#0369a1;}
    [data-theme="light"] .pp-section-count{background:rgba(0,0,0,0.06);color:#64748b;}
    [data-theme="light"] .pp-acc-bar{background:rgba(0,0,0,0.08);}
    [data-theme="light"] .pp-acc-wrap{border-color:rgba(0,0,0,0.08);}
    [data-theme="light"] .pp-info .pp-role,[data-theme="light"] .pp-info .pp-email{color:#64748b;}
  `;

  if (loading) return (
    <><style>{css}</style>
    <div className="pp"><div className="pp-loading"><div className="pp-spin"/>LOADING PROFILE...</div></div></>
  );

  return (
    <><style>{css}</style>
    <div className="pp">
      <div className="pp-hero">
        <div className="pp-avatar">{username[0].toUpperCase()}</div>
        <div className="pp-info">
          <div className="pp-name">{username.toUpperCase()}</div>
          <div className="pp-role">&#9670; FACT-CHECKER · POLYGON AMOY NETWORK</div>
          <div className="pp-email">{user?.email || ""}</div>
        </div>
        <div className="pp-chain-badge">
          <span className="cb-label">NETWORK</span>
          <span className="cb-val">&#9899; POLYGON AMOY</span>
          <span className="cb-label" style={{marginTop:"0.5rem"}}>ON-CHAIN RECORDS</span>
          <span className="cb-val">{onChain} verdicts</span>
        </div>
      </div>

      <div className="pp-stats">
        <div className="pp-stat">
          <div className="pp-stat-icon">&#128196;</div>
          <div className="pp-stat-val" style={{color:"#00f5ff"}}>{submittedClaims.length}</div>
          <div className="pp-stat-label">Claims Submitted</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-icon">&#128228;</div>
          <div className="pp-stat-val" style={{color:"#a78bfa"}}>{totalVotes}</div>
          <div className="pp-stat-label">Votes Cast</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-icon">&#9989;</div>
          <div className="pp-stat-val" style={{color:"#00ff88"}}>{correctVotes}</div>
          <div className="pp-stat-label">Correct Verdicts</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-icon">&#127919;</div>
          <div className="pp-stat-val" style={{color:"#ffd700"}}>{accuracy}%</div>
          <div className="pp-stat-label">Accuracy Rate</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-icon">&#9935;</div>
          <div className="pp-stat-val" style={{color:"#ff3366"}}>{onChain}</div>
          <div className="pp-stat-label">On-Chain Records</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-icon">&#11088;</div>
          <div className="pp-stat-val" style={{color:repColor}}>{reputation.toFixed(2)}</div>
          <div className="pp-stat-label">Reputation · {repLabel}</div>
        </div>
      </div>

      <div className="pp-cols">
        <div className="pp-section">
          <div className="pp-section-hdr">
            <span className="pp-section-title">&#128196; SUBMITTED CLAIMS</span>
            <span className="pp-section-count">{submittedClaims.length} total</span>
          </div>
          <div className="pp-section-body">
            {submittedClaims.length === 0 ? (
              <div className="pp-empty">No claims yet.<br/><Link to="/submit">Submit one →</Link></div>
            ) : submittedClaims.map(c => {
              const v = getVerdict(c.verdict);
              return (
                <div key={c._id} className="pp-item">
                  <div className="pp-item-left">
                    <div className="pp-item-title">{c.title}</div>
                    <div className="pp-item-meta">#{(c._id||"").slice(-8)} · {new Date(c.createdAt||Date.now()).toLocaleDateString()}</div>
                  </div>
                  <span className={`pp-badge ${v.cls}`}>{v.icon} {v.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pp-section">
          <div className="pp-section-hdr">
            <span className="pp-section-title">&#128228; MY VOTES</span>
            <span className="pp-section-count">{totalVotes} total</span>
          </div>
          <div className="pp-section-body">
            {votedClaimsList.length === 0 ? (
              <div className="pp-empty">No votes yet.<br/><Link to="/vote">Vote on claims →</Link></div>
            ) : votedClaimsList.map(c => {
              const v = getVerdict(c.verdict);
              const myVote = String(userVotes[c._id] || "").toUpperCase();
              const correct = c.verdict && myVote === String(c.verdict).toUpperCase();
              const metaCls = c.verdict ? (correct ? "correct" : "wrong") : "";
              return (
                <div key={c._id} className="pp-item">
                  <div className="pp-item-left">
                    <div className="pp-item-title">{c.title}</div>
                    <div className={`pp-item-meta ${metaCls}`}>
                      Voted: {myVote} {c.verdict ? (correct ? "· ✓ Correct" : "· ✗ Wrong") : "· Pending verdict"}
                    </div>
                  </div>
                  <span className={`pp-badge ${v.cls}`}>{v.icon} {v.label}</span>
                </div>
              );
            })}
          </div>
          {totalVotes > 0 && (
            <div className="pp-acc-wrap">
              <div className="pp-acc-label">
                <span>Accuracy</span>
                <span style={{color:"#00ff88"}}>{accuracy}%</span>
              </div>
              <div className="pp-acc-bar"><div className="pp-acc-fill" style={{width:accuracy+"%"}}/></div>
            </div>
          )}
        </div>
      </div>
    </div></>
  );
}
