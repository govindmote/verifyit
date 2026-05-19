import React, { useState } from "react";

function analyzeLocally(claim) {
  const title = (claim.title || "").toLowerCase();
  const desc = (claim.description || "").toLowerCase();
  const full = title + " " + desc;
  const hasSource = !!(claim.sourceUrl && claim.sourceUrl.trim());
  const falsePatterns = ["permanently banned","secretly","leaked","government hiding","miracle","guaranteed","scientists baffled","shocking truth","exposed","deep state","cover up","coverup","hoax","conspiracy","no return","illegal to use vpn","arrested for","bill gates","microchip","5g causes","vaccine causes","proven to cause","doctors hate","big pharma"];
  const truePatterns = ["according to","study shows","research confirms","official statement","government announced","published in","data shows","statistics show","confirmed by","verified by","report says","survey found","university","journal","ministry","peer reviewed","evidence suggests"];
  const uncertainPatterns = ["claims","allegedly","rumor","viral post","social media claims","unverified","sources say","reportedly","some say","people claim","circulating","going viral","whatsapp","forward"];
  let falseScore = 0, trueScore = 0, uncertainScore = 0;
  const flags = [];
  falsePatterns.forEach(p => { if (full.includes(p)) { falseScore += 2; if (flags.length < 3) flags.push(p.charAt(0).toUpperCase() + p.slice(1)); } });
  truePatterns.forEach(p => { if (full.includes(p)) trueScore += 2; });
  uncertainPatterns.forEach(p => { if (full.includes(p)) uncertainScore += 1; });
  if (hasSource) trueScore += 3; else falseScore += 1;
  if ((claim.description || "").length < 50) uncertainScore += 2;
  const capsRatio = (claim.title.replace(/[^A-Z]/g, "").length) / (claim.title.length || 1);
  if (capsRatio > 0.4) falseScore += 2;
  let verdict, confidence, reasoning;
  if (falseScore > trueScore + 2) {
    verdict = "FALSE";
    confidence = Math.min(92, 55 + falseScore * 3);
    reasoning = "This claim contains multiple patterns commonly associated with misinformation, including sensational language and unverified assertions. " + (hasSource ? "While a source is provided, the content raises several red flags." : "No credible source URL was provided to support the claim.") + " Community verification is strongly recommended before sharing.";
  } else if (trueScore > falseScore + 2) {
    verdict = "TRUE";
    confidence = Math.min(90, 52 + trueScore * 3);
    reasoning = "This claim uses credible language patterns and references that align with verified reporting. " + (hasSource ? "A source URL has been provided which adds to its credibility." : "However, no source URL was attached — independent verification is advised.") + " The structure and phrasing are consistent with factual reporting.";
  } else {
    verdict = "UNVERIFIED";
    confidence = Math.min(75, 40 + uncertainScore * 4);
    reasoning = "This claim contains mixed signals — some elements suggest credibility while others introduce uncertainty. " + (uncertainPatterns.some(p => full.includes(p)) ? "The claim appears to originate from unverified social media sources." : "Insufficient evidence exists to confirm or deny this claim definitively.") + " Human community voting will help establish a reliable verdict.";
  }
  confidence = Math.max(45, Math.min(93, Math.round(confidence)));
  return { verdict, confidence, reasoning, flags: flags.slice(0, 3) };
}

