import AIAnalysis from '../components/AIAnalysis';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import BlockchainConfirm from '../components/BlockchainConfirm';

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Vote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [msg, setMsg] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}').username || 'guest';
  const [votedClaims, setVotedClaims] = useState(() => JSON.parse(localStorage.getItem("votedClaims") || "{}"));
  const [verdictReveal, setVerdictReveal] = useState(null);
  const [bcConfirm, setBcConfirm] = useState(null);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${API}/api/claims?status=all&limit=100`);
      const data = res.data.claims || res.data;
      const list = Array.isArray(data) ? data : [];
      setClaims(list);
      if (id) setSelected(list.find(c => c._id === id) || null);
      return list;
    } catch { setClaims([]); return []; }
  };

  useEffect(() => { fetchClaims().finally(() => setLoading(false)); }, [id]);

  const vote = async (claimId, choice) => {
    setVoting(true);
    setMsg(null);
    const username = JSON.parse(localStorage.getItem("user") || "{}").username || "anonymous";
    try {
      const voteRes = await axios.post(`${API}/api/votes`, {
        claimId,
        voterAddress: username,
        choice,
      });
      const next = { ...votedClaims, [claimId]: choice };
      setVotedClaims(next);
      localStorage.setItem('votedClaims_' + currentUser, JSON.stringify(next));
      await new Promise(r => setTimeout(r, 300));
      const list = await fetchClaims();
      const updated = list.find(c => c._id === claimId);
      const tv = updated?.votes?.true || 0;
      const fv = updated?.votes?.false || 0;
      const total = tv + fv;
      const apiVerdict = voteRes.data.verdict;
      if (apiVerdict) {
        setBcConfirm({ verdict: apiVerdict, claimId });
        setMsg({ type: "success", text: `Verdict reached: ${apiVerdict} · Your vote weight was ${(voteRes.data.weight||1).toFixed(2)}x` });
      } else {
        setMsg({ type: "success", text: `Vote recorded! Weight: ${(voteRes.data.weight||1).toFixed(2)}x · ${total < 3 ? (3 - total) + " more vote(s) needed." : ""}` });
      }
    } catch (err) {
      const e = err.response?.data?.error || "";
      if (e.includes("already voted")) {
        const next = { ...votedClaims, [claimId]: true };
        setVotedClaims(next);
        localStorage.setItem("votedClaims_" + currentUser, JSON.stringify(next));
        setMsg({ type: "error", text: "You have already voted on this claim." });
      } else {
        setMsg({ type: "error", text: e || "Vote failed. Try again." });
      }
      setVoting(false);
    }
  };

  const getVerdict = (v) => {
    const val = (v || "").toUpperCase();
    if (val === "TRUE")       return { label: "VERIFIED TRUE",   cls: "g" };
    if (val === "FALSE")      return { label: "MARKED FALSE",    cls: "r" };
    if (val === "UNVERIFIED") return { label: "UNVERIFIED",      cls: "y" };
    return                           { label: "PENDING VERDICT", cls: "y" };
  };

  const hasVoted = (claimId) => !!votedClaims[claimId];

  const revealColor = verdictReveal === "TRUE" ? "#00ff88" : verdictReveal === "FALSE" ? "#ff3366" : "#ffd700";
  const revealText  = verdictReveal === "TRUE" ? "VERIFIED TRUE" : verdictReveal === "FALSE" ? "MARKED FALSE" : "UNVERIFIED";
  const revealEmoji = verdictReveal === "TRUE" ? "?" : verdictReveal === "FALSE" ? "?" : "?";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap');
    .vp{padding:2rem;max-width:1100px;margin:0 auto;}
    .vp-back{display:inline-flex;align-items:center;gap:0.4rem;background:transparent;border:1px solid rgba(36,48,85,0.9);border-radius:7px;padding:0.4rem 0.9rem;color:var(--text-muted,#64748b);font-family:'Share Tech Mono',monospace;font-size:0.72rem;cursor:pointer;margin-bottom:1.8rem;transition:all 0.2s;text-decoration:none;}
    .vp-back:hover{border-color:#00f5ff;color:#00f5ff;}
    .vp-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.8rem;}
    .vp-title{font-family:'Orbitron',monospace;font-size:1rem;font-weight:700;color:var(--accent,#00f5ff);text-transform:uppercase;letter-spacing:0.1em;border-left:3px solid var(--accent,#00f5ff);padding-left:0.75rem;}
    .vp-sub-btn{background:linear-gradient(135deg,#00f5ff,#0088bb);border:none;border-radius:7px;padding:0.4rem 1rem;color:#000;font-family:'Orbitron',monospace;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;text-decoration:none;display:inline-block;}
    .vp-detail{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:18px;padding:2rem;position:relative;overflow:hidden;}
    .vp-detail::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,245,255,0.5),transparent);}
    .vcn{position:absolute;width:12px;height:12px;border-color:rgba(0,245,255,0.25);border-style:solid;}
    .vtl{top:10px;left:10px;border-width:2px 0 0 2px;}.vtr{top:10px;right:10px;border-width:2px 2px 0 0;}
    .vbl{bottom:10px;left:10px;border-width:0 0 2px 2px;}.vbr{bottom:10px;right:10px;border-width:0 2px 2px 0;}
    .vp-dtop{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;}
    .vp-badge{display:inline-flex;align-items:center;padding:0.25rem 0.75rem;border-radius:5px;font-family:'Share Tech Mono',monospace;font-size:0.65rem;font-weight:700;letter-spacing:0.08em;}
    .vp-badge.g{background:rgba(0,255,136,0.1);color:#00ff88;border:1px solid rgba(0,255,136,0.3);}
    .vp-badge.r{background:rgba(255,51,102,0.1);color:#ff3366;border:1px solid rgba(255,51,102,0.3);}
    .vp-badge.y{background:rgba(255,215,0,0.1);color:#ffd700;border:1px solid rgba(255,215,0,0.3);}
    .vp-id{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:rgba(100,116,139,0.5);}
    .vp-claim-title{font-family:'Orbitron',monospace;font-size:1.2rem;font-weight:700;color:var(--text,#e2e8f0);margin-bottom:1rem;line-height:1.4;}
    .vp-desc{font-family:'Exo 2',sans-serif;color:var(--text-muted,#64748b);line-height:1.75;margin-bottom:1.2rem;font-size:0.9rem;}
    .vp-source{color:#00f5ff;font-family:'Share Tech Mono',monospace;font-size:0.75rem;text-decoration:none;display:inline-flex;align-items:center;gap:0.4rem;margin-bottom:0.6rem;}
    .vp-hash{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.4);margin-bottom:1rem;}
    .vp-msg{padding:0.7rem 1rem;border-radius:8px;font-family:'Share Tech Mono',monospace;font-size:0.75rem;margin-bottom:1.2rem;}
    .vp-msg.success{background:rgba(0,255,136,0.08);border:1px solid rgba(0,255,136,0.25);color:#00ff88;}
    .vp-msg.error{background:rgba(255,51,102,0.08);border:1px solid rgba(255,51,102,0.25);color:#ff3366;}
    .vp-bar{height:8px;background:rgba(26,39,68,0.9);border-radius:4px;overflow:hidden;margin-bottom:0.6rem;}
    .vp-bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#00ff88,#00f5ff);transition:width 0.5s;}
    .vp-stats{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:0.75rem;margin-top:0.5rem;margin-bottom:1.5rem;}
    .vp-actions{display:flex;gap:1rem;}
    .vp-vote-true{flex:1;padding:1rem;background:linear-gradient(135deg,#00ff88,#00aa55);border:none;border-radius:10px;color:#000;font-family:'Orbitron',monospace;font-size:0.78rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;transition:all 0.2s;}
    .vp-vote-true:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,255,136,0.35);}
    .vp-vote-false{flex:1;padding:1rem;background:linear-gradient(135deg,#ff3366,#aa0033);border:none;border-radius:10px;color:#fff;font-family:'Orbitron',monospace;font-size:0.78rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;transition:all 0.2s;}
    .vp-vote-false:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(255,51,102,0.35);}
    .vp-vote-true:disabled,.vp-vote-false:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
    .vp-voted-tag{text-align:center;padding:0.75rem;font-family:'Share Tech Mono',monospace;font-size:0.75rem;color:#00f5ff;border:1px solid rgba(0,245,255,0.2);border-radius:8px;background:rgba(0,245,255,0.05);}
    .vp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;}
    .vp-card{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:14px;padding:1.3rem;position:relative;overflow:hidden;transition:border-color 0.2s,transform 0.2s;}
    .vp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
    .vp-card.v-true::before{background:linear-gradient(90deg,transparent,#00ff88,transparent);}
    .vp-card.v-false::before{background:linear-gradient(90deg,transparent,#ff3366,transparent);}
    .vp-card.v-pending::before{background:linear-gradient(90deg,transparent,#ffd700,transparent);}
    .vp-card:hover{border-color:rgba(0,245,255,0.25);transform:translateY(-2px);}
    .vp-ctop{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;}
    .vp-ctitle{font-family:'Orbitron',monospace;font-size:0.78rem;font-weight:700;color:var(--text,#e2e8f0);margin-bottom:0.5rem;line-height:1.4;}
    .vp-cdesc{font-size:0.78rem;color:var(--text-muted,#64748b);line-height:1.6;margin-bottom:0.85rem;}
    .vp-cbar{height:5px;background:rgba(26,39,68,0.8);border-radius:3px;overflow:hidden;margin-bottom:0.45rem;}
    .vp-cbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#00ff88,#00f5ff);transition:width 0.4s;}
    .vp-cstats{display:flex;justify-content:space-between;font-family:'Share Tech Mono',monospace;font-size:0.67rem;margin-bottom:0.85rem;}
    .vp-cbtns{display:flex;gap:0.5rem;}
    .vp-bt{flex:1;padding:0.45rem 0.5rem;border:none;border-radius:7px;font-family:'Share Tech Mono',monospace;font-size:0.7rem;font-weight:700;cursor:pointer;transition:all 0.2s;}
    .vp-bt-t{background:rgba(0,255,136,0.15);color:#00ff88;border:1px solid rgba(0,255,136,0.3);}
    .vp-bt-t:hover:not(:disabled){background:rgba(0,255,136,0.28);}
    .vp-bt-f{background:rgba(255,51,102,0.15);color:#ff3366;border:1px solid rgba(255,51,102,0.3);}
    .vp-bt-f:hover:not(:disabled){background:rgba(255,51,102,0.28);}
    .vp-bt-d{background:transparent;color:var(--text-muted,#64748b);border:1px solid rgba(36,48,85,0.9);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;}
    .vp-bt-d:hover{border-color:#00f5ff;color:#00f5ff;}
    .vp-bt:disabled{opacity:0.5;cursor:not-allowed;}
    .vp-loading{display:flex;align-items:center;justify-content:center;height:200px;font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;gap:0.75rem;}
    .vp-spin{width:18px;height:18px;border:2px solid rgba(0,245,255,0.2);border-top-color:#00f5ff;border-radius:50%;animation:vpspin 0.7s linear infinite;}
    @keyframes vpspin{to{transform:rotate(360deg);}}
    .vp-empty{text-align:center;padding:4rem 2rem;}
    .vp-empty-icon{font-size:3rem;display:block;margin-bottom:1rem;}
    .vp-empty-title{font-family:'Orbitron',monospace;font-size:1rem;color:var(--text,#e2e8f0);margin-bottom:1.5rem;}
    .vp-reveal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);backdrop-filter:blur(10px);z-index:999;display:flex;align-items:center;justify-content:center;animation:rvFade 0.4s ease;cursor:pointer;}
    @keyframes rvFade{from{opacity:0}to{opacity:1}}
    .vp-reveal-box{text-align:center;animation:rvScale 0.6s cubic-bezier(0.34,1.56,0.64,1);}
    @keyframes rvScale{from{transform:scale(0.3);opacity:0}to{transform:scale(1);opacity:1}}
    .vp-reveal-emoji{font-size:6rem;display:block;margin-bottom:1.5rem;animation:rvBounce 0.5s ease 0.3s both;}
    @keyframes rvBounce{0%{transform:scale(0)}60%{transform:scale(1.4)}100%{transform:scale(1)}}
    .vp-reveal-label{font-family:'Orbitron',monospace;font-size:2.5rem;font-weight:900;letter-spacing:0.15em;margin-bottom:1rem;animation:rvGlow 1.5s ease infinite alternate;}
    @keyframes rvGlow{from{text-shadow:0 0 20px currentColor}to{text-shadow:0 0 80px currentColor,0 0 120px currentColor}}
    .vp-reveal-sub{font-family:'Share Tech Mono',monospace;font-size:0.8rem;color:rgba(255,255,255,0.4);letter-spacing:0.1em;}
    .vp-timeline{display:flex;align-items:center;margin:1.5rem 0;padding:1rem 1.2rem;background:rgba(0,0,0,0.2);border:1px solid rgba(26,39,68,0.8);border-radius:12px;gap:0;flex-wrap:nowrap;overflow-x:auto;}
    .vp-tl-step{display:flex;flex-direction:column;align-items:center;flex:1;min-width:80px;}
    .vp-tl-icon{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:0.4rem;border:2px solid;}
    .vp-tl-icon.done{background:rgba(0,255,136,0.1);border-color:rgba(0,255,136,0.4);}
    .vp-tl-icon.active{background:rgba(0,245,255,0.1);border-color:rgba(0,245,255,0.4);animation:tlpulse 2s infinite;}
    .vp-tl-icon.pending{background:rgba(100,116,139,0.08);border-color:rgba(100,116,139,0.2);}
    @keyframes tlpulse{0%,100%{box-shadow:0 0 0 0 rgba(0,245,255,0.3);}50%{box-shadow:0 0 0 6px rgba(0,245,255,0);}}
    .vp-tl-label{font-family:'Share Tech Mono',monospace;font-size:0.55rem;letter-spacing:0.08em;text-align:center;text-transform:uppercase;}
    .vp-tl-label.done{color:#00ff88;}
    .vp-tl-label.active{color:#00f5ff;}
    .vp-tl-label.pending{color:rgba(100,116,139,0.4);}
    .vp-tl-date{font-family:'Share Tech Mono',monospace;font-size:0.5rem;color:rgba(100,116,139,0.4);margin-top:2px;text-align:center;}
    .vp-tl-line{flex:1;height:2px;min-width:20px;margin-bottom:1.2rem;}
    .vp-tl-line.done{background:linear-gradient(90deg,#00ff88,#00f5ff);}
    .vp-tl-line.pending{background:rgba(26,39,68,0.8);}
    [data-theme="light"] .vp-detail,[data-theme="light"] .vp-card{background:rgba(255,255,255,0.97);border-color:rgba(203,213,225,0.8);}
    [data-theme="light"] .vp-claim-title,[data-theme="light"] .vp-ctitle{color:#1e293b;}
    [data-theme="light"] .vp-bar,[data-theme="light"] .vp-cbar{background:rgba(203,213,225,0.8);}
    [data-theme="light"] .vp-timeline{background:rgba(240,244,255,0.8);border-color:rgba(203,213,225,0.8);}
    [data-theme="light"] .vp-tl-line.pending{background:rgba(203,213,225,0.8);}
  `;

  const Timeline = ({ claim }) => {
    const submitted = claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : "Unknown";
    const hasVotes = (claim.votes?.true || 0) + (claim.votes?.false || 0) > 0;
    const hasVerdict = !!(claim.verdict);
    const onChain = !!(claim.blockchain?.txHash && claim.blockchain.txHash !== "already-recorded");
    const steps = [
      { icon: "?", label: "Submitted", date: submitted, state: "done" },
      { icon: "?", label: "Voting", date: hasVotes ? "In progress" : "Waiting", state: hasVotes ? "done" : "active" },
      { icon: "?", label: "Verdict", date: hasVerdict ? claim.verdict : "Pending", state: hasVerdict ? "done" : hasVotes ? "active" : "pending" },
      { icon: "?", label: "On-Chain", date: onChain ? "Recorded" : "Pending", state: onChain ? "done" : hasVerdict ? "active" : "pending" },
    ];
    return (
      <div className="vp-timeline">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="vp-tl-step">
              <div className={`vp-tl-icon ${s.state}`}>{s.icon}</div>
              <div className={`vp-tl-label ${s.state}`}>{s.label}</div>
              <div className="vp-tl-date">{s.date}</div>
            </div>
            {i < steps.length - 1 && <div className={`vp-tl-line ${s.state === "done" ? "done" : "pending"}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const APP_URL = process.env.REACT_APP_URL || "http://localhost:3000";

  if (loading) return (
    <><style>{css}</style>
      {bcConfirm && <BlockchainConfirm verdict={bcConfirm.verdict} claimId={bcConfirm.claimId} onDone={() => setBcConfirm(null)} />}
      <div className="vp"><div className="vp-loading"><div className="vp-spin" />LOADING CLAIMS...</div></div>
    </>
  );

  if (id && selected) {
    const tv = selected.votes?.true || 0;
    const fv = selected.votes?.false || 0;
    const total = tv + fv;
    const pct = total > 0 ? Math.round(tv / total * 100) : 50;
    const v = getVerdict(selected.verdict);
    const vClass = (selected.verdict || "").toUpperCase() === "TRUE" ? "v-true" : (selected.verdict || "").toUpperCase() === "FALSE" ? "v-false" : "v-pending";
    const alreadyVoted = hasVoted(selected._id);
    return (
      <><style>{css}</style>
        {bcConfirm && <BlockchainConfirm verdict={bcConfirm.verdict} claimId={bcConfirm.claimId} onDone={() => setBcConfirm(null)} />}
        {verdictReveal && (
          <div className="vp-reveal-overlay" onClick={() => setVerdictReveal(null)}>
            <div className="vp-reveal-box">
              <span className="vp-reveal-emoji">{revealEmoji}</span>
              <div className="vp-reveal-label" style={{ color: revealColor }}>{revealText}</div>
              <div className="vp-reveal-sub">VERDICT LOCKED ON-CHAIN · TAP TO DISMISS</div>
            </div>
          </div>
        )}
        <div className="vp">
          <button className="vp-back" onClick={() => navigate("/vote")}>? Back to Claims</button>
          <div className={`vp-detail ${vClass}`}>
            <div className="vcn vtl" /><div className="vcn vtr" />
            <div className="vcn vbl" /><div className="vcn vbr" />
            <div className="vp-dtop">
              <span className={`vp-badge ${v.cls}`}>{v.label}</span>
              <span className="vp-id">#{(selected._id || "").slice(-8)}</span>
            </div>
            <div className="vp-claim-title">{selected.title}</div>
            <div className="vp-desc">{selected.description}</div>
            {selected.sourceUrl && (
              <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="vp-source">View Source ?</a>
            )}
            <div className="vp-hash">
              {selected.blockchain?.txHash && selected.blockchain.txHash !== "already-recorded"
                ? <a href={`https://amoy.polygonscan.com/tx/${selected.blockchain.txHash}`} target="_blank" rel="noreferrer" style={{ color: "#00b4cc", textDecoration: "none" }}>? {selected.blockchain.txHash.slice(0, 20)}...{selected.blockchain.txHash.slice(-6)} ?</a>
                : <span style={{ color: "#64748b" }}>? {selected.blockchain?.txHash === "already-recorded" ? "Recorded on Polygon Amoy" : "Pending on-chain recording..."}</span>
              }
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <a href={`https://wa.me/?text=${encodeURIComponent("Check this claim on VerifyIt: " + selected.title + " | Vote & verify: " + APP_URL + "/vote/" + selected._id)}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.8rem", borderRadius: "6px", background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25d366", fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", textDecoration: "none" }}>? WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Fact-check this claim: " + selected.title + " | Verdict recorded on blockchain ? #VerifyIt #FactCheck")}&url=${encodeURIComponent(APP_URL + "/vote/" + selected._id)}`} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.8rem", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", textDecoration: "none" }}>? X / Twitter</a>
              <button onClick={() => { navigator.clipboard.writeText(APP_URL + "/vote/" + selected._id); alert("Link copied!"); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.8rem", borderRadius: "6px", background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: "#00f5ff", fontFamily: "Share Tech Mono,monospace", fontSize: "0.65rem", cursor: "pointer" }}>? Copy Link</button>
            </div>
            <AIAnalysis claim={selected} />
            <Timeline claim={selected} />
            {msg && <div className={`vp-msg ${msg.type}`}>{msg.text}</div>}
            <div className="vp-bar"><div className="vp-bar-fill" style={{ width: `${pct}%` }} /></div>
            <div className="vp-stats">
              <span style={{ color: "#00ff88" }}>TRUE {tv} ({pct}%)</span>
              <span style={{ color: "#ff3366" }}>FALSE {fv} ({100 - pct}%)</span>
            </div>
            {alreadyVoted ? (
              <div className="vp-voted-tag">? YOU HAVE VOTED ON THIS CLAIM</div>
            ) : (
              <div className="vp-actions">
                <button className="vp-vote-true" onClick={() => vote(selected._id, "true")} disabled={voting}>
                  {voting ? "RECORDING..." : "VOTE TRUE"}
                </button>
                <button className="vp-vote-false" onClick={() => vote(selected._id, "false")} disabled={voting}>
                  {voting ? "RECORDING..." : "VOTE FALSE"}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  if (id && !selected) return (
    <><style>{css}</style>
      {bcConfirm && <BlockchainConfirm verdict={bcConfirm.verdict} claimId={bcConfirm.claimId} onDone={() => setBcConfirm(null)} />}
      <div className="vp">
        <button className="vp-back" onClick={() => navigate("/vote")}>? Back</button>
        <div className="vp-empty"><span className="vp-empty-icon">?</span><div className="vp-empty-title">Claim Not Found</div></div>
      </div>
    </>
  );

  return (
    <><style>{css}</style>
      {bcConfirm && <BlockchainConfirm verdict={bcConfirm.verdict} claimId={bcConfirm.claimId} onDone={() => setBcConfirm(null)} />}
      {verdictReveal && (
        <div className="vp-reveal-overlay" onClick={() => setVerdictReveal(null)}>
          <div className="vp-reveal-box">
            <span className="vp-reveal-emoji">{revealEmoji}</span>
            <div className="vp-reveal-label" style={{ color: revealColor }}>{revealText}</div>
            <div className="vp-reveal-sub">VERDICT LOCKED ON-CHAIN · TAP TO DISMISS</div>
          </div>
        </div>
      )}
      <div className="vp">
        <div className="vp-hdr">
          <div className="vp-title">Vote on Claims</div>
          <Link to="/submit" className="vp-sub-btn">+ Submit Claim</Link>
        </div>
        {msg && <div className={`vp-msg ${msg.type}`} style={{ marginBottom: "1rem" }}>{msg.text}</div>}
        {claims.length === 0 ? (
          <div className="vp-empty">
            <span className="vp-empty-icon">?</span>
            <div className="vp-empty-title">No Claims Yet</div>
            <Link to="/submit" className="vp-sub-btn">Submit a Claim</Link>
          </div>
        ) : (
          <div className="vp-grid">
            {claims.map(claim => {
              const tv = claim.votes?.true || 0;
              const fv = claim.votes?.false || 0;
              const total = tv + fv;
              const pct = total > 0 ? Math.round(tv / total * 100) : 50;
              const v = getVerdict(claim.verdict);
              const vClass = (claim.verdict || "").toUpperCase() === "TRUE" ? "v-true" : (claim.verdict || "").toUpperCase() === "FALSE" ? "v-false" : "v-pending";
              const alreadyVoted = hasVoted(claim._id);
              return (
                <div key={claim._id} className={`vp-card ${vClass}`}>
                  <div className="vp-ctop">
                    <span className={`vp-badge ${v.cls}`}>{v.label}</span>
                    <span className="vp-id">#{(claim._id || "").slice(-6)}</span>
                  </div>
                  <div className="vp-ctitle">{claim.title}</div>
                  <div className="vp-cdesc">{(claim.description || "").slice(0, 90)}...</div>
                  <div className="vp-cbar"><div className="vp-cbar-fill" style={{ width: `${pct}%` }} /></div>
                  <div className="vp-cstats">
                    <span style={{ color: "#00ff88" }}>{tv} true</span>
                    <span style={{ color: "#ff3366" }}>{fv} false</span>
                  </div>
                  <div className="vp-cbtns">
                    {alreadyVoted ? (
                      <span style={{ flex: 1, textAlign: "center", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", color: "#00f5ff" }}>? VOTED</span>
                    ) : (
                      <>
                        <button className="vp-bt vp-bt-t" onClick={() => vote(claim._id, "true")} disabled={voting}>TRUE</button>
                        <button className="vp-bt vp-bt-f" onClick={() => vote(claim._id, "false")} disabled={voting}>FALSE</button>
                      </>
                    )}
                    <Link to={`/vote/${claim._id}`} className="vp-bt vp-bt-d">Details</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
