import React, { useState, useEffect } from "react";

const BlockchainConfirm = ({ verdict, claimId, onDone }) => {
  const [stage, setStage] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    const t2 = setTimeout(() => setBlocks(1), 1800);
    const t3 = setTimeout(() => setBlocks(2), 2800);
    const t4 = setTimeout(() => setBlocks(3), 3800);
    const t5 = setTimeout(async () => {
      setStage(2);
      for (let i = 0; i < 10; i++) {
        try {
          const res = await fetch(`http://localhost:5000/api/votes/${claimId}`);
          const data = await res.json();
          if (data.blockchain?.txHash) { setTxHash(data.blockchain.txHash); break; }
        } catch {}
        await new Promise(r => setTimeout(r, 3000));
      }
    }, 4200);
    const t6 = setTimeout(() => onDone(), 15000);
    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, []);

  const vColor = verdict === "TRUE" ? "#00ff88" : verdict === "FALSE" ? "#ff3366" : "#ffd700";
  const vLabel = verdict === "TRUE" ? "VERIFIED TRUE" : verdict === "FALSE" ? "MARKED FALSE" : "UNVERIFIED";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
    .bc-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.95);backdrop-filter:blur(12px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:bcFade 0.4s ease;}
    @keyframes bcFade{from{opacity:0}to{opacity:1}}
    .bc-box{text-align:center;max-width:480px;width:90%;padding:2rem;}
    .bc-chain-icon{font-size:3rem;margin-bottom:1.5rem;animation:bcPulse 1s ease infinite;}
    @keyframes bcPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
    .bc-stage{font-family:'Share Tech Mono',monospace;font-size:0.85rem;color:#00f5ff;margin-bottom:2rem;letter-spacing:0.1em;min-height:1.5rem;}
    .bc-blocks{display:flex;justify-content:center;gap:1rem;margin-bottom:2rem;}
    .bc-block{width:60px;height:60px;border-radius:10px;border:2px solid rgba(0,245,255,0.2);display:flex;align-items:center;justify-content:center;font-family:'Orbitron',monospace;font-size:0.7rem;font-weight:700;transition:all 0.5s;position:relative;overflow:hidden;flex-direction:column;gap:4px;}
    .bc-block.confirmed{border-color:#00ff88;background:rgba(0,255,136,0.1);color:#00ff88;animation:bcBlockIn 0.4s cubic-bezier(0.34,1.56,0.64,1);}
    @keyframes bcBlockIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
    .bc-block.pending{color:rgba(100,116,139,0.4);}
    .bc-block-label{font-size:0.5rem;letter-spacing:0.05em;}
    .bc-verdict{font-family:'Orbitron',monospace;font-size:1.8rem;font-weight:900;letter-spacing:0.15em;margin-bottom:1rem;animation:bcGlow 1.5s ease infinite alternate;}
    @keyframes bcGlow{from{text-shadow:0 0 20px currentColor}to{text-shadow:0 0 60px currentColor,0 0 100px currentColor}}
    .bc-hash{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.6);margin-bottom:1.5rem;word-break:break-all;padding:0.75rem;border:1px solid rgba(26,39,68,0.8);border-radius:8px;background:rgba(15,22,41,0.8);}
    .bc-hash a{color:#00f5ff;text-decoration:none;}
    .bc-hash a:hover{text-decoration:underline;}
    .bc-dismiss{font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:rgba(100,116,139,0.5);cursor:pointer;border:1px solid rgba(36,48,85,0.9);border-radius:6px;padding:0.5rem 1.5rem;background:transparent;transition:all 0.2s;}
    .bc-dismiss:hover{border-color:#00f5ff;color:#00f5ff;}
    .bc-scanning{display:flex;justify-content:center;gap:3px;margin-bottom:1rem;}
    .bc-scan-dot{width:6px;height:6px;border-radius:50%;background:#00f5ff;animation:bcDot 1.2s ease infinite;}
    .bc-scan-dot:nth-child(2){animation-delay:0.2s;}
    .bc-scan-dot:nth-child(3){animation-delay:0.4s;}
    @keyframes bcDot{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="bc-overlay" onClick={onDone}>
        <div className="bc-box" onClick={e => e.stopPropagation()}>
          <div className="bc-chain-icon">⛓</div>
          <div className="bc-stage">
            {stage === 0 && "BROADCASTING TO POLYGON AMOY..."}
            {stage === 1 && `AWAITING BLOCK CONFIRMATIONS... ${blocks}/3`}
            {stage === 2 && txHash && "VERDICT PERMANENTLY LOCKED ON-CHAIN"}
            {stage === 2 && !txHash && "WAITING FOR ON-CHAIN CONFIRMATION..."}
          </div>
          <div className="bc-blocks">
            {[1,2,3].map(n => (
              <div key={n} className={`bc-block ${blocks >= n ? "confirmed" : "pending"}`}>
                {blocks >= n ? "✓" : n}
                <span className="bc-block-label">BLOCK {n}</span>
              </div>
            ))}
          </div>
          {stage === 2 && (
            <>
              <div className="bc-verdict" style={{color:vColor}}>{vLabel}</div>
              {txHash ? (
                <div className="bc-hash">
                  ⛓ TX: <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noreferrer">
                    {txHash.slice(0,24)}...{txHash.slice(-8)}
                  </a> ↗
                </div>
              ) : (
                <div className="bc-scanning">
                  <div className="bc-scan-dot"/><div className="bc-scan-dot"/><div className="bc-scan-dot"/>
                </div>
              )}
              <button className="bc-dismiss" onClick={onDone}>CLOSE</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlockchainConfirm;