export default function AIAnalysis({ claim }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const analyze = () => {
    if (result) { setExpanded(e => !e); return; }
    setLoading(true);
    setTimeout(() => { setResult(analyzeLocally(claim)); setExpanded(true); setLoading(false); }, 1400);
  };
  const verdictColor  = result?.verdict === "TRUE" ? "#00ff88" : result?.verdict === "FALSE" ? "#ff3366" : "#ffd700";
  const verdictBg     = result?.verdict === "TRUE" ? "rgba(0,255,136,0.08)" : result?.verdict === "FALSE" ? "rgba(255,51,102,0.08)" : "rgba(255,215,0,0.08)";
  const verdictBorder = result?.verdict === "TRUE" ? "rgba(0,255,136,0.25)" : result?.verdict === "FALSE" ? "rgba(255,51,102,0.25)" : "rgba(255,215,0,0.25)";
  const verdictLabel  = result?.verdict === "TRUE" ? "LIKELY TRUE" : result?.verdict === "FALSE" ? "LIKELY FALSE" : "UNVERIFIED";
  const verdictEmoji  = result?.verdict === "TRUE" ? "checkmark" : result?.verdict === "FALSE" ? "cross" : "warning";
  return (
    <div style={{marginBottom:"1.2rem"}}>
      <style>{`
        .ai-panel{border-radius:12px;overflow:hidden;border:1px solid rgba(139,92,246,0.25);background:rgba(139,92,246,0.04);}
        .ai-header{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;cursor:pointer;transition:background 0.2s;}
        .ai-header:hover{background:rgba(139,92,246,0.08);}
        .ai-header-left{display:flex;align-items:center;gap:0.6rem;}
        .ai-icon{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a78bfa);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
        .ai-label{font-family:'Orbitron',monospace;font-size:0.68rem;font-weight:700;color:#a78bfa;letter-spacing:0.08em;}
        .ai-sublabel{font-family:'Share Tech Mono',monospace;font-size:0.58rem;color:rgba(167,139,250,0.5);margin-top:1px;}
        .ai-chevron{font-size:0.7rem;color:rgba(167,139,250,0.5);transition:transform 0.3s;}
        .ai-chevron.open{transform:rotate(180deg);}
        .ai-body{padding:0 1rem 1rem;}
        .ai-verdict-row{display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.85rem;border-radius:8px;margin-bottom:0.85rem;}
        .ai-verdict-text{font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;}
        .ai-conf{font-family:'Share Tech Mono',monospace;font-size:0.65rem;opacity:0.7;}
        .ai-conf-bar{height:4px;background:rgba(139,92,246,0.15);border-radius:2px;overflow:hidden;margin-bottom:0.85rem;}
        .ai-conf-fill{height:100%;border-radius:2px;background:linear-gradient(90deg,#7c3aed,#a78bfa);transition:width 0.8s ease;}
        .ai-reasoning{font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:rgba(167,139,250,0.8);line-height:1.7;margin-bottom:0.75rem;padding:0.65rem 0.85rem;background:rgba(139,92,246,0.06);border-radius:8px;border-left:2px solid rgba(139,92,246,0.3);}
        .ai-flags{display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.5rem;}
        .ai-flag{font-family:'Share Tech Mono',monospace;font-size:0.6rem;padding:0.2rem 0.55rem;border-radius:4px;background:rgba(255,193,7,0.08);border:1px solid rgba(255,193,7,0.2);color:#ffc107;}
        .ai-spinner{display:flex;align-items:center;gap:0.6rem;padding:0.75rem 0;font-family:'Share Tech Mono',monospace;font-size:0.72rem;color:#a78bfa;}
        .ai-spin{width:14px;height:14px;border:2px solid rgba(167,139,250,0.2);border-top-color:#a78bfa;border-radius:50%;animation:aispin 0.7s linear infinite;}
        @keyframes aispin{to{transform:rotate(360deg);}}
        .ai-btn{display:inline-flex;align-items:center;gap:0.4rem;padding:0.35rem 0.85rem;border-radius:6px;background:linear-gradient(135deg,rgba(124,58,237,0.2),rgba(167,139,250,0.15));border:1px solid rgba(139,92,246,0.3);color:#a78bfa;font-family:'Share Tech Mono',monospace;font-size:0.65rem;cursor:pointer;transition:all 0.2s;margin-bottom:0.5rem;}
        .ai-btn:hover{background:linear-gradient(135deg,rgba(124,58,237,0.35),rgba(167,139,250,0.25));border-color:rgba(139,92,246,0.5);}
        .ai-disclaimer{font-family:'Share Tech Mono',monospace;font-size:0.55rem;color:rgba(100,116,139,0.4);margin-top:0.5rem;text-align:right;}
      `}</style>
      {!result && !loading && <button className="ai-btn" onClick={analyze}>AI Analysis</button>}
      {loading && <div className="ai-panel"><div className="ai-body" style={{paddingTop:"0.75rem"}}><div className="ai-spinner"><div className="ai-spin"/>Analyzing claim patterns...</div></div></div>}
      {result && (
        <div className="ai-panel">
          <div className="ai-header" onClick={() => setExpanded(e => !e)}>
            <div className="ai-header-left">
              <div className="ai-icon">AI</div>
              <div><div className="ai-label">AI ANALYSIS</div><div className="ai-sublabel">Pattern Analysis · {result.confidence}% confidence</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:"0.65rem",color:verdictColor,background:verdictBg,border:`1px solid ${verdictBorder}`,padding:"0.15rem 0.5rem",borderRadius:"4px"}}>{verdictLabel}</span>
              <span className={`ai-chevron${expanded?" open":""}`}>v</span>
            </div>
          </div>
          {expanded && (
            <div className="ai-body">
              <div className="ai-verdict-row" style={{background:verdictBg,border:`1px solid ${verdictBorder}`}}>
                <span className="ai-verdict-text" style={{color:verdictColor}}>{verdictLabel}</span>
                <span className="ai-conf" style={{color:verdictColor}}>{result.confidence}% confidence</span>
              </div>
              <div className="ai-conf-bar"><div className="ai-conf-fill" style={{width:`${result.confidence}%`}}/></div>
              <div className="ai-reasoning">{result.reasoning}</div>
              {result.flags?.length > 0 && <div className="ai-flags">{result.flags.map((f,i) => <span key={i} className="ai-flag">{f}</span>)}</div>}
              <div className="ai-disclaimer">// AI pre-screening · not a final verdict · human voting determines outcome</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
