import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [overrideVerdict, setOverrideVerdict] = useState("TRUE");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState(null);
  const [working, setWorking] = useState(false);

  const login = () => {
    if (adminKey === "VERIFYIT_ADMIN_2024") setAuthed(true);
    else setMsg({ type: "error", text: "Invalid admin key" });
  };

  useEffect(() => {
    if (!authed) return;
    axios.get(`http://localhost:5000/api/claims?status=all&limit=100`)
      .then(res => { const data = res.data.claims || res.data; setClaims(Array.isArray(data) ? data : []); })
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [authed]);

  const doOverride = async () => {
    if (!selected || !reason.trim()) { setMsg({ type: "error", text: "Select a claim and provide a reason" }); return; }
    setWorking(true);
    try {
      await axios.post(`http://localhost:5000/api/admin/override`, {
        claimId: selected._id,
        verdict: overrideVerdict,
        reason,
        adminKey
      });
      setMsg({ type: "success", text: "Verdict overridden successfully!" });
      setClaims(claims.map(c => c._id === selected._id ? { ...c, verdict: overrideVerdict, adminOverride: { reason, by: "admin" } } : c));
      setSelected(null);
      setReason("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.error || "Override failed" });
    }
    setWorking(false);
  };

  const getVerdictColor = (v) => v === "TRUE" ? "#00ff88" : v === "FALSE" ? "#ff3366" : v === "UNVERIFIED" ? "#ffd700" : "#64748b";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .adm{padding:2rem;max-width:1100px;margin:0 auto;}
    .adm-login{max-width:420px;margin:5rem auto;background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(0,245,255,0.15);border-radius:16px;padding:2.5rem;text-align:center;}
    .adm-title{font-family:'Orbitron',monospace;font-size:1.1rem;color:#00f5ff;letter-spacing:0.15em;margin-bottom:0.5rem;}
    .adm-sub{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:#64748b;margin-bottom:1.5rem;}
    .adm-input{width:100%;background:rgba(26,39,68,0.8);border:1px solid rgba(0,245,255,0.15);border-radius:8px;padding:0.75rem 1rem;color:#e2e8f0;font-family:'Share Tech Mono',monospace;font-size:0.8rem;margin-bottom:1rem;outline:none;box-sizing:border-box;}
    .adm-btn{padding:0.65rem 1.5rem;background:linear-gradient(135deg,#00f5ff,#0088bb);border:none;border-radius:8px;color:#000;font-family:'Orbitron',monospace;font-size:0.72rem;font-weight:700;cursor:pointer;letter-spacing:0.08em;}
    .adm-hero{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(255,51,102,0.3);border-radius:16px;padding:1.5rem 2rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;}
    .adm-hero-title{font-family:'Orbitron',monospace;font-size:1rem;color:#ff3366;letter-spacing:0.1em;}
    .adm-hero-sub{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:#64748b;margin-top:0.3rem;}
    .adm-cols{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
    .adm-section{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;overflow:hidden;}
    .adm-section-hdr{padding:1rem 1.5rem;border-bottom:1px solid rgba(26,39,68,0.8);font-family:'Orbitron',monospace;font-size:0.75rem;color:#00f5ff;letter-spacing:0.1em;}
    .adm-section-body{padding:0.5rem 0;max-height:450px;overflow-y:auto;}
    .adm-item{padding:0.85rem 1.5rem;border-bottom:1px solid rgba(26,39,68,0.4);cursor:pointer;transition:background 0.15s;}
    .adm-item:hover{background:rgba(0,245,255,0.03);}
    .adm-item.selected{background:rgba(0,245,255,0.06);border-left:3px solid #00f5ff;}
    .adm-item-title{font-family:'Exo 2',sans-serif;font-size:0.78rem;color:#e2e8f0;font-weight:600;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    .adm-item-meta{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:#64748b;display:flex;align-items:center;gap:0.5rem;}
    .adm-badge{display:inline-block;padding:0.15rem 0.5rem;border-radius:4px;font-family:'Share Tech Mono',monospace;font-size:0.58rem;font-weight:700;}
    .adm-override-panel{padding:1.5rem;}
    .adm-panel-title{font-family:'Orbitron',monospace;font-size:0.75rem;color:#ff3366;letter-spacing:0.1em;margin-bottom:1rem;}
    .adm-selected-claim{background:rgba(255,51,102,0.05);border:1px solid rgba(255,51,102,0.2);border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;font-family:'Exo 2',sans-serif;font-size:0.78rem;color:#e2e8f0;}
    .adm-label{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:#64748b;margin-bottom:0.4rem;margin-top:0.75rem;}
    .adm-select{width:100%;background:rgba(26,39,68,0.8);border:1px solid rgba(0,245,255,0.15);border-radius:8px;padding:0.6rem 1rem;color:#e2e8f0;font-family:'Share Tech Mono',monospace;font-size:0.75rem;outline:none;}
    .adm-textarea{width:100%;background:rgba(26,39,68,0.8);border:1px solid rgba(0,245,255,0.15);border-radius:8px;padding:0.75rem 1rem;color:#e2e8f0;font-family:'Share Tech Mono',monospace;font-size:0.72rem;outline:none;resize:vertical;min-height:80px;box-sizing:border-box;margin-top:0.4rem;}
    .adm-override-btn{width:100%;margin-top:1rem;padding:0.75rem;background:linear-gradient(135deg,#ff3366,#cc0033);border:none;border-radius:8px;color:#fff;font-family:'Orbitron',monospace;font-size:0.72rem;font-weight:700;cursor:pointer;letter-spacing:0.08em;}
    .adm-override-btn:disabled{opacity:0.4;cursor:not-allowed;}
    .adm-msg{padding:0.6rem 1rem;border-radius:8px;font-family:'Share Tech Mono',monospace;font-size:0.68rem;margin-top:0.75rem;}
    .adm-msg.success{background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.2);color:#00ff88;}
    .adm-msg.error{background:rgba(255,51,102,0.08);border:1px solid rgba(255,51,102,0.2);color:#ff3366;}
    .adm-override-tag{font-size:0.55rem;background:rgba(255,51,102,0.1);color:#ff3366;border:1px solid rgba(255,51,102,0.3);padding:0.1rem 0.4rem;border-radius:3px;}
    .adm-empty{text-align:center;padding:2rem;font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:#475569;}
    [data-theme="light"] .adm-section,[data-theme="light"] .adm-hero,[data-theme="light"] .adm-login{background:#ffffff;border-color:rgba(0,0,0,0.1);}
    [data-theme="light"] .adm-item-title{color:#1e293b;}
    [data-theme="light"] .adm-item-meta{color:#64748b;}
    [data-theme="light"] .adm-item{border-color:rgba(0,0,0,0.06);}
    [data-theme="light"] .adm-input,[data-theme="light"] .adm-select,[data-theme="light"] .adm-textarea{background:#f1f5f9;border-color:rgba(0,0,0,0.15);color:#1e293b;}
    [data-theme="light"] .adm-selected-claim{color:#1e293b;}
  `;

  if (!authed) return (
    <><style>{css}</style>
    <div className="adm">
      <div className="adm-login">
        <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>&#128274;</div>
        <div className="adm-title">ADMIN ACCESS</div>
        <div className="adm-sub">Enter admin key to continue</div>
        <input className="adm-input" type="password" placeholder="Admin key..." value={adminKey} onChange={e => setAdminKey(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
        <button className="adm-btn" onClick={login}>AUTHENTICATE</button>
        {msg && <div className={`adm-msg ${msg.type}`}>{msg.text}</div>}
      </div>
    </div></>
  );

  return (
    <><style>{css}</style>
    <div className="adm">
      <div className="adm-hero">
        <div>
          <div className="adm-hero-title">&#9888; ADMIN OVERRIDE PANEL</div>
          <div className="adm-hero-sub">Manually correct verdicts when community consensus is wrong &bull; All overrides are logged</div>
        </div>
        <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"#00ff88"}}>&#9679; AUTHENTICATED</div>
      </div>

      <div className="adm-cols">
        <div className="adm-section">
          <div className="adm-section-hdr">&#128196; ALL CLAIMS ({claims.length})</div>
          <div className="adm-section-body">
            {loading ? <div className="adm-empty">Loading...</div> : claims.length === 0 ? <div className="adm-empty">No claims found</div> : claims.map(c => (
              <div key={c._id} className={`adm-item${selected?._id === c._id ? " selected" : ""}`} onClick={() => { setSelected(c); setMsg(null); }}>
                <div className="adm-item-title">{c.title}</div>
                <div className="adm-item-meta">
                  <span style={{color: getVerdictColor(c.verdict)}}>{c.verdict || "PENDING"}</span>
                  <span>&#183; {(c.votes?.true||0) + (c.votes?.false||0)} votes</span>
                  {c.adminOverride?.by && <span className="adm-override-tag">OVERRIDDEN</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-section">
          <div className="adm-section-hdr">&#9998; OVERRIDE VERDICT</div>
          <div className="adm-override-panel">
            {!selected ? (
              <div className="adm-empty" style={{paddingTop:"3rem"}}>&#8592; Select a claim to override</div>
            ) : (
              <>
                <div className="adm-panel-title">SELECTED CLAIM</div>
                <div className="adm-selected-claim">{selected.title}</div>
                <div className="adm-item-meta" style={{marginBottom:"0.5rem"}}>
                  Current verdict: <span style={{color: getVerdictColor(selected.verdict), marginLeft:"0.4rem"}}>{selected.verdict || "PENDING"}</span>
                  &nbsp;&bull;&nbsp;{(selected.votes?.true||0)} TRUE / {(selected.votes?.false||0)} FALSE
                </div>
                {selected.adminOverride?.reason && (
                  <div style={{background:"rgba(255,51,102,0.06)",border:"1px solid rgba(255,51,102,0.15)",borderRadius:"6px",padding:"0.6rem 0.85rem",fontSize:"0.62rem",fontFamily:"'Share Tech Mono',monospace",color:"#ff3366",marginBottom:"0.75rem"}}>
                    Previously overridden: {selected.adminOverride.reason}
                  </div>
                )}
                <div className="adm-label">NEW VERDICT</div>
                <select className="adm-select" value={overrideVerdict} onChange={e => setOverrideVerdict(e.target.value)}>
                  <option value="TRUE">TRUE — Claim is verified correct</option>
                  <option value="FALSE">FALSE — Claim is verified false</option>
                  <option value="UNVERIFIED">UNVERIFIED — Cannot determine</option>
                </select>
                <div className="adm-label">REASON FOR OVERRIDE</div>
                <textarea className="adm-textarea" placeholder="e.g. Verified by official WHO report dated Jan 2024..." value={reason} onChange={e => setReason(e.target.value)} />
                <button className="adm-override-btn" onClick={doOverride} disabled={working}>
                  {working ? "PROCESSING..." : "⚠ OVERRIDE VERDICT"}
                </button>
                {msg && <div className={`adm-msg ${msg.type}`}>{msg.text}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div></>
  );
}






