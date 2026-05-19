import React from "react";

export default function VerdictCertificate({ claim, onClose }) {
  const verdictColor = claim.verdict === "TRUE" ? "#00c853" : claim.verdict === "FALSE" ? "#d50000" : "#ff6f00";
  const verdictLabel = claim.verdict === "TRUE" ? "VERIFIED TRUE" : claim.verdict === "FALSE" ? "MARKED FALSE" : "UNVERIFIED";
  const verdictIcon = claim.verdict === "TRUE" ? "✓" : claim.verdict === "FALSE" ? "✗" : "⚠";
  const date = new Date(claim.blockchain?.recordedAt || claim.createdAt || Date.now()).toLocaleDateString("en-IN", { year:"numeric", month:"long", day:"numeric" });
  const txHash = claim.blockchain?.txHash && claim.blockchain.txHash !== "already-recorded" ? claim.blockchain.txHash : null;

  const printCertificate = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>VerifyIt Certificate - ${claim.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@400;600&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Exo 2', sans-serif; }
          .cert { width: 800px; padding: 60px; border: 3px solid ${verdictColor}; border-radius: 16px; position: relative; background: #fff; box-shadow: 0 0 0 8px ${verdictColor}22; }
          .cert-corner { position: absolute; width: 24px; height: 24px; border-color: ${verdictColor}; border-style: solid; }
          .tl { top: 12px; left: 12px; border-width: 3px 0 0 3px; }
          .tr { top: 12px; right: 12px; border-width: 3px 3px 0 0; }
          .bl { bottom: 12px; left: 12px; border-width: 0 0 3px 3px; }
          .br { bottom: 12px; right: 12px; border-width: 0 3px 3px 0; }
          .cert-header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 30px; }
          .cert-logo { font-family: 'Orbitron', monospace; font-size: 2rem; font-weight: 900; color: #0a0e1a; letter-spacing: 0.15em; margin-bottom: 6px; }
          .cert-logo span { color: ${verdictColor}; }
          .cert-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: #64748b; letter-spacing: 0.3em; text-transform: uppercase; }
          .cert-title { font-family: 'Orbitron', monospace; font-size: 0.9rem; color: #64748b; letter-spacing: 0.2em; text-transform: uppercase; text-align: center; margin-bottom: 30px; }
          .cert-claim { background: #f8fafc; border-left: 4px solid ${verdictColor}; padding: 20px 24px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
          .cert-claim-label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: #94a3b8; letter-spacing: 0.15em; margin-bottom: 8px; }
          .cert-claim-title { font-family: 'Exo 2', sans-serif; font-size: 1.1rem; font-weight: 600; color: #1e293b; line-height: 1.5; }
          .cert-verdict { text-align: center; margin-bottom: 35px; }
          .cert-verdict-icon { font-size: 3.5rem; color: ${verdictColor}; display: block; margin-bottom: 8px; }
          .cert-verdict-label { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; color: ${verdictColor}; letter-spacing: 0.15em; }
          .cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
          .cert-field { background: #f8fafc; border-radius: 8px; padding: 14px 18px; }
          .cert-field-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #94a3b8; letter-spacing: 0.15em; margin-bottom: 6px; }
          .cert-field-val { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: #1e293b; word-break: break-all; }
          .cert-chain { background: #0a0e1a; border-radius: 10px; padding: 18px 22px; margin-bottom: 30px; }
          .cert-chain-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #64748b; letter-spacing: 0.15em; margin-bottom: 8px; }
          .cert-chain-hash { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: #00f5ff; word-break: break-all; }
          .cert-chain-network { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; color: #475569; margin-top: 6px; }
          .cert-footer { text-align: center; border-top: 1px solid #eee; padding-top: 24px; }
          .cert-footer-text { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; color: #94a3b8; line-height: 1.8; }
          .cert-seal { display: inline-flex; align-items: center; gap: 8px; background: ${verdictColor}11; border: 1px solid ${verdictColor}44; border-radius: 20px; padding: 6px 16px; margin-top: 12px; }
          .cert-seal-text { font-family: 'Orbitron', monospace; font-size: 0.6rem; color: ${verdictColor}; letter-spacing: 0.1em; }
          @media print { body { background: #fff; } .cert { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="cert-corner tl"></div>
          <div class="cert-corner tr"></div>
          <div class="cert-corner bl"></div>
          <div class="cert-corner br"></div>
          <div class="cert-header">
            <div class="cert-logo">VERIFY<span>IT</span></div>
            <div class="cert-subtitle">Blockchain Fact-Checker &bull; Polygon Amoy Testnet</div>
          </div>
          <div class="cert-title">Certificate of Fact Verification</div>
          <div class="cert-claim">
            <div class="cert-claim-label">CLAIM SUBMITTED FOR VERIFICATION</div>
            <div class="cert-claim-title">${claim.title}</div>
          </div>
          <div class="cert-verdict">
            <span class="cert-verdict-icon">${verdictIcon}</span>
            <div class="cert-verdict-label">${verdictLabel}</div>
          </div>
          <div class="cert-grid">
            <div class="cert-field">
              <div class="cert-field-label">CLAIM ID</div>
              <div class="cert-field-val">#${(claim._id||"").slice(-12)}</div>
            </div>
            <div class="cert-field">
              <div class="cert-field-label">VERIFICATION DATE</div>
              <div class="cert-field-val">${date}</div>
            </div>
            <div class="cert-field">
              <div class="cert-field-label">TRUE VOTES</div>
              <div class="cert-field-val">${claim.votes?.true || 0}</div>
            </div>
            <div class="cert-field">
              <div class="cert-field-label">FALSE VOTES</div>
              <div class="cert-field-val">${claim.votes?.false || 0}</div>
            </div>
          </div>
          ${txHash ? `
          <div class="cert-chain">
            <div class="cert-chain-label">&#9935; BLOCKCHAIN TRANSACTION HASH</div>
            <div class="cert-chain-hash">${txHash}</div>
            <div class="cert-chain-network">Network: Polygon Amoy Testnet &bull; Contract: 0x72C2d536593686D8c5216453DD0497eCF319a210</div>
          </div>` : ""}
          <div class="cert-footer">
            <div class="cert-footer-text">
              This certificate confirms that the above claim has been verified by the VerifyIt community<br>
              and the verdict has been permanently recorded on the Polygon Amoy blockchain.<br>
              Verify this transaction at: amoy.polygonscan.com
            </div>
            <div class="cert-seal">
              <span class="cert-seal-text">&#9679; VERIFIED ON POLYGON AMOY TESTNET</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"var(--surface,#0f1629)",border:"1px solid rgba(0,245,255,0.2)",borderRadius:"16px",padding:"2rem",width:"420px",textAlign:"center",fontFamily:"'Share Tech Mono',monospace"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:"3rem",marginBottom:"1rem"}}>📜</div>
        <div style={{fontFamily:"'Orbitron',monospace",fontSize:"0.9rem",color:"#00f5ff",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>VERDICT CERTIFICATE</div>
        <div style={{fontSize:"0.7rem",color:"#64748b",marginBottom:"0.5rem",lineHeight:1.6}}>{claim.title.slice(0,60)}...</div>
        <div style={{display:"inline-block",padding:"0.3rem 0.9rem",borderRadius:"6px",background:verdictColor+"22",border:"1px solid "+verdictColor+"55",color:verdictColor,fontSize:"0.72rem",fontFamily:"'Orbitron',monospace",marginBottom:"1.5rem"}}>{verdictLabel}</div>
        <div style={{display:"flex",gap:"0.75rem",justifyContent:"center"}}>
          <button onClick={onClose} style={{padding:"0.65rem 1.2rem",background:"transparent",border:"1px solid rgba(36,48,85,0.9)",borderRadius:"8px",color:"#64748b",fontFamily:"'Share Tech Mono',monospace",fontSize:"0.7rem",cursor:"pointer"}}>Cancel</button>
          <button onClick={printCertificate} style={{padding:"0.65rem 1.5rem",background:"linear-gradient(135deg,#00f5ff,#0088bb)",border:"none",borderRadius:"8px",color:"#000",fontFamily:"'Orbitron',monospace",fontSize:"0.7rem",fontWeight:"700",letterSpacing:"0.08em",cursor:"pointer"}}>&#128196; Download PDF</button>
        </div>
      </div>
    </div>
  );
}
