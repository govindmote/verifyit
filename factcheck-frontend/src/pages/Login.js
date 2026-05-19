import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = "01VERIFYIT<>{}[]#$%@!";
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(10,14,26,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,245,255,0.15)";
      ctx.font = fontSize + "px monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const id = setInterval(draw, 50);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) { setError("All fields required"); return; }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username: form.username,
        password: form.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        .lr { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0a0e1a; overflow:hidden; position:relative; }
        .lc { position:fixed; inset:0; pointer-events:none; }
        .lp { position:relative; z-index:10; width:420px; max-width:calc(100vw - 2rem); }
        .ll { text-align:center; margin-bottom:2rem; }
        .li { display:inline-flex; align-items:center; justify-content:center; width:72px; height:72px; border:2px solid rgba(0,245,255,0.4); border-radius:50%; font-size:28px; margin-bottom:1rem; background:rgba(0,245,255,0.05); animation:pr 3s ease-in-out infinite; }
        @keyframes pr { 0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.2);} 50%{box-shadow:0 0 50px rgba(0,245,255,0.5);} }
        .lt { font-family:'Orbitron',monospace; font-size:1.8rem; font-weight:900; color:#00f5ff; text-shadow:0 0 30px rgba(0,245,255,0.5); letter-spacing:0.12em; display:block; }
        .ls { font-family:'Share Tech Mono',monospace; font-size:0.63rem; color:rgba(100,116,139,0.6); letter-spacing:0.2em; text-transform:uppercase; margin-top:4px; display:block; }
        .lcard { background:rgba(15,22,41,0.95); border:1px solid rgba(0,245,255,0.15); border-radius:18px; padding:2.5rem; backdrop-filter:blur(20px); box-shadow:0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,245,255,0.05); position:relative; overflow:hidden; }
        .lcard::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,245,255,0.7),transparent); }
        .lh { font-family:'Orbitron',monospace; font-size:0.85rem; color:#e2e8f0; letter-spacing:0.1em; margin-bottom:0.3rem; }
        .ld { font-family:'Share Tech Mono',monospace; font-size:0.65rem; color:rgba(0,245,255,0.4); margin-bottom:2rem; }
        .lf { margin-bottom:1.3rem; }
        .llb { font-family:'Share Tech Mono',monospace; font-size:0.62rem; color:rgba(100,116,139,0.7); text-transform:uppercase; letter-spacing:0.15em; display:block; margin-bottom:0.5rem; transition:color 0.2s; }
        .llb.on { color:#00f5ff; }
        .liw { position:relative; }
        .lic { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:13px; color:rgba(100,116,139,0.4); pointer-events:none; }
        .lin { width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(26,39,68,0.9); border-radius:9px; padding:0.85rem 1rem 0.85rem 2.6rem; color:#e2e8f0; font-family:'Share Tech Mono',monospace; font-size:0.86rem; outline:none; transition:border-color 0.2s,box-shadow 0.2s; box-sizing:border-box; }
        .lin:focus { border-color:rgba(0,245,255,0.5); box-shadow:0 0 0 3px rgba(0,245,255,0.08); }
        .lin::placeholder { color:rgba(100,116,139,0.3); }
        .lerr { background:rgba(255,51,102,0.1); border:1px solid rgba(255,51,102,0.3); border-radius:8px; padding:0.65rem 1rem; color:#ff3366; font-family:'Share Tech Mono',monospace; font-size:0.72rem; margin-bottom:1.2rem; }
        .lbtn { width:100%; padding:0.95rem; background:linear-gradient(135deg,#00f5ff,#0088bb); border:none; border-radius:9px; color:#000; font-family:'Orbitron',monospace; font-size:0.75rem; font-weight:700; letter-spacing:0.18em; cursor:pointer; transition:all 0.2s; margin-top:0.5rem; }
        .lbtn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 35px rgba(0,245,255,0.4); }
        .lbtn:disabled { opacity:0.7; cursor:not-allowed; }
        .ldiv { display:flex; align-items:center; gap:1rem; margin:1.5rem 0; }
        .ldivl { flex:1; height:1px; background:rgba(26,39,68,0.8); }
        .ldivt { font-family:'Share Tech Mono',monospace; font-size:0.6rem; color:rgba(100,116,139,0.4); letter-spacing:0.1em; }
        .lft { text-align:center; font-family:'Share Tech Mono',monospace; font-size:0.7rem; color:rgba(100,116,139,0.5); }
        .lft a { color:#00f5ff; text-decoration:none; }
        .ldot { display:flex; justify-content:center; gap:6px; margin-top:1.5rem; }
        .dot { width:5px; height:5px; border-radius:50%; background:rgba(0,245,255,0.15); }
        .dot.on { background:#00f5ff; box-shadow:0 0 8px #00f5ff; animation:blink 0.8s infinite; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        .cn { position:absolute; width:12px; height:12px; border-color:rgba(0,245,255,0.35); border-style:solid; }
        .tl { top:8px; left:8px; border-width:2px 0 0 2px; }
        .tr { top:8px; right:8px; border-width:2px 2px 0 0; }
        .bl { bottom:8px; left:8px; border-width:0 0 2px 2px; }
        .br { bottom:8px; right:8px; border-width:0 2px 2px 0; }
        .sp { display:inline-block; width:13px; height:13px; border:2px solid rgba(0,0,0,0.3); border-top-color:#000; border-radius:50%; animation:spin 0.6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes spin { to{transform:rotate(360deg);} }
        [data-theme="light"] .lr{background:#e8edf5;}
        [data-theme="light"] .lcard{background:#ffffff;border-color:rgba(0,0,0,0.12);box-shadow:0 30px 80px rgba(0,0,0,0.15);}
        [data-theme="light"] .lt{color:#0369a1;text-shadow:none;}
        [data-theme="light"] .ls{color:#64748b;}
        [data-theme="light"] .lh{color:#1e293b;}
        [data-theme="light"] .ld{color:#64748b;}
        [data-theme="light"] .llb{color:#475569;}
        [data-theme="light"] .llb.on{color:#0369a1;}
        [data-theme="light"] .lin{background:#f1f5f9;border-color:rgba(0,0,0,0.15);color:#1e293b;}
        [data-theme="light"] .lin::placeholder{color:#94a3b8;}
        [data-theme="light"] .lin:focus{border-color:rgba(3,105,161,0.5);box-shadow:0 0 0 3px rgba(3,105,161,0.08);}
        [data-theme="light"] .lic{color:#64748b;}
        [data-theme="light"] .lft{color:#64748b;}
        [data-theme="light"] .lft a{color:#0369a1;}
        [data-theme="light"] .ldivt{color:#94a3b8;}
        [data-theme="light"] .ldivl{background:rgba(0,0,0,0.1);}
        [data-theme="light"] .li{border-color:rgba(3,105,161,0.4);background:rgba(3,105,161,0.05);}
        [data-theme="light"] .lbtn{background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;}
        [data-theme="light"] .lbtn{background:linear-gradient(135deg,#0369a1,#0284c7);color:#fff;}`}</style>
      <div className="lr">
        <div className="lp">
          <div className="ll">
            <div className="li">🔎</div>
            <span className="lt">VERIFYIT</span>
            <span className="ls">Decentralized Truth Network</span>
          </div>
          <div className="lcard">
            <div className="cn tl"/><div className="cn tr"/><div className="cn bl"/><div className="cn br"/>
            <div className="lh">ACCESS TERMINAL</div>
            <div className="ld">// authenticate to enter the network</div>
            {error && <div className="lerr">⚠ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="lf">
                <label className={"llb" + (focused==="username" ? " on" : "")}>Username or Email</label>
                <div className="liw">
                  <span className="lic">◈</span>
                  <input className="lin" name="username" type="text" placeholder="enter username or email..." value={form.username} onChange={e=>setForm({...form,username:e.target.value})} onFocus={()=>setFocused("username")} onBlur={()=>setFocused("")} />
                </div>
              </div>
              <div className="lf">
                <label className={"llb" + (focused==="password" ? " on" : "")}>Password</label>
                <div className="liw">
                  <span className="lic">◉</span>
                  <input className="lin" name="password" type="password" placeholder="enter password..." value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")} />
                </div>
              </div>
              <button className="lbtn" type="submit" disabled={loading}>
                {loading ? <span style={{display:"inline-flex",alignItems:"center",gap:8}}><span className="sp"/>AUTHENTICATING...</span> : "INITIALIZE SESSION"}
              </button>
            </form>
            <div className="ldiv"><div className="ldivl"/><span className="ldivt">or</span><div className="ldivl"/></div>
            <div className="lft">New to the network? <a href="/register">Create account →</a></div>
            <div className="ldot">
              <div className={"dot"+(loading?" on":"")}/><div className={"dot"+(loading?" on":"")}/><div className={"dot"+(loading?" on":"")}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
