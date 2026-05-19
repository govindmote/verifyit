import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');

    .hw-wrap { max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem 4rem; }

    /* â”€â”€ hero â”€â”€ */
    .hw-hero { text-align: center; margin-bottom: 4rem; position: relative; }
    .hw-hero::before { content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(0,245,255,0.06) 0%, transparent 70%);
      pointer-events: none; }
    .hw-tag { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.3rem 1rem;
      background: rgba(0,245,255,0.06); border: 1px solid rgba(0,245,255,0.15); border-radius: 20px;
      font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; color: #00f5ff;
      letter-spacing: 0.15em; margin-bottom: 1.5rem; }
    .hw-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ff88; animation: hwpulse 2s infinite; }
    @keyframes hwpulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
    .hw-title { font-family: 'Orbitron', monospace; font-size: 2.5rem; font-weight: 900;
      background: linear-gradient(135deg, #00f5ff, #7c3aed);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      margin-bottom: 1rem; letter-spacing: 0.05em; }
    .hw-sub { font-family: 'Exo 2', sans-serif; font-size: 1rem; color: rgba(100,116,139,0.8);
      max-width: 600px; margin: 0 auto; line-height: 1.7; }

    /* â”€â”€ section titles â”€â”€ */
    .hw-section { margin-bottom: 4rem; }
    .hw-section-title { font-family: 'Orbitron', monospace; font-size: 0.85rem; font-weight: 700;
      color: #00f5ff; text-transform: uppercase; letter-spacing: 0.12em;
      border-left: 3px solid #00f5ff; padding-left: 0.75rem; margin-bottom: 0.4rem; }
    .hw-section-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem;
      color: rgba(100,116,139,0.6); padding-left: 1rem; margin-bottom: 2rem; }

    /* â”€â”€ steps flow â”€â”€ */
    .hw-steps { display: flex; flex-direction: column; gap: 0; position: relative; }
    .hw-steps::before { content: ''; position: absolute; left: 28px; top: 40px; bottom: 40px; width: 2px;
      background: linear-gradient(180deg, #00f5ff, #7c3aed, #ff3366, #00ff88, #ffd700); opacity: 0.3; }
    .hw-step { display: flex; gap: 1.5rem; align-items: flex-start; padding: 1.5rem;
      background: var(--surface, rgba(15,22,41,0.95)); border: 1px solid rgba(26,39,68,0.8);
      border-radius: 16px; margin-bottom: 1rem; position: relative; transition: border-color 0.2s, transform 0.2s; }
    .hw-step:hover { border-color: rgba(0,245,255,0.2); transform: translateX(4px); }
    .hw-step-num { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 900;
      flex-shrink: 0; position: relative; z-index: 1; }
    .hw-step-num.c1 { background: rgba(0,245,255,0.1); border: 2px solid rgba(0,245,255,0.4); color: #00f5ff; }
    .hw-step-num.c2 { background: rgba(124,58,237,0.1); border: 2px solid rgba(124,58,237,0.4); color: #a78bfa; }
    .hw-step-num.c3 { background: rgba(255,51,102,0.1); border: 2px solid rgba(255,51,102,0.4); color: #ff3366; }
    .hw-step-num.c4 { background: rgba(0,255,136,0.1); border: 2px solid rgba(0,255,136,0.4); color: #00ff88; }
    .hw-step-num.c5 .hw-step-num.c6 { background: rgba(255,127,0,0.1); border: 2px solid rgba(255,127,0,0.4); color: #ff7f00; }{ background: rgba(255,215,0,0.1); border: 2px solid rgba(255,215,0,0.4); color: #ffd700; }
    .hw-step-body { flex: 1; }
    .hw-step-title { font-family: 'Orbitron', monospace; font-size: 0.85rem; font-weight: 700;
      color: #e2e8f0; margin-bottom: 0.4rem; }
    .hw-step-desc { font-family: 'Exo 2', sans-serif; font-size: 0.82rem; color: rgba(100,116,139,0.8);
      line-height: 1.7; margin-bottom: 0.6rem; }
    .hw-step-code { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem;
      color: rgba(0,245,255,0.6); background: rgba(0,245,255,0.04); border: 1px solid rgba(0,245,255,0.1);
      border-radius: 6px; padding: 0.5rem 0.85rem; display: inline-block; }

    /* â”€â”€ weighted voting visual â”€â”€ */
    .hw-weight-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
    .hw-weight-card { background: var(--surface, rgba(15,22,41,0.95));
      border: 1px solid rgba(26,39,68,0.8); border-radius: 16px; padding: 1.5rem; }
    .hw-weight-title { font-family: 'Orbitron', monospace; font-size: 0.72rem; color: #00f5ff;
      letter-spacing: 0.1em; margin-bottom: 1.2rem; }
    .hw-voter { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.85rem; }
    .hw-voter-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-family: 'Orbitron', monospace; font-size: 0.7rem; font-weight: 900; flex-shrink: 0; }
    .hw-voter-info { flex: 1; }
    .hw-voter-name { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #e2e8f0; margin-bottom: 2px; }
    .hw-voter-bar-wrap { display: flex; align-items: center; gap: 0.5rem; }
    .hw-voter-bar { flex: 1; height: 4px; background: rgba(26,39,68,0.9); border-radius: 2px; overflow: hidden; }
    .hw-voter-bar-fill { height: 100%; border-radius: 2px; }
    .hw-voter-weight { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: rgba(100,116,139,0.6); }
    .hw-verdict-result { background: rgba(0,255,136,0.06); border: 1px solid rgba(0,255,136,0.2);
      border-radius: 10px; padding: 1rem; text-align: center; margin-top: 1rem; }
    .hw-verdict-label { font-family: 'Orbitron', monospace; font-size: 0.72rem; color: #00ff88; letter-spacing: 0.1em; }
    .hw-verdict-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: rgba(100,116,139,0.6); margin-top: 3px; }

    /* â”€â”€ comparison table â”€â”€ */
    .hw-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .hw-compare-card { background: var(--surface, rgba(15,22,41,0.95));
      border-radius: 16px; padding: 1.5rem; }
    .hw-compare-card.bad { border: 1px solid rgba(255,51,102,0.25); }
    .hw-compare-card.good { border: 1px solid rgba(0,255,136,0.25); }
    .hw-compare-title { font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 0.1em;
      margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
    .hw-compare-title.bad { color: #ff3366; }
    .hw-compare-title.good { color: #00ff88; }
    .hw-compare-item { display: flex; align-items: flex-start; gap: 0.6rem; margin-bottom: 0.75rem;
      font-family: 'Exo 2', sans-serif; font-size: 0.8rem; color: rgba(100,116,139,0.8); line-height: 1.5; }
    .hw-compare-icon { flex-shrink: 0; margin-top: 2px; }

    /* â”€â”€ blockchain flow â”€â”€ */
    .hw-chain-flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
    .hw-chain-node { background: var(--surface, rgba(15,22,41,0.95));
      border: 1px solid rgba(26,39,68,0.8); border-radius: 12px; padding: 1.2rem 1.5rem;
      text-align: center; flex: 1; min-width: 140px; }
    .hw-chain-node-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .hw-chain-node-title { font-family: 'Orbitron', monospace; font-size: 0.65rem; color: #00f5ff;
      letter-spacing: 0.08em; margin-bottom: 0.3rem; }
    .hw-chain-node-desc { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem;
      color: rgba(100,116,139,0.6); line-height: 1.5; }
    .hw-chain-arrow { font-size: 1.2rem; color: rgba(0,245,255,0.4); padding: 0 0.5rem; flex-shrink: 0; }

    /* â”€â”€ reputation table â”€â”€ */
    .hw-rep-table { width: 100%; border-collapse: collapse; }
    .hw-rep-table th { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem;
      color: rgba(100,116,139,0.6); text-transform: uppercase; letter-spacing: 0.1em;
      padding: 0.75rem 1rem; border-bottom: 1px solid rgba(26,39,68,0.8); text-align: left; }
    .hw-rep-table td { font-family: 'Exo 2', sans-serif; font-size: 0.8rem; color: #e2e8f0;
      padding: 0.85rem 1rem; border-bottom: 1px solid rgba(26,39,68,0.4); }
    .hw-rep-table tr:last-child td { border-bottom: none; }
    .hw-rep-table tr:hover td { background: rgba(0,245,255,0.02); }
    .hw-rep-wrap { background: var(--surface, rgba(15,22,41,0.95));
      border: 1px solid rgba(26,39,68,0.8); border-radius: 16px; overflow: hidden; }

    /* â”€â”€ CTA â”€â”€ */
    .hw-cta { background: var(--surface, rgba(15,22,41,0.95));
      border: 1px solid rgba(0,245,255,0.15); border-radius: 20px; padding: 3rem 2rem;
      text-align: center; position: relative; overflow: hidden; }
    .hw-cta::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent); }
    .hw-cta-title { font-family: 'Orbitron', monospace; font-size: 1.3rem; font-weight: 900;
      color: #00f5ff; margin-bottom: 0.75rem; letter-spacing: 0.08em; }
    .hw-cta-sub { font-family: 'Exo 2', sans-serif; font-size: 0.88rem; color: rgba(100,116,139,0.7);
      margin-bottom: 2rem; }
    .hw-cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .hw-btn-p { padding: 0.75rem 1.8rem; background: linear-gradient(135deg, #00f5ff, #0088bb);
      border: none; border-radius: 10px; color: #000; font-family: 'Orbitron', monospace;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; cursor: pointer;
      text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; display: inline-block; }
    .hw-btn-p:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,245,255,0.3); }
    .hw-btn-o { padding: 0.75rem 1.8rem; background: transparent;
      border: 1px solid rgba(0,245,255,0.3); border-radius: 10px; color: #00f5ff;
      font-family: 'Orbitron', monospace; font-size: 0.72rem; font-weight: 700;
      letter-spacing: 0.08em; cursor: pointer; text-decoration: none;
      transition: all 0.2s; display: inline-block; }
    .hw-btn-o:hover { background: rgba(0,245,255,0.06); border-color: #00f5ff; }

    /* light theme */
    [data-theme="light"] .hw-step, [data-theme="light"] .hw-weight-card,
    [data-theme="light"] .hw-compare-card, [data-theme="light"] .hw-chain-node,
    [data-theme="light"] .hw-rep-wrap, [data-theme="light"] .hw-cta {
      background: #ffffff; border-color: rgba(0,0,0,0.1); }
    [data-theme="light"] .hw-step-title, [data-theme="light"] .hw-chain-node-title { color: #1e293b; }
    [data-theme="light"] .hw-rep-table td { color: #1e293b; }
    [data-theme="light"] .hw-rep-table th { border-color: rgba(0,0,0,0.1); }
    [data-theme="light"] .hw-rep-table td { border-color: rgba(0,0,0,0.06); }
    [data-theme="light"] .hw-steps::before { opacity: 0.15; }
  `;

  const steps = [
    {
      num: "01", cls: "c1",
      title: "SUBMIT A CLAIM",
      desc: "Any user can submit a news claim, rumor, or viral post with a title, description, and optional source URL. The claim is stored in MongoDB and assigned a unique blockchain ID.",
      code: "POST /api/claims â†’ MongoDB â†’ Claim ID generated"
    },
    {
      num: "02", cls: "c2",
      title: "AI PRE-SCREENING",
      desc: "Before community voting begins, our AI engine analyzes the claim using pattern recognition — checking for sensational language, misinformation markers, source credibility, and known false claim structures. It gives an instant preliminary verdict with confidence score.",
      code: "analyzePatterns(claim) → verdict + confidence% + flags"
    },
    {
      num: "03", cls: "c3",
      title: "COMMUNITY VOTES",
      desc: "Registered users vote TRUE or FALSE on each claim. Each vote carries a weight based on the voter's reputation score â€” users who have historically predicted verdicts correctly carry more weight.",
      code: "Vote weight = max(0.1, min(5.0, user.reputation))"
    },
    {
      num: "03", cls: "c3",
      title: "WEIGHTED VERDICT CALCULATION",
      desc: "Once 3+ weighted votes are cast, the system calculates verdict automatically. If weighted TRUE votes exceed 60%, verdict is VERIFIED TRUE. If FALSE votes exceed 60%, verdict is MARKED FALSE.",
      code: "if (trueWeight / total >= 0.6) â†’ verdict = TRUE"
    },
    {
      num: "04", cls: "c4",
      title: "BLOCKCHAIN RECORDING",
      desc: "Finalized verdicts are permanently written to the Polygon Amoy blockchain via a Solidity smart contract. The transaction hash is stored and publicly verifiable on PolygonScan.",
      code: "storeVerdict(claimId, title, verdict) â†’ TX Hash"
    },
    {
      num: "05", cls: "c5",
      title: "ADMIN OVERRIDE (IF NEEDED)",
      desc: "When community consensus is wrong due to misinformation spread, an administrator can manually override the verdict with a documented reason â€” ensuring expert correction with full transparency.",
      code: "POST /api/admin/override â†’ verdict + reason logged"
    },
  ];

  const voters = [
    { name: "Alice", rep: 2.4, weight: 2.4, vote: "TRUE", color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.4)" },
    { name: "Bob", rep: 0.8, weight: 0.8, vote: "FALSE", color: "#ff3366", bg: "rgba(255,51,102,0.1)", border: "rgba(255,51,102,0.4)" },
    { name: "Carol", rep: 1.5, weight: 1.5, vote: "TRUE", color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.4)" },
    { name: "Dave", rep: 1.0, weight: 1.0, vote: "TRUE", color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.4)" },
  ];

  const chainNodes = [
    { icon: "ðŸ“", title: "SUBMIT", desc: "User submits claim to backend" },
    { icon: "ðŸ—³ï¸", title: "VOTE", desc: "Community casts weighted votes" },
    { icon: "âš–ï¸", title: "VERDICT", desc: "System auto-calculates result" },
    { icon: "â›“", title: "ON-CHAIN", desc: "Polygon Amoy records verdict" },
    { icon: "ðŸ”", title: "VERIFY", desc: "Anyone can verify on PolygonScan" },
  ];

  const repRows = [
    { range: "â‰¥ 1.5", label: "TRUSTED", color: "#00ff88", desc: "High accuracy, many correct predictions", effect: "Votes count up to 5Ã— more" },
    { range: "1.0 â€“ 1.5", label: "STANDARD", color: "#00f5ff", desc: "New user or moderate accuracy", effect: "Votes count at face value" },
    { range: "0.7 â€“ 1.0", label: "CAUTION", color: "#ffd700", desc: "Several wrong predictions", effect: "Votes count slightly less" },
    { range: "< 0.7", label: "LOW", color: "#ff3366", desc: "Frequent incorrect predictions", effect: "Votes carry minimal weight" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="hw-wrap">

        {/* Hero */}
        <div className="hw-hero">
          <div className="hw-tag"><span className="hw-dot" />SYSTEM DOCUMENTATION</div>
          <div className="hw-title">How VerifyIt Works</div>
          <div className="hw-sub">
            A decentralized fact-checking system combining community intelligence,
            reputation-weighted voting, and blockchain immutability.
          </div>
        </div>

        {/* Step by step */}
        <div className="hw-section">
          <div className="hw-section-title">The 5-Step Process</div>
          <div className="hw-section-sub">// from claim submission to blockchain-recorded verdict</div>
          <div className="hw-steps">
            {steps.map(s => (
              <div className="hw-step" key={s.num}>
                <div className={`hw-step-num ${s.cls}`}>{s.num}</div>
                <div className="hw-step-body">
                  <div className="hw-step-title">{s.title}</div>
                  <div className="hw-step-desc">{s.desc}</div>
                  <div className="hw-step-code">{s.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weighted voting visual */}
        <div className="hw-section">
          <div className="hw-section-title">Weighted Voting Explained</div>
          <div className="hw-section-sub">// reputation determines how much each vote counts</div>
          <div className="hw-weight-grid">
            <div className="hw-weight-card">
              <div className="hw-weight-title">EXAMPLE: 4 VOTERS ON ONE CLAIM</div>
              {voters.map(v => (
                <div className="hw-voter" key={v.name}>
                  <div className="hw-voter-avatar" style={{ background: v.bg, border: `2px solid ${v.border}`, color: v.color }}>
                    {v.name[0]}
                  </div>
                  <div className="hw-voter-info">
                    <div className="hw-voter-name">{v.name} â€” voted {v.vote} &nbsp;
                      <span style={{ color: v.color, fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem" }}>
                        (rep: {v.rep})
                      </span>
                    </div>
                    <div className="hw-voter-bar-wrap">
                      <div className="hw-voter-bar">
                        <div className="hw-voter-bar-fill" style={{
                          width: `${(v.weight / 5) * 100}%`,
                          background: v.color
                        }} />
                      </div>
                      <span className="hw-voter-weight">weight: {v.weight}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hw-weight-card">
              <div className="hw-weight-title">WEIGHTED CALCULATION</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", lineHeight: 2 }}>
                <div style={{ color: "#00ff88" }}>TRUE votes:</div>
                <div style={{ color: "rgba(100,116,139,0.8)", paddingLeft: "1rem" }}>
                  Alice (2.4) + Carol (1.5) + Dave (1.0) = <span style={{ color: "#00ff88" }}>4.9</span>
                </div>
                <div style={{ color: "#ff3366", marginTop: "0.5rem" }}>FALSE votes:</div>
                <div style={{ color: "rgba(100,116,139,0.8)", paddingLeft: "1rem" }}>
                  Bob (0.8) = <span style={{ color: "#ff3366" }}>0.8</span>
                </div>
                <div style={{ borderTop: "1px solid rgba(26,39,68,0.8)", marginTop: "1rem", paddingTop: "1rem" }}>
                  <div style={{ color: "#e2e8f0" }}>True %: 4.9 / 5.7 = <span style={{ color: "#00ff88" }}>86%</span></div>
                  <div style={{ color: "#e2e8f0", marginTop: "0.25rem" }}>Threshold: â‰¥ 60%</div>
                </div>
                <div className="hw-verdict-result" style={{ marginTop: "1rem" }}>
                  <div className="hw-verdict-label">âœ“ VERDICT: VERIFIED TRUE</div>
                  <div className="hw-verdict-sub">Expert voters outweighed low-rep voters</div>
                </div>
              </div>
            </div>
          </div>

          {/* Without weighted system comparison */}
          <div className="hw-compare">
            <div className="hw-compare-card bad">
              <div className="hw-compare-title bad">âœ— WITHOUT WEIGHTED VOTING</div>
              {[
                "Simple majority â€” 1 vote = 1 vote",
                "A bot army or misinformed users can manipulate verdict",
                "New users have same power as trusted experts",
                "Wrong verdicts get permanently recorded on blockchain",
              ].map((t, i) => (
                <div className="hw-compare-item" key={i}>
                  <span className="hw-compare-icon" style={{ color: "#ff3366" }}>âœ—</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="hw-compare-card good">
              <div className="hw-compare-title good">âœ“ WITH WEIGHTED VOTING</div>
              {[
                "Reputation-weighted â€” accuracy determines influence",
                "Users who predict correctly gain more voting power",
                "Bad actors and new bots have minimal impact",
                "System self-corrects over time through reputation",
              ].map((t, i) => (
                <div className="hw-compare-item" key={i}>
                  <span className="hw-compare-icon" style={{ color: "#00ff88" }}>âœ“</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blockchain flow */}
        <div className="hw-section">
          <div className="hw-section-title">Blockchain Architecture</div>
          <div className="hw-section-sub">// every verdict is permanently immutable on Polygon Amoy</div>
          <div className="hw-chain-flow">
            {chainNodes.map((n, i) => (
              <React.Fragment key={n.title}>
                <div className="hw-chain-node">
                  <div className="hw-chain-node-icon">{n.icon}</div>
                  <div className="hw-chain-node-title">{n.title}</div>
                  <div className="hw-chain-node-desc">{n.desc}</div>
                </div>
                {i < chainNodes.length - 1 && <div className="hw-chain-arrow">â†’</div>}
              </React.Fragment>
            ))}
          </div>
          <div style={{ marginTop: "1rem", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
            color: "rgba(100,116,139,0.5)", textAlign: "center" }}>
            Smart contract deployed on Polygon Amoy Testnet Â· Verified on PolygonScan Â· Gas fees paid in MATIC
          </div>
        </div>

        {/* Reputation table */}
        <div className="hw-section">
          <div className="hw-section-title">Reputation Score System</div>
          <div className="hw-section-sub">// correct predictions increase weight, wrong ones decrease it</div>
          <div className="hw-rep-wrap">
            <table className="hw-rep-table">
              <thead>
                <tr>
                  <th>Score Range</th>
                  <th>Status</th>
                  <th>Meaning</th>
                  <th>Vote Effect</th>
                </tr>
              </thead>
              <tbody>
                {repRows.map(r => (
                  <tr key={r.label}>
                    <td><span style={{ fontFamily: "'Share Tech Mono',monospace", color: r.color }}>{r.range}</span></td>
                    <td><span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
                      color: r.color, background: `${r.color}15`, border: `1px solid ${r.color}40`,
                      padding: "0.15rem 0.5rem", borderRadius: "4px" }}>{r.label}</span></td>
                    <td style={{ color: "rgba(100,116,139,0.8)" }}>{r.desc}</td>
                    <td style={{ color: "rgba(100,116,139,0.8)" }}>{r.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "1rem", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem",
            color: "rgba(100,116,139,0.5)" }}>
            // Reputation changes: +0.10 for correct verdict prediction Â· -0.05 for wrong prediction Â· Capped at 5.0 max
          </div>
        </div>

        {/* CTA */}
        <div className="hw-cta">
          <div className="hw-cta-title">Ready to Verify Claims?</div>
          <div className="hw-cta-sub">Join the decentralized fact-checking network. Submit claims, vote, build reputation.</div>
          <div className="hw-cta-btns">
            <Link to="/submit" className="hw-btn-p">ðŸ“ Submit a Claim</Link>
            <Link to="/vote" className="hw-btn-o">ðŸ—³ Vote on Claims</Link>
            <Link to="/dashboard" className="hw-btn-o">ðŸ“Š View Dashboard</Link>
          </div>
        </div>

      </div>
    </>
  );
}

