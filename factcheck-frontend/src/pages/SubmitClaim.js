import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Submit() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const txHash = useRef('0x' + Array.from({length:16},()=>Math.floor(Math.random()*16).toString(16)).join(''));
  const [form, setForm] = useState({ title: '', description: '', sourceUrl: '' });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(null);
  const charCount = form.description.length;
  const charPct = Math.min((charCount / 1000) * 100, 100);
  const canSubmit = form.title.trim() && charCount >= 20 && status !== 'loading';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({length:55}, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random()-.5)*.35,
      vy: (Math.random()-.5)*.35,
      r: Math.random()*1.4+0.4,
      a: Math.random()*.35+.08,
      c: Math.random()>.5?'0,245,255':'124,58,237',
    }));

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=W; if (p.x>W) p.x=0;
        if (p.y<0) p.y=H; if (p.y>H) p.y=0;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.c},${p.a})`;
        ctx.fill();
      });
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<110){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(0,245,255,${.055*(1-d/110)})`;
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post('http://localhost:5000/api/claims', {
        title: form.title.trim(),
        description: form.description.trim(),
        sourceUrl: form.sourceUrl.trim() || undefined,
        submittedBy: JSON.parse(localStorage.getItem('user') || '{}').username || 'anonymous',
      });
      setStatus('success');
      setTimeout(() => navigate('/vote'), 3200);
    } catch(err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Submission failed. Try again.');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;700&display=swap');

        .sv-page {
          min-height:100vh; display:flex; align-items:center; justify-content:center;
          padding:2rem 1rem 4rem; position:relative; overflow:hidden;
        }
        .sv-canvas { position:fixed; inset:0; pointer-events:none; z-index:0; }

        .sv-ring {
          position:fixed; width:700px; height:700px; border-radius:50%;
          border:1px solid rgba(0,245,255,0.04);
          top:50%; left:50%; transform:translate(-50%,-50%);
          animation:sv-spin 50s linear infinite;
          pointer-events:none; z-index:0;
        }
        .sv-ring::before {
          content:''; position:absolute; inset:60px; border-radius:50%;
          border:1px solid rgba(124,58,237,0.05);
          animation:sv-spin 30s linear infinite reverse;
        }
        .sv-ring::after {
          content:''; position:absolute; inset:130px; border-radius:50%;
          border:1px solid rgba(0,245,255,0.03);
        }
        @keyframes sv-spin { to { transform:translate(-50%,-50%) rotate(360deg); } }

        .sv-wrap { width:100%; max-width:600px; position:relative; z-index:2; }

        .sv-topbar {
          display:flex; align-items:center; justify-content:space-between;
          margin-bottom:2.2rem;
          animation:sv-up .5s ease both;
        }
        .sv-crumb {
          font-family:'Share Tech Mono',monospace; font-size:.64rem;
          color:rgba(0,245,255,.4); letter-spacing:.18em; text-transform:uppercase;
        }
        .sv-crumb b { color:rgba(0,245,255,.85); font-weight:400; }
        .sv-pill {
          display:flex; align-items:center; gap:.4rem;
          background:rgba(0,255,136,.05); border:1px solid rgba(0,255,136,.18);
          border-radius:20px; padding:.25rem .75rem;
          font-family:'Share Tech Mono',monospace; font-size:.6rem; color:#00ff88;
        }
        .sv-dot {
          width:5px; height:5px; border-radius:50%; background:#00ff88;
          animation:sv-pulse 1.6s ease infinite;
        }
        @keyframes sv-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(0,255,136,.5);}
          50%{box-shadow:0 0 0 5px rgba(0,255,136,0);}
        }

        .sv-hero { margin-bottom:2.2rem; animation:sv-up .5s ease .1s both; }
        .sv-kicker {
          font-family:'Share Tech Mono',monospace; font-size:.62rem;
          color:rgba(0,245,255,.45); letter-spacing:.35em; text-transform:uppercase;
          margin-bottom:.6rem;
        }
        .sv-h1 {
          font-family:'Orbitron',monospace; font-weight:900;
          font-size:clamp(1.9rem,5vw,2.9rem); line-height:1.05;
          color:#f0f4f8; margin:0 0 .65rem;
        }
        .sv-h1 .cx {
          color:#00f5ff; position:relative; display:inline-block;
        }
        .sv-h1 .cx::after {
          content:attr(data-t); position:absolute; inset:0;
          color:#00f5ff; filter:blur(14px); opacity:.35; pointer-events:none;
        }
        .sv-sub {
          font-family:'Share Tech Mono',monospace; font-size:.73rem;
          color:rgba(148,163,184,.6); line-height:1.7;
        }

        .sv-card {
          background:rgba(7,11,22,.82);
          border:1px solid rgba(0,245,255,.1);
          border-radius:20px; position:relative; overflow:hidden;
          backdrop-filter:blur(28px);
          box-shadow:0 0 0 1px rgba(0,245,255,.03),0 40px 80px rgba(0,0,0,.55),0 0 50px rgba(0,245,255,.03);
          animation:sv-up .5s ease .2s both;
        }
        .sv-topline {
          height:1px;
          background:linear-gradient(90deg,transparent 0%,#00f5ff 35%,#7c3aed 65%,transparent 100%);
          opacity:.55;
        }
        .sv-body { padding:2.4rem; }

        /* Corner brackets */
        .sv-c { position:absolute; width:14px; height:14px; pointer-events:none; }
        .sv-tl { top:0;left:0; border-top:2px solid rgba(0,245,255,.6); border-left:2px solid rgba(0,245,255,.6); border-radius:4px 0 0 0; }
        .sv-tr { top:0;right:0; border-top:2px solid rgba(0,245,255,.25); border-right:2px solid rgba(0,245,255,.25); border-radius:0 4px 0 0; }
        .sv-bl { bottom:0;left:0; border-bottom:2px solid rgba(124,58,237,.25); border-left:2px solid rgba(124,58,237,.25); border-radius:0 0 0 4px; }
        .sv-br { bottom:0;right:0; border-bottom:2px solid rgba(124,58,237,.6); border-right:2px solid rgba(124,58,237,.6); border-radius:0 0 4px 0; }

        /* Steps */
        .sv-steps { display:flex; align-items:center; margin-bottom:1.8rem; }
        .sv-step { display:flex; align-items:center; gap:8px; }
        .sv-snum {
          width:28px; height:28px; border-radius:50%;
          border:1px solid rgba(0,245,255,.12);
          display:flex; align-items:center; justify-content:center;
          font-family:'Orbitron',monospace; font-size:.52rem; font-weight:700;
          color:rgba(0,245,255,.22); transition:all .3s;
        }
        .sv-step.on .sv-snum {
          border-color:#00f5ff; color:#00f5ff;
          background:rgba(0,245,255,.07);
          box-shadow:0 0 14px rgba(0,245,255,.14);
        }
        .sv-slbl {
          font-family:'Share Tech Mono',monospace; font-size:.6rem;
          color:rgba(100,116,139,.45); text-transform:uppercase; letter-spacing:.06em;
        }
        .sv-step.on .sv-slbl { color:rgba(0,245,255,.75); }
        .sv-sline { flex:1; height:1px; background:rgba(0,245,255,.055); margin:0 10px; }

        .sv-tip { display:flex; gap:10px; background:rgba(0,245,255,.04); border:1px solid rgba(0,245,255,.12); border-left:3px solid rgba(0,245,255,.5); border-radius:0 8px 8px 0; padding:.75rem .95rem; margin-bottom:1.8rem; }
        .sv-tip p { font-family:"Share Tech Mono",monospace; font-size:.72rem; color:rgba(148,163,184,.9); line-height:1.75; margin:0; }
        .sv-tip p b { color:#00f5ff; font-weight:600; }
        /* Fields */
        .sv-field { margin-bottom:1.55rem; }










        /* Fields */
        .sv-field { margin-bottom:1.55rem; }
        .sv-frow { display:flex; align-items:center; justify-content:space-between; margin-bottom:.5rem; }
        .sv-flabel {
          font-family:'Share Tech Mono',monospace; font-size:.63rem;
          text-transform:uppercase; letter-spacing:.15em; color:rgba(0,245,255,.58);
        }
        .sv-flabel sup { color:#ff3366; font-size:.75em; }
        .sv-ftag {
          font-family:'Share Tech Mono',monospace; font-size:.57rem;
          color:rgba(100,116,139,.45);
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.05);
          border-radius:4px; padding:2px 6px;
        }
        .sv-input {
          width:100%; box-sizing:border-box;
          background:rgba(0,0,0,.3);
          border:1px solid rgba(0,245,255,.08);
          border-radius:10px; padding:.82rem .95rem;
          color:#e2e8f0; font-family:'Exo 2',sans-serif; font-size:.9rem;
          outline:none; resize:none;
          transition:border-color .25s, box-shadow .25s, background .25s;
        }
        .sv-input::placeholder { color:rgba(100,116,139,.35); font-size:.82rem; }
        .sv-input:focus {
          border-color:rgba(0,245,255,.42);
          background:rgba(0,245,255,.018);
          box-shadow:0 0 0 3px rgba(0,245,255,.045),0 0 22px rgba(0,245,255,.035);
        }
        textarea.sv-input { min-height:108px; line-height:1.65; }

        .sv-fbar {
          height:1px; margin-top:3px; border-radius:1px;
          background:linear-gradient(90deg,#00f5ff,#7c3aed);
          transform:scaleX(0); transform-origin:left; transition:transform .3s ease;
        }
        .sv-fbar.on { transform:scaleX(1); }

        .sv-cbar-row { display:flex; align-items:center; gap:8px; margin-top:6px; }
        .sv-cbar-track { flex:1; height:2px; background:rgba(255,255,255,.04); border-radius:2px; overflow:hidden; }
        .sv-cbar-fill {
          height:100%; border-radius:2px;
          background:linear-gradient(90deg,#00f5ff,#7c3aed);
          transition:width .2s,background .3s;
        }
        .sv-cbar-fill.warn { background:linear-gradient(90deg,#ffd700,#ff3366); }
        .sv-cnum {
          font-family:'Share Tech Mono',monospace; font-size:.58rem;
          color:rgba(100,116,139,.45); min-width:48px; text-align:right;
        }

        .sv-hr { height:1px; background:linear-gradient(90deg,transparent,rgba(0,245,255,.07),transparent); margin:1.7rem 0; }

        .sv-err {
          background:rgba(255,51,102,.05); border:1px solid rgba(255,51,102,.17);
          border-radius:8px; padding:.72rem .95rem; margin-bottom:1.2rem;
          font-family:'Share Tech Mono',monospace; font-size:.68rem; color:#ff6b8a;
        }

        /* Button */
        .sv-btn {
          width:100%; padding:.95rem; border:none; border-radius:12px;
          font-family:'Orbitron',monospace; font-size:.76rem; font-weight:700;
          letter-spacing:.12em; text-transform:uppercase; cursor:pointer;
          display:flex; align-items:center; justify-content:center; gap:10px;
          position:relative; overflow:hidden;
          transition:transform .2s, box-shadow .2s;
        }
        .sv-btn-bg {
          position:absolute; inset:0; border-radius:inherit;
          background:linear-gradient(135deg,#00f5ff 0%,#00aacc 45%,#7c3aed 100%);
          transition:opacity .3s;
        }
        .sv-btn.loading .sv-btn-bg { background:linear-gradient(135deg,#7c3aed,#4c1d95); }
        .sv-btn-txt { position:relative; z-index:1; color:#000; }
        .sv-btn.loading .sv-btn-txt { color:#fff; }
        .sv-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 12px 40px rgba(0,245,255,.2),0 4px 16px rgba(124,58,237,.16);
        }
        .sv-btn:active:not(:disabled) { transform:translateY(0); }
        .sv-btn:disabled { opacity:.35; cursor:not-allowed; }
        .sv-btn.loading::after {
          content:''; position:absolute;
          top:0; left:-80%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
          animation:sv-shim 1.3s ease infinite;
        }
        @keyframes sv-shim { to{left:200%;} }

        /* Success */
        .sv-ok { text-align:center; padding:2.8rem 1.5rem; }
        .sv-ok-ring-wrap { position:relative; width:96px; height:96px; margin:0 auto 1.6rem; }
        .sv-ok-r1, .sv-ok-r2 {
          position:absolute; border-radius:50%;
          border:1px solid #00ff88; inset:0;
        }
        .sv-ok-r1 { animation:sv-ring 1s ease-out both; }
        .sv-ok-r2 { animation:sv-ring 1s ease-out .3s both; }
        @keyframes sv-ring { 0%{transform:scale(.5);opacity:.8;} 100%{transform:scale(1.6);opacity:0;} }
        .sv-ok-icon {
          position:absolute; inset:10px; border-radius:50%;
          border:2px solid #00ff88;
          display:flex; align-items:center; justify-content:center;
          font-size:1.7rem; background:rgba(0,255,136,.05);
          box-shadow:0 0 28px rgba(0,255,136,.18);
          animation:sv-pop .5s cubic-bezier(.34,1.56,.64,1) .2s both;
        }
        @keyframes sv-pop { from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;} }
        .sv-ok-title {
          font-family:'Orbitron',monospace; font-size:1.45rem; font-weight:900;
          color:#00ff88; margin-bottom:.4rem;
          text-shadow:0 0 18px rgba(0,255,136,.22);
          animation:sv-up .4s ease .4s both;
        }
        .sv-ok-sub {
          font-family:'Share Tech Mono',monospace; font-size:.7rem;
          color:rgba(148,163,184,.55); margin-bottom:1.8rem; line-height:1.8;
          animation:sv-up .4s ease .5s both;
        }
        .sv-tx {
          background:rgba(0,255,136,.04); border:1px solid rgba(0,255,136,.11);
          border-radius:10px; padding:1rem 1.15rem;
          font-family:'Share Tech Mono',monospace; font-size:.65rem; line-height:2.2;
          text-align:left; animation:sv-up .4s ease .6s both;
        }
        .sv-tx-row { display:flex; justify-content:space-between; }
        .sv-tx-k { color:rgba(100,116,139,.55); }
        .sv-tx-v { color:rgba(0,245,255,.75); }
        .sv-tx-ok { color:#00ff88; }
        @keyframes sv-up { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
        [data-theme="light"] .sv-page{background:#e8edf5;}
        [data-theme="light"] .sv-card{background:#ffffff;border-color:rgba(0,0,0,0.12);box-shadow:0 20px 60px rgba(0,0,0,0.15);}
        [data-theme="light"] .sv-wrap *{color:#1e293b;}
        [data-theme="light"] .sv-body label,[data-theme="light"] .sv-step-label{color:#1e293b !important;font-weight:600;}
        [data-theme="light"] .sv-body input,[data-theme="light"] .sv-body textarea{background:#f1f5f9;border-color:rgba(0,0,0,0.2);color:#1e293b !important;}
        [data-theme="light"] .sv-body input::placeholder,[data-theme="light"] .sv-body textarea::placeholder{color:#64748b;}
        [data-theme="light"] .sv-tip { background:rgba(3,105,161,.06); border-color:rgba(3,105,161,.2); border-left:3px solid #0369a1; }
        [data-theme="light"] .sv-tip p { color:#334155; }
        [data-theme="light"] .sv-tip p b { color:#0369a1; font-weight:600; }
        [data-theme="light"] .sv-tx-v{color:#0369a1 !important;}
        [data-theme="light"] .sv-sub,[data-theme="light"] .sv-breadcrumb{color:#475569 !important;}
        [data-theme="light"] .sv-title{color:#0f172a !important;}
        [data-theme="light"] .sv-char-count{color:#64748b !important;}
        [data-theme="light"] .sv-page{background:#e8edf5;}
        [data-theme="light"] .sv-card{background:#ffffff;border-color:rgba(0,0,0,0.12);box-shadow:0 20px 60px rgba(0,0,0,0.15);}
        [data-theme="light"] .sv-wrap *{color:#1e293b;}
        [data-theme="light"] .sv-body label,[data-theme="light"] .sv-step-label{color:#1e293b !important;font-weight:600;}
        [data-theme="light"] .sv-body input,[data-theme="light"] .sv-body textarea{background:#f1f5f9;border-color:rgba(0,0,0,0.2);color:#1e293b !important;}
        [data-theme="light"] .sv-body input::placeholder,[data-theme="light"] .sv-body textarea::placeholder{color:#64748b;}
        [data-theme="light"] .sv-hint{color:#334155 !important;border-color:rgba(0,0,0,0.1);background:rgba(0,0,0,0.04);}
        [data-theme="light"] .sv-hint strong{color:#0369a1 !important;}
        [data-theme="light"] .sv-tx-k{color:#475569 !important;}
        [data-theme="light"] .sv-tx-v{color:#0369a1 !important;}
        [data-theme="light"] .sv-sub,[data-theme="light"] .sv-breadcrumb{color:#475569 !important;}
        [data-theme="light"] .sv-title{color:#0f172a !important;}
        [data-theme="light"] .sv-page{background:#f1f5f9;}
        [data-theme="light"] .sv-card{background:rgba(255,255,255,0.95);border-color:rgba(0,0,0,0.1);box-shadow:0 20px 60px rgba(0,0,0,0.1);}
        [data-theme="light"] .sv-body label{color:#475569;}
        [data-theme="light"] .sv-body input,[data-theme="light"] .sv-body textarea{background:#f8fafc;border-color:rgba(0,0,0,0.15);color:#1e293b;}
        [data-theme="light"] .sv-body input::placeholder,[data-theme="light"] .sv-body textarea::placeholder{color:#94a3b8;}
        [data-theme="light"] .sv-tx-k{color:#64748b;}
        [data-theme="light"] .sv-tx-v{color:#0369a1;}
        [data-theme="light"] .sv-hint{color:#64748b;border-color:rgba(0,0,0,0.1);background:rgba(0,0,0,0.03);}
        @keyframes sv-up { from{opacity:0;transform:translateY(14px);} to{opacity:1;transform:translateY(0);} }
      `}</style>

      <div className="sv-page">
        <canvas className="sv-canvas" ref={canvasRef} />
        <div className="sv-ring" />

        <div className="sv-wrap">
          <div className="sv-topbar">
            <div className="sv-crumb">VerifyIt / <b>Submit Claim</b></div>
            <div className="sv-pill"><div className="sv-dot" />Polygon Amoy Live</div>
          </div>

          <div className="sv-hero">
            <div className="sv-kicker">// new_claim_submission</div>
            <h1 className="sv-h1">Expose a <span className="cx" data-t="Rumor">Rumor</span></h1>
            <p className="sv-sub">Submit &middot; Community votes &middot; Verdict recorded on-chain forever</p>
          </div>

          <div className="sv-card">
            <div className="sv-topline" />
            <div className="sv-c sv-tl" /><div className="sv-c sv-tr" />
            <div className="sv-c sv-bl" /><div className="sv-c sv-br" />

            <div className="sv-body">
              {status === 'success' ? (
                <div className="sv-ok">
                  <div className="sv-ok-ring-wrap">
                    <div className="sv-ok-r1" /><div className="sv-ok-r2" />
                    <div className="sv-ok-icon">&#10003;</div>
                  </div>
                  <div className="sv-ok-title">Submitted!</div>
                  <p className="sv-ok-sub">Claim broadcast to the network.<br/>Redirecting to vote in 3s...</p>
                  <div className="sv-tx">
                    <div className="sv-tx-row"><span className="sv-tx-k">&#9935; Tx Hash</span><span className="sv-tx-v">{txHash.current}</span></div>
                    <div className="sv-tx-row"><span className="sv-tx-k">&#128225; Network</span><span className="sv-tx-v">Polygon Amoy</span></div>
                    <div className="sv-tx-row"><span className="sv-tx-k">&#10003; Status</span><span className="sv-tx-ok">Confirmed</span></div>
                  <button className="sv-btn" onClick={handleSubmit} disabled={!canSubmit || status==="loading"}>{status==="loading" ? "Broadcasting..." : "Submit to Blockchain"}</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="sv-steps">
                    {[['01','Details',true],['02','Review',false],['03','Chain',false]].map(([n,l,a],i,arr)=>(
                      <React.Fragment key={n}>
                        <div className={`sv-step ${a?'on':''}`}>
                          <div className="sv-snum">{n}</div>
                          <div className="sv-slbl">{l}</div>
                        </div>
                        {i<arr.length-1 && <div className="sv-sline"/>}
                      </React.Fragment>
                    ))}
                  </div>
                    <span style={{fontSize:"0.85rem",flexShrink:0}}>&#9889;</span>


                    <p><b>Auto-verdict:</b> Claims with 3+ votes and a 1.5x majority are auto-resolved and permanently written to Polygon Amoy Testnet.</p>
                  {status==="error" && <div className="sv-err">&#9888; {errorMsg}</div>}

                  {status==='error' && <div className="sv-err">âŒ {errorMsg}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="sv-field">
                      <div className="sv-frow">
                        <div className="sv-flabel">Claim Title<sup>*</sup></div>
                        <div className="sv-ftag">max 120</div>
                      </div>
                      <input className="sv-input" type="text" name="title"
                        value={form.title} onChange={handleChange}
                        placeholder="e.g. AI video shows aircraft carrier on fire"
                        required maxLength={120} autoComplete="off"
                        onFocus={()=>setFocused('t')} onBlur={()=>setFocused(null)}
                      />
                      <div className={`sv-fbar ${focused==='t'?'on':''}`}/>
                    </div>

                    <div className="sv-field">
                      <div className="sv-frow">
                        <div className="sv-flabel">Description<sup>*</sup></div>
                        <div className="sv-ftag">min 20</div>
                      </div>
                      <textarea className="sv-input" name="description"
                        value={form.description} onChange={handleChange}
                        placeholder="Where did you see this? Why is it suspicious or worth verifying?"
                        required minLength={20} maxLength={1000}
                        onFocus={()=>setFocused('d')} onBlur={()=>setFocused(null)}
                      />
                      <div className={`sv-fbar ${focused==='d'?'on':''}`}/>
                      <div className="sv-cbar-row">
                        <div className="sv-cbar-track">
                          <div className={`sv-cbar-fill ${charCount>900?'warn':''}`} style={{width:`${charPct}%`}}/>
                        </div>
                        <div className="sv-cnum">{charCount}/1000</div>
                      </div>
                    </div>

                    <div className="sv-field">
                      <div className="sv-frow">
                        <div className="sv-flabel">Source URL</div>
                        <div className="sv-ftag">optional</div>
                      </div>
                      <input className="sv-input" type="url" name="sourceUrl"
                        value={form.sourceUrl} onChange={handleChange}
                        placeholder="https://twitter.com/... or original source link"
                        onFocus={()=>setFocused('u')} onBlur={()=>setFocused(null)}
                      />
                      <div className={`sv-fbar ${focused==='u'?'on':''}`}/>
                    </div>

                    <div className="sv-hr"/>

                    <button type="submit" className={`sv-btn ${status==='loading'?'loading':''}`} disabled={!canSubmit}>
                      <div className="sv-btn-bg"/>
                      <span className="sv-btn-txt">
                        {status==="loading" ? "Broadcasting..." : "Submit to Blockchain"}
                      </span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
