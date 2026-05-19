import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BlockchainExplorer() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recorded: 0, pending: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/claims?status=all&limit=100")
      .then(res => {
        const data = res.data.claims || res.data;
        const list = Array.isArray(data) ? data : [];
        const recorded = list.filter(c => c.blockchain?.txHash && c.blockchain.txHash !== "already-recorded");
        setClaims(list);
        setStats({
          total: list.length,
          recorded: recorded.length,
         pending: list.filter(c => !c.blockchain?.txHash || c.blockchain.txHash === "already-recorded").length
        });
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  const getVerdict = (v) => {
    const val = String(v || "").toUpperCase();
    if (val === "TRUE")       return { label: "VERIFIED TRUE",   cls: "g", icon: "✅" };
    if (val === "FALSE")      return { label: "MARKED FALSE",    cls: "r", icon: "❌" };
    if (val === "UNVERIFIED") return { label: "UNVERIFIED",      cls: "y", icon: "⚠️" };
    return                           { label: "PENDING",         cls: "y", icon: "⏳" };
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .bx{padding:2rem;max-width:1100px;margin:0 auto;}
    .bx-hdr{margin-bottom:2rem;}
    .bx-title{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:700;color:var(--accent,#00f5ff);text-transform:uppercase;letter-spacing:0.1em;border-left:3px solid var(--accent,#00f5ff);padding-left:0.75rem;margin-bottom:0.5rem;}
    .bx-sub{font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:rgba(100,116,139,0.6);margin-bottom:1.5rem;}
    .bx-contract{background:rgba(15,22,41,0.95);border:1px solid rgba(0,245,255,0.2);border-radius:14px;padding:1.5rem;margin-bottom:1.5rem;position:relative;overflow:hidden;}
    .bx-contract::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00f5ff,transparent);}
    .bx-contract-title{font-family:'Orbitron',monospace;font-size:0.75rem;color:#00f5ff;letter-spacing:0.1em;margin-bottom:1rem;}
    .bx-contract-row{display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid rgba(26,39,68,0.6);font-family:'Share Tech Mono',monospace;font-size:0.72rem;}
    .bx-contract-row:last-child{border-bottom:none;}
    .bx-contract-key{color:rgba(100,116,139,0.6);}
    .bx-contract-val{color:#00f5ff;}
    .bx-contract-val a{color:#00f5ff;text-decoration:none;}
    .bx-contract-val a:hover{text-decoration:underline;}
    .bx-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem;}
    .bx-stat{background:rgba(15,22,41,0.95);border:1px solid rgba(26,39,68,0.8);border-radius:14px;padding:1.2rem;text-align:center;position:relative;overflow:hidden;}
    .bx-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .bx-stat:nth-child(1)::before{background:linear-gradient(90deg,transparent,#00f5ff,transparent);}
    .bx-stat:nth-child(2)::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .bx-stat:nth-child(3)::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .bx-stat-val{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;margin-bottom:0.3rem;}
    .bx-stat-label{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.6);letter-spacing:0.1em;}
    .bx-table{background:rgba(15,22,41,0.95);border:1px solid rgba(26,39,68,0.8);border-radius:14px;overflow:hidden;}
    .bx-table-hdr{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:1rem;padding:0.85rem 1.2rem;background:rgba(0,245,255,0.03);border-bottom:1px solid rgba(26,39,68,0.8);font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.5);letter-spacing:0.1em;text-transform:uppercase;}
    .bx-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:1rem;padding:0.85rem 1.2rem;border-bottom:1px solid rgba(26,39,68,0.4);align-items:center;transition:background 0.2s;}
    .bx-row:last-child{border-bottom:none;}
    .bx-row:hover{background:rgba(0,245,255,0.02);}
    .bx-claim-title{font-family:'Exo 2',sans-serif;font-size:0.8rem;color:var(--text,#e2e8f0);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .bx-claim-id{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.4);margin-top:2px;}
    .bx-badge{display:inline-flex;align-items:center;gap:0.3rem;padding:0.2rem 0.6rem;border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:0.62rem;font-weight:700;}
    .bx-badge.g{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.3);}
    .bx-badge.r{background:rgba(255,51,102,0.1);color:#ff3366;border:1px solid rgba(255,51,102,0.3);}
    .bx-badge.y{background:rgba(255,215,0,0.1);color:#ffd700;border:1px solid rgba(255,215,0,0.3);}
    .bx-tx{font-family:'Share Tech Mono',monospace;font-size:0.65rem;}
    .bx-tx a{color:#00f5ff;text-decoration:none;}
    .bx-tx a:hover{text-decoration:underline;}
    .bx-tx-pending{color:rgba(100,116,139,0.4);font-family:'Share Tech Mono',monospace;font-size:0.65rem;}
    .bx-date{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:rgba(100,116,139,0.5);}
    .bx-loading{display:flex;align-items:center;justify-content:center;height:200px;font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;gap:0.75rem;}
    .bx-spin{width:18px;height:18px;border:2px solid rgba(0,245,255,0.2);border-top-color:#00f5ff;border-radius:50%;animation:bxspin 0.7s linear infinite;}
    @keyframes bxspin{to{transform:rotate(360deg);}}
    .bx-live{display:inline-flex;align-items:center;gap:0.4rem;font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:#00ff88;margin-left:1rem;}
    .bx-live-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;animation:bxpulse 1.5s infinite;}
    @keyframes bxpulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
    [data-theme="light"] .bx-contract,[data-theme="light"] .bx-stat,[data-theme="light"] .bx-table{background:#ffffff;border-color:rgba(0,0,0,0.12);}
    [data-theme="light"] .bx-claim-title{color:#1e293b;}
    [data-theme="light"] .bx-contract-key{color:#475569;}
    [data-theme="light"] .bx-contract-val{color:#0369a1;}
    [data-theme="light"] .bx-contract-val a{color:#0369a1;}
    [data-theme="light"] .bx-stat-label{color:#475569;}
    [data-theme="light"] .bx-table-hdr{color:#475569;background:rgba(0,0,0,0.04);}
    [data-theme="light"] .bx-row{border-color:rgba(0,0,0,0.08);}
    [data-theme="light"] .bx-row:hover{background:rgba(0,0,0,0.02);}
    [data-theme="light"] .bx-claim-id{color:#94a3b8;}
    [data-theme="light"] .bx-date{color:#64748b;}
    [data-theme="light"] .bx-tx a{color:#0369a1;}
    [data-theme="light"] .bx-tx-pending{color:#94a3b8;}
    [data-theme="light"] .bx-sub{color:#64748b;}
    [data-theme="light"] .bx-title{color:#0369a1;border-color:#0369a1;}
    [data-theme="light"] .bx-contract-row{border-color:rgba(0,0,0,0.08);}
  `;

  if (loading) return (
    <><style>{css}</style>
    <div className="bx"><div className="bx-loading"><div className="bx-spin"/>LOADING BLOCKCHAIN DATA...</div></div></>
  );

  const recordedClaims = claims.filter(c => c.blockchain?.txHash && c.blockchain.txHash !== "already-recorded");
  const allClaims = claims.filter(c => c.verdict);

  return (
    <><style>{css}</style>
    <div className="bx">
      <div className="bx-hdr">
        <div style={{display:"flex",alignItems:"center"}}>
          <div className="bx-title">⛓ Blockchain Explorer</div>
          <span className="bx-live"><span className="bx-live-dot"/>LIVE ON POLYGON AMOY</span>
        </div>
        <div className="bx-sub">All verdicts permanently recorded on Polygon Amoy Testnet · Smart Contract: 0x72C2d536593686D8c5216453DD0497eCF319a210</div>
      </div>

      <div className="bx-contract">
        <div className="bx-contract-title">⚙️ SMART CONTRACT INFO</div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">Contract Address</span>
          <span className="bx-contract-val">
            <a href="https://amoy.polygonscan.com/address/0x72C2d536593686D8c5216453DD0497eCF319a210" target="_blank" rel="noreferrer">
              0x72C2d536593686D8c5216453DD0497eCF319a210 ↗
            </a>
          </span>
        </div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">Network</span>
          <span className="bx-contract-val">Polygon Amoy Testnet (Chain ID: 80002)</span>
        </div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">Contract Name</span>
          <span className="bx-contract-val">VerifyIt Fact Checker v1.0</span>
        </div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">Owner Wallet</span>
          <span className="bx-contract-val">0x6c556D6900976E152AFC2FD91cE033436F20414C</span>
        </div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">Total Verdicts On-Chain</span>
          <span className="bx-contract-val" style={{color:"#00ff88"}}>{stats.recorded} transactions confirmed</span>
        </div>
        <div className="bx-contract-row">
          <span className="bx-contract-key">All Transactions</span>
          <span className="bx-contract-val">
            <a href="https://amoy.polygonscan.com/address/0x72C2d536593686D8c5216453DD0497eCF319a210#transactions" target="_blank" rel="noreferrer">
              View on PolygonScan ↗
            </a>
          </span>
        </div>
      </div>

      <div className="bx-stats">
        <div className="bx-stat">
          <div className="bx-stat-val" style={{color:"#00f5ff"}}>{stats.total}</div>
          <div className="bx-stat-label">Total Claims</div>
        </div>
        <div className="bx-stat">
          <div className="bx-stat-val" style={{color:"#00ff88"}}>{stats.recorded}</div>
          <div className="bx-stat-label">Recorded On-Chain</div>
        </div>
        <div className="bx-stat">
          <div className="bx-stat-val" style={{color:"#ffd700"}}>{stats.pending}</div>
          <div className="bx-stat-label">Pending Recording</div>
        </div>
      </div>

      <div className="bx-table">
        <div className="bx-table-hdr">
          <span>Claim</span>
          <span>Verdict</span>
          <span>TX Hash</span>
          <span>Date</span>
        </div>
        {allClaims.map(claim => {
          const v = getVerdict(claim.verdict);
          const hasTx = claim.blockchain?.txHash && claim.blockchain.txHash !== "already-recorded";
          return (
            <div key={claim._id} className="bx-row">
              <div>
                <div className="bx-claim-title">{claim.title}</div>
                <div className="bx-claim-id">#{(claim._id||"").slice(-8)}</div>
              </div>
              <div><span className={`bx-badge ${v.cls}`}>{v.icon} {v.label}</span></div>
              <div>
                {hasTx
                  ? <div className="bx-tx"><a href={`https://amoy.polygonscan.com/tx/${claim.blockchain.txHash}`} target="_blank" rel="noreferrer">{claim.blockchain.txHash.slice(0,12)}...{claim.blockchain.txHash.slice(-6)} ↗</a></div>
                  : <div className="bx-tx-pending">⏳ Pending</div>}
              </div>
              <div className="bx-date">{new Date(claim.blockchain?.recordedAt || claim.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
          );
        })}
      </div>
    </div></>
  );
}

