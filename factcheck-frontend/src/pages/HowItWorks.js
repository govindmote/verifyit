import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');
    .hw-wrap{max-width:1100px;margin:0 auto;padding:2.5rem 2rem 4rem;}
    .hw-hero{text-align:center;margin-bottom:4rem;}
    .hw-tag{display:inline-flex;align-items:center;gap:0.5rem;padding:0.3rem 1rem;background:rgba(0,245,255,0.06);border:1px solid rgba(0,245,255,0.15);border-radius:20px;font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:#00f5ff;letter-spacing:0.15em;margin-bottom:1.5rem;}
    .hw-dot{width:6px;height:6px;border-radius:50%;background:#00ff88;animation:hwpulse 2s infinite;}
    @keyframes hwpulse{0%,100%{opacity:1;}50%{opacity:0.3;}}
    .hw-title{font-family:'Orbitron',monospace;font-size:2.5rem;font-weight:900;background:linear-gradient(135deg,#00f5ff,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1rem;letter-spacing:0.05em;}
    .hw-sub{font-family:'Exo 2',sans-serif;font-size:1rem;color:rgba(100,116,139,0.8);max-width:600px;margin:0 auto;line-height:1.7;}
    .hw-section{margin-bottom:4rem;}
    .hw-section-title{font-family:'Orbitron',monospace;font-size:0.85rem;font-weight:700;color:#00f5ff;text-transform:uppercase;letter-spacing:0.12em;border-left:3px solid #00f5ff;padding-left:0.75rem;margin-bottom:0.4rem;}
    .hw-section-sub{font-family:'Share Tech Mono',monospace;font-size:0.68rem;color:rgba(100,116,139,0.6);padding-left:1rem;margin-bottom:2rem;}
    .hw-steps{display:flex;flex-direction:column;gap:1rem;}
    .hw-step{display:flex;gap:1.5rem;align-items:flex-start;padding:1.5rem;background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;transition:border-color 0.2s,transform 0.2s;}
    .hw-step:hover{border-color:rgba(0,245,255,0.2);transform:translateX(4px);}
    .hw-step-num{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:1.1rem;font-weight:900;flex-shrink:0;}
    .hw-step-num.c1{background:rgba(0,245,255,0.1);border:2px solid rgba(0,245,255,0.4);color:#00f5ff;}
    .hw-step-num.c2{background:rgba(124,58,237,0.1);border:2px solid rgba(124,58,237,0.4);color:#a78bfa;}
    .hw-step-num.c3{background:rgba(255,51,102,0.1);border:2px solid rgba(255,51,102,0.4);color:#ff3366;}
    .hw-step-num.c4{background:rgba(0,255,136,0.1);border:2px solid rgba(0,255,136,0.4);color:#00ff88;}
    .hw-step-num.c5{background:rgba(255,215,0,0.1);border:2px solid rgba(255,215,0,0.4);color:#ffd700;}
    .hw-step-body{flex:1;}
    .hw-step-title{font-family:'Orbitron',monospace;font-size:0.85rem;font-weight:700;color:#e2e8f0;margin-bottom:0.4rem;}
    .hw-step-desc{font-family:'Exo 2',sans-serif;font-size:0.82rem;color:rgba(100,116,139,0.8);line-height:1.7;margin-bottom:0.6rem;}
    .hw-step-code{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:rgba(0,245,255,0.6);background:rgba(0,245,255,0.04);border:1px solid rgba(0,245,255,0.1);border-radius:6px;padding:0.5rem 0.85rem;display:inline-block;}
    .hw-chain-flow{display:flex;align-items:center;gap:0;flex-wrap:wrap;margin-bottom:1rem;}
    .hw-chain-node{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:12px;padding:1.2rem 1.5rem;text-align:center;flex:1;min-width:140px;}
    .hw-chain-node-icon{font-size:1.8rem;margin-bottom:0.5rem;}
    .hw-chain-node-title{font-family:'Orbitron',monospace;font-size:0.65rem;color:#00f5ff;letter-spacing:0.08em;margin-bottom:0.3rem;}
    .hw-chain-node-desc{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:rgba(100,116,139,0.6);line-height:1.5;}
    .hw-chain-arrow{font-size:1.2rem;color:rgba(0,245,255,0.4);padding:0 0.5rem;flex-shrink:0;}
    .hw-rep-wrap{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(26,39,68,0.8);border-radius:16px;overflow:hidden;}
    .hw-rep-table{width:100%;border-collapse:collapse;}
    .hw-rep-table th{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.6);text-transform:uppercase;letter-spacing:0.1em;padding:0.75rem 1rem;border-bottom:1px solid rgba(26,39,68,0.8);text-align:left;}
    .hw-rep-table td{font-family:'Exo 2',sans-serif;font-size:0.8rem;color:#e2e8f0;padding:0.85rem 1rem;border-bottom:1px solid rgba(26,39,68,0.4);}
    .hw-rep-table tr:last-child td{border-bottom:none;}
    .hw-cta{background:var(--surface,rgba(15,22,41,0.95));border:1px solid rgba(0,245,255,0.15);border-radius:20px;padding:3rem 2rem;text-align:center;position:relative;overflow:hidden;}
    .hw-cta::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,245,255,0.5),transparent);}
    .hw-cta-title{font-family:'Orbitron',monospace;font-size:1.3rem;font-weight:900;color:#00f5ff;margin-bottom:0.75rem;letter-spacing:0.08em;}
    .hw-cta-sub{font-family:'Exo 2',sans-serif;font-size:0.88rem;color:rgba(100,116,139,0.7);margin-bottom:2rem;}
    .hw-cta-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
    .hw-btn-p{padding:0.75rem 1.8rem;background:linear-gradient(135deg,#00f5ff,#0088bb);border:none;border-radius:10px;color:#000;font-family:'Orbitron',monospace;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;cursor:pointer;text-decoration:none;transition:transform 0.2s;display:inline-block;}
    .hw-btn-p:hover{transform:translateY(-2px);}
    .hw-btn-o{padding:0.75rem 1.8rem;background:transparent;border:1px solid rgba(0,245,255,0.3);border-radius:10px;color:#00f5ff;font-family:'Orbitron',monospace;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;cursor:pointer;text-decoration:none;transition:all 0.2s;display:inline-block;}
    .hw-btn-o:hover{background:rgba(0,245,255,0.06);border-color:#00f5ff;}
    [data-theme="light"] .hw-step,[data-theme="light"] .hw-chain-node,[data-theme="light"] .hw-rep-wrap,[data-theme="light"] .hw-cta{background:#ffffff;border-color:rgba(0,0,0,0.1);}
    [data-theme="light"] .hw-step-title{color:#1e293b;}
    [data-theme="light"] .hw-rep-table td{color:#1e293b;border-color:rgba(0,0,0,0.06);}
    [data-theme="light"] .hw-rep-table th{border-color:rgba(0,0,0,0.1);}
  `;

  const steps = [
    { num:"01", cls:"c1", title:"SUBMIT A CLAIM", desc:"Any user can submit a news claim, rumor, or viral post with a title, description, and optional source URL. The claim is stored in MongoDB and assigned a unique blockchain ID.", code:"POST /api/claims -> MongoDB -> Claim ID generated" },
    { num:"02", cls:"c2", title:"COMMUNITY VOTES", desc:"Registered users vote TRUE or FALSE on each claim. Each vote carries a weight based on the voter reputation score — users who have historically predicted verdicts correctly carry more weight.", code:"Vote weight = max(0.1, min(5.0, user.reputation))" },
    { num:"03", cls:"c3", title:"WEIGHTED VERDICT CALCULATION", desc:"Once 3+ weighted votes are cast, the system calculates verdict automatically. If weighted TRUE votes exceed 60%, verdict is VERIFIED TRUE. If FALSE votes exceed 60%, verdict is MARKED FALSE.", code:"if (trueWeight / total >= 0.6) -> verdict = TRUE" },
    { num:"04", cls:"c4", title:"BLOCKCHAIN RECORDING", desc:"Finalized verdicts are permanently written to the Polygon Amoy blockchain via a Solidity smart contract. The transaction hash is stored and publicly verifiable on PolygonScan.", code:"storeVerdict(claimId, title, verdict) -> TX Hash" },
    { num:"05", cls:"c5", title:"VERIFY ON-CHAIN", desc:"Anyone in the world can verify the verdict by clicking the transaction hash link and checking the Polygon Amoy blockchain explorer. The verdict is permanent and tamper-proof.", code:"amoy.polygonscan.com/tx/0x..." },
  ];

  const chainNodes = [
    { icon:"📝", title:"SUBMIT", desc:"User submits claim to backend" },
    { icon:"🗳️", title:"VOTE", desc:"Community casts weighted votes" },
    { icon:"⚖️", title:"VERDICT", desc:"System auto-calculates result" },
    { icon:"⛓", title:"ON-CHAIN", desc:"Polygon Amoy records verdict" },
    { icon:"🔍", title:"VERIFY", desc:"Anyone can verify on PolygonScan" },
  ];

  const repRows = [
    { range:">= 1.5", label:"TRUSTED",  color:"#00ff88", desc:"High accuracy, many correct predictions", effect:"Votes count up to 5x more" },
    { range:"1.0–1.5", label:"STANDARD", color:"#00f5ff", desc:"New user or moderate accuracy",           effect:"Votes count at face value" },
    { range:"0.7–1.0", label:"CAUTION",  color:"#ffd700", desc:"Several wrong predictions",               effect:"Votes count slightly less" },
    { range:"< 0.7",   label:"LOW",      color:"#ff3366", desc:"Frequent incorrect predictions",          effect:"Votes carry minimal weight" },
  ];

  const withoutItems = [
    "Simple majority — 1 vote = 1 vote",
    "A bot army or misinformed users can manipulate verdict",
    "New users have same power as trusted experts",
    "Wrong verdicts get permanently recorded on blockchain",
  ];

  const withItems = [
    "Reputation-weighted — accuracy determines influence",
    "Users who predict correctly gain more voting power",
    "Bad actors and new bots have minimal impact",
    "System self-corrects over time through reputation",
  ];

  const voters = [
    { name:"Alice", rep:2.4, vote:"TRUE",  color:"#00ff88" },
    { name:"Bob",   rep:0.8, vote:"FALSE", color:"#ff3366" },
    { name:"Carol", rep:1.5, vote:"TRUE",  color:"#00ff88" },
    { name:"Dave",  rep:1.0, vote:"TRUE",  color:"#00ff88" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="hw-wrap">

        <div className="hw-hero">
          <div className="hw-tag"><span className="hw-dot" />SYSTEM DOCUMENTATION</div>
          <div className="hw-title">How VerifyIt Works</div>
          <div className="hw-sub">A decentralized fact-checking system combining community intelligence, reputation-weighted voting, and blockchain immutability.</div>
        </div>

        <div className="hw-section">
          <div className="hw-section-title">The 5-Step Process</div>
          <div className="hw-section-sub">// from claim submission to blockchain-recorded verdict</div>
          <div className="hw-steps">
            {steps.map(s => (
              <div className="hw-step" key={s.num}>
                <div className={"hw-step-num " + s.cls}>{s.num}</div>
                <div className="hw-step-body">
                  <div className="hw-step-title">{s.title}</div>
                  <div className="hw-step-desc">{s.desc}</div>
                  <div className="hw-step-code">{s.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                {i < chainNodes.length - 1 && <div className="hw-chain-arrow">&#8594;</div>}
              </React.Fragment>
            ))}
          </div>
          <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"rgba(100,116,139,0.5)",textAlign:"center"}}>
            Smart contract deployed on Polygon Amoy Testnet &middot; Verified on PolygonScan &middot; Gas fees paid in MATIC
          </div>
        </div>

        <div className="hw-section">
          <div className="hw-section-title">Weighted Voting Explained</div>
          <div className="hw-section-sub">// reputation determines how much each vote counts</div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginBottom:"1.5rem"}}>
            <div style={{background:"var(--surface,rgba(15,22,41,0.95))",border:"1px solid rgba(255,51,102,0.25)",borderRadius:"16px",padding:"1.5rem"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",color:"#ff3366",letterSpacing:"0.1em",marginBottom:"1.2rem"}}>&#10007; WITHOUT WEIGHTED VOTING</div>
              {withoutItems.map((t, i) => (
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"0.6rem",marginBottom:"0.75rem",fontFamily:"'Exo 2',sans-serif",fontSize:"0.8rem",color:"rgba(100,116,139,0.8)",lineHeight:1.5}}>
                  <span style={{color:"#ff3366",flexShrink:0}}>&#10007;</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div style={{background:"var(--surface,rgba(15,22,41,0.95))",border:"1px solid rgba(0,255,136,0.25)",borderRadius:"16px",padding:"1.5rem"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",color:"#00ff88",letterSpacing:"0.1em",marginBottom:"1.2rem"}}>&#10003; WITH WEIGHTED VOTING</div>
              {withItems.map((t, i) => (
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"0.6rem",marginBottom:"0.75rem",fontFamily:"'Exo 2',sans-serif",fontSize:"0.8rem",color:"rgba(100,116,139,0.8)",lineHeight:1.5}}>
                  <span style={{color:"#00ff88",flexShrink:0}}>&#10003;</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
            <div style={{background:"var(--surface,rgba(15,22,41,0.95))",border:"1px solid rgba(26,39,68,0.8)",borderRadius:"16px",padding:"1.5rem"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",color:"#00f5ff",letterSpacing:"0.1em",marginBottom:"1.2rem"}}>EXAMPLE: 4 VOTERS ON ONE CLAIM</div>
              {voters.map(v => (
                <div key={v.name} style={{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"0.85rem"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"50%",background:v.color+"18",border:"2px solid "+v.color+"66",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Orbitron',monospace",fontSize:"0.7rem",fontWeight:"900",color:v.color,flexShrink:0}}>{v.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:"#e2e8f0",marginBottom:"3px"}}>{v.name} voted <span style={{color:v.color}}>{v.vote}</span> <span style={{color:"rgba(100,116,139,0.5)"}}>(rep: {v.rep})</span></div>
                    <div style={{height:"4px",background:"rgba(26,39,68,0.9)",borderRadius:"2px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:((v.rep/5)*100)+"%",background:v.color,borderRadius:"2px"}} />
                    </div>
                  </div>
                  <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(100,116,139,0.5)"}}>{v.rep}x</span>
                </div>
              ))}
            </div>

            <div style={{background:"var(--surface,rgba(15,22,41,0.95))",border:"1px solid rgba(26,39,68,0.8)",borderRadius:"16px",padding:"1.5rem"}}>
              <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",color:"#00f5ff",letterSpacing:"0.1em",marginBottom:"1.2rem"}}>WEIGHTED CALCULATION</div>
              <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.72rem",lineHeight:2}}>
                <div style={{color:"#00ff88"}}>TRUE votes:</div>
                <div style={{color:"rgba(100,116,139,0.8)",paddingLeft:"1rem"}}>Alice (2.4) + Carol (1.5) + Dave (1.0) = <span style={{color:"#00ff88"}}>4.9</span></div>
                <div style={{color:"#ff3366",marginTop:"0.5rem"}}>FALSE votes:</div>
                <div style={{color:"rgba(100,116,139,0.8)",paddingLeft:"1rem"}}>Bob (0.8) = <span style={{color:"#ff3366"}}>0.8</span></div>
                <div style={{borderTop:"1px solid rgba(26,39,68,0.8)",marginTop:"1rem",paddingTop:"1rem"}}>
                  <div style={{color:"#e2e8f0"}}>True %: 4.9 / 5.7 = <span style={{color:"#00ff88"}}>86%</span></div>
                  <div style={{color:"#e2e8f0",marginTop:"0.25rem"}}>Threshold: &gt;= 60%</div>
                </div>
                <div style={{marginTop:"1rem",background:"rgba(0,255,136,0.06)",border:"1px solid rgba(0,255,136,0.2)",borderRadius:"10px",padding:"1rem",textAlign:"center"}}>
                  <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.72rem",color:"#00ff88",letterSpacing:"0.1em"}}>&#10003; VERDICT: VERIFIED TRUE</div>
                  <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.6rem",color:"rgba(100,116,139,0.6)",marginTop:"3px"}}>Expert voters outweighed low-rep voters</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    <td><span style={{fontFamily:"'Share Tech Mono',monospace",color:r.color}}>{r.range}</span></td>
                    <td><span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:r.color,background:r.color+"15",border:"1px solid "+r.color+"40",padding:"0.15rem 0.5rem",borderRadius:"4px"}}>{r.label}</span></td>
                    <td style={{color:"rgba(100,116,139,0.8)"}}>{r.desc}</td>
                    <td style={{color:"rgba(100,116,139,0.8)"}}>{r.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="hw-cta">
          <div className="hw-cta-title">Ready to Verify Claims?</div>
          <div className="hw-cta-sub">Join the decentralized fact-checking network. Submit claims, vote, build reputation.</div>
          <div className="hw-cta-btns">
            <Link to="/submit" className="hw-btn-p">&#128196; Submit a Claim</Link>
            <Link to="/vote" className="hw-btn-o">&#128228; Vote on Claims</Link>
            <Link to="/dashboard" className="hw-btn-o">&#128202; View Dashboard</Link>
          </div>
        </div>

      </div>
    </>
  );
}
