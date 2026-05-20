import React, { useEffect, useState } from "react";
import axios from "axios";
import VerdictCertificate from "../components/VerdictCertificate";

export default function Verdict() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [certClaim, setCertClaim] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/claims?status=all&limit=100`)
      .then(res => {
        const data = res.data.claims || res.data;
        setClaims(Array.isArray(data) ? data : []);
      })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  const getVerdict = (v) => {
    const val = String(v || "").toUpperCase();
    if (val === "TRUE")       return { label: "VERIFIED TRUE",   cls: "g", icon: "âœ…" };
    if (val === "FALSE")      return { label: "MARKED FALSE",    cls: "r", icon: "âŒ" };
    if (val === "UNVERIFIED") return { label: "UNVERIFIED",      cls: "y", icon: "âš ï¸" };
    return                           { label: "PENDING VERDICT", cls: "y", icon: "â³" };
  };

  const filtered = claims.filter(c => {
    const val = String(c.verdict || "").toUpperCase();
    if (filter === "all") return true;
    if (filter === "TRUE") return val === "TRUE";
    if (filter === "FALSE") return val === "FALSE";
    if (filter === "UNVERIFIED") return val === "UNVERIFIED";
    if (filter === "PENDING") return !val;
    return true;
  });

  const counts = {
    all: claims.length,
    TRUE: claims.filter(c => String(c.verdict||"").toUpperCase() === "TRUE").length,
    FALSE: claims.filter(c => String(c.verdict||"").toUpperCase() === "FALSE").length,
    UNVERIFIED: claims.filter(c => String(c.verdict||"").toUpperCase() === "UNVERIFIED").length,
    PENDING: claims.filter(c => !c.verdict).length,
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .vrd{padding:2rem;max-width:1100px;margin:0 auto;}
    .vrd-hdr{margin-bottom:2rem;}
    .vrd-title{font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:700;color:var(--accent,#00f5ff);text-transform:uppercase;letter-spacing:0.1em;border-left:3px solid var(--accent,#00f5ff);padding-left:0.75rem;margin-bottom:0.5rem;}
    .vrd-sub{font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:rgba(100,116,139,0.6);margin-bottom:1.5rem;}
    .vrd-filters{display:flex;gap:0.5rem;flex-wrap:wrap;}
    .vrd-fbtn{font-family:'Share Tech Mono',monospace;font-size:0.68rem;padding:0.4rem 0.9rem;border-radius:6px;border:1px solid rgba(36,48,85,0.9);background:transparent;color:rgba(100,116,139,0.7);cursor:pointer;transition:all 0.2s;letter-spacing:0.05em;}
    .vrd-fbtn:hover{border-color:rgba(0,245,255,0.3);color:#00f5ff;}
    .vrd-fbtn.active-all{border-color:#00f5ff;color:#00f5ff;background:rgba(0,245,255,0.08);}
    .vrd-fbtn.active-TRUE{border-color:#00ff88;color:#00ff88;background:rgba(0,255,136,0.08);}
    .vrd-fbtn.active-FALSE{border-color:#ff3366;color:#ff3366;background:rgba(255,51,102,0.08);}
    .vrd-fbtn.active-UNVERIFIED{border-color:#ffd700;color:#ffd700;background:rgba(255,215,0,0.08);}
    .vrd-fbtn.active-PENDING{border-color:#ffd700;color:#ffd700;background:rgba(255,215,0,0.08);}
    .vrd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.2rem;margin-top:1.5rem;}
    .vrd-card{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:border-color 0.2s,transform 0.2s;}
    .vrd-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .vrd-card.cv-TRUE::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .vrd-card.cv-FALSE::before{background:linear-gradient(90deg,transparent,#ff3366,transparent);}
    .vrd-card.cv-UNVERIFIED::before,.vrd-card.cv-PENDING::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .vrd-card:hover{border-color:rgba(0,245,255,0.2);transform:translateY(-2px);}
    .vrd-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
    .vrd-badge{display:inline-flex;align-items:center;gap:0.35rem;padding:0.25rem 0.75rem;border-radius:5px;font-family:'Share Tech Mono',monospace;font-size:0.65rem;font-weight:700;letter-spacing:0.08em;}
    .vrd-badge.g{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.3);}
    .vrd-badge.r{background:rgba(255,51,102,0.1);color:#ff3366;border:1px solid rgba(255,51,102,0.3);}
    .vrd-badge.y{background:rgba(255,215,0,0.1);color:#ffd700;border:1px solid rgba(255,215,0,0.3);}
    .vrd-id{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.4);}
    .vrd-ctitle{font-family:'Orbitron',monospace;font-size:0.82rem;font-weight:700;color:var(--text,#e2e8f0);margin-bottom:0.6rem;line-height:1.4;}
    .vrd-cdesc{font-family:'Exo 2',sans-serif;font-size:0.78rem;color:rgba(100,116,139,0.7);line-height:1.6;margin-bottom:1rem;}
    .vrd-bar{height:6px;background:rgba(26,39,68,0.9);border-radius:3px;overflow:hidden;margin-bottom:0.45rem;}
    .vrd-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#00ff88,#00f5ff);transition:width 0.5s;}
    .vrd-stats{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:0.67rem;margin-bottom:1rem;}
    .vrd-chain{font-family:'Share Tech Mono',monospace;font-size:0.6rem;border-top:1px solid rgba(26,39,68,0.6);padding-top:0.75rem;margin-top:0.25rem;margin-bottom:0.75rem;}
    .vrd-cert-btn{width:100%;padding:0.5rem;background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.2);border-radius:8px;color:#00f5ff;font-family:'Share Tech Mono',monospace;font-size:0.65rem;cursor:pointer;letter-spacing:0.08em;transition:all 0.2s;}
    .vrd-cert-btn:hover{background:rgba(0,245,255,0.12);border-color:rgba(0,245,255,0.4);}
    .vrd-loading{display:flex;align-items:center;justify-content:center;height:200px;font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;gap:0.75rem;}
    .vrd-spin{width:18px;height:18px;border:2px solid rgba(0,245,255,0.2);border-top-color:#00f5ff;border-radius:50%;animation:vrdspin 0.7s linear infinite;}
    @keyframes vrdspin{to{transform:rotate(360deg);}}
    .vrd-empty{text-align:center;padding:4rem 2rem;}
    .vrd-empty-icon{font-size:3rem;display:block;margin-bottom:1rem;}
    .vrd-empty-title{font-family:'Orbitron',monospace;font-size:1rem;color:var(--text,#e2e8f0);}
    .vrd-count{font-family:'Share Tech Mono',monospace;font-size:0.58rem;opacity:0.6;margin-left:0.3rem;}
    [data-theme="light"] .vrd-card{background:#ffffff;border-color:rgba(0,0,0,0.1);}
    [data-theme="light"] .vrd-ctitle{color:#1e293b;}
    [data-theme="light"] .vrd-cdesc{color:#475569;}
    [data-theme="light"] .vrd-id{color:#94a3b8;}
    [data-theme="light"] .vrd-sub{color:#64748b;}
    [data-theme="light"] .vrd-title{color:#0369a1;border-color:#0369a1;}
    [data-theme="light"] .vrd-fbtn{color:#475569;border-color:rgba(0,0,0,0.15);}
    [data-theme="light"] .vrd-count{color:#94a3b8;}
    [data-theme="light"] .vrd-bar{background:rgba(0,0,0,0.08);}
    [data-theme="light"] .vrd-chain{color:#334155;border-color:rgba(0,0,0,0.12);}
    [data-theme="light"] .vrd-chain a{color:#0369a1;}
    [data-theme="light"] .vrd-chain span{color:#475569;}
    [data-theme="light"] .vrd-stats span{opacity:1;}
  `;

  if (loading) return (
    <><style>{css}</style>
    <div className="vrd"><div className="vrd-loading"><div className="vrd-spin"/>LOADING VERDICTS...</div></div></>
  );

  const filterDefs = [
    { key: "all",        label: "All",           count: counts.all },
    { key: "TRUE",       label: "âœ… True",        count: counts.TRUE },
    { key: "FALSE",      label: "âŒ False",       count: counts.FALSE },
    { key: "UNVERIFIED", label: "âš ï¸ Unverified", count: counts.UNVERIFIED },
    { key: "PENDING",    label: "â³ Pending",     count: counts.PENDING },
  ];

  return (
    <><style>{css}</style>
    <div className="vrd">
      <div className="vrd-hdr">
        <div className="vrd-title">âš–ï¸ Verdicts</div>
        <div className="vrd-sub">All verdicts are permanently recorded on Polygon Amoy Testnet.</div>
        <div className="vrd-filters">
          {filterDefs.map(f => (
            <button key={f.key} className={`vrd-fbtn ${filter === f.key ? "active-" + f.key : ""}`} onClick={() => setFilter(f.key)}>
              {f.label} <span className="vrd-count">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="vrd-empty">
          <span className="vrd-empty-icon">âš–ï¸</span>
          <div className="vrd-empty-title">No verdicts in this category</div>
        </div>
      ) : (
        <div className="vrd-grid">
          {filtered.map(claim => {
            const tv = claim.votes?.true || 0;
            const fv = claim.votes?.false || 0;
            const total = tv + fv;
            const pct = total > 0 ? Math.round(tv / total * 100) : 50;
            const v = getVerdict(claim.verdict);
            const vKey = String(claim.verdict || "PENDING").toUpperCase();
            return (
              <div key={claim._id} className={`vrd-card cv-${vKey}`}>
                <div className="vrd-top">
                  <span className={`vrd-badge ${v.cls}`}>{v.icon} {v.label}</span>
                  <span className="vrd-id">#{(claim._id||"").slice(-6)}</span>
                </div>
                <div className="vrd-ctitle">{claim.title}</div>
                <div className="vrd-cdesc">{(claim.description||"").slice(0,100)}...</div>
                <div className="vrd-bar"><div className="vrd-bar-fill" style={{width:`${pct}%`}}/></div>
                <div className="vrd-stats">
                  <span style={{color:"#00ff88"}}>âœ… {tv} True ({pct}%)</span>
                  <span style={{color:"#ff3366"}}>âŒ {fv} False ({100-pct}%)</span>
                </div>
                <div className="vrd-chain">
                  {claim.blockchain && claim.blockchain.txHash && claim.blockchain.txHash.length > 10
                    ? <a href={`https://amoy.polygonscan.com/tx/${claim.blockchain.txHash}`} target="_blank" rel="noreferrer" style={{textDecoration:"none",color:"#00b4cc"}}>{claim.blockchain.txHash.slice(0,20)}...{claim.blockchain.txHash.slice(-6)} â†—</a>
                    : <span style={{color:"#64748b"}}>â›“ Recorded on Polygon Amoy</span>}
                </div>
                {claim.verdict && (
                  <button className="vrd-cert-btn" onClick={() => setCertClaim(claim)}>
                    &#128196; DOWNLOAD CERTIFICATE
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    {certClaim && <VerdictCertificate claim={certClaim} onClose={() => setCertClaim(null)} />}
    </>
  );
}







