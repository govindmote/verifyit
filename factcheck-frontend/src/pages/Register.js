import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [strength, setStrength] = useState(0);
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

  const calcStrength = (p) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (e.target.name === "password") setStrength(calcStrength(e.target.value));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.username || !form.email || !form.password) { setError("All fields are required"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const axios = (await import("axios")).default;
      const res = await axios.post(`http://localhost:5000/api/auth/register`, {
        username: form.username, email: form.email, password: form.password
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  const strengthColors = ["#ff3366", "#ff6b35", "#ffd700", "#00cc66", "#00f5ff"];
  const strengthLabels = ["", "WEAK", "FAIR", "GOOD", "STRONG", "ELITE"];

  const fields = [
    { name: "username", type: "text",     icon: "◈", placeholder: "choose a username..." },
    { name: "email",    type: "email",    icon: "◎", placeholder: "your email address..." },
    { name: "password", type: "password", icon: "◉", placeholder: "create a password..." },
    { name: "confirm",  type: "password", icon: "◈", placeholder: "confirm your password..." },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
    .rr{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0e1a;overflow:hidden;position:relative;padding:2rem 0;}
    .rc{position:fixed;inset:0;pointer-events:none;}
    .rp{position:relative;z-index:10;width:460px;max-width:calc(100vw - 2rem);}
    .rl{text-align:center;margin-bottom:1.8rem;}
    .ri{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border:2px solid rgba(0,245,255,0.4);border-radius:50%;font-size:26px;margin-bottom:0.9rem;background:rgba(0,245,255,0.05);animation:pr 3s ease-in-out infinite;}
    @keyframes pr{0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.2);}50%{box-shadow:0 0 50px rgba(0,245,255,0.5);}}
    .rt{font-family:'Orbitron',monospace;font-size:1.7rem;font-weight:900;color:#00f5ff;text-shadow:0 0 30px rgba(0,245,255,0.5);letter-spacing:0.12em;display:block;}
    .rsub{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.6);letter-spacing:0.2em;text-transform:uppercase;margin-top:4px;display:block;}
    .rcard{background:rgba(15,22,41,0.95);border:1px solid rgba(0,245,255,0.15);border-radius:18px;padding:2.2rem;backdrop-filter:blur(20px);box-shadow:0 30px 80px rgba(0,0,0,0.8),0 0 0 1px rgba(0,245,255,0.05);position:relative;overflow:hidden;}
    .rcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,245,255,0.7),transparent);}
    .rh{font-family:'Orbitron',monospace;font-size:0.85rem;color:#e2e8f0;letter-spacing:0.1em;margin-bottom:0.3rem;}
    .rdesc{font-family:'Share Tech Mono',monospace;font-size:0.65rem;color:rgba(0,245,255,0.4);margin-bottom:1.8rem;}
    .rf{margin-bottom:1.2rem;}
    .rlb{font-family:'Share Tech Mono',monospace;font-size:0.62rem;color:rgba(100,116,139,0.7);text-transform:uppercase;letter-spacing:0.15em;display:block;margin-bottom:0.5rem;transition:color 0.2s;}
    .rlb.on{color:#00f5ff;}
    .riw{position:relative;}
    .ric{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:13px;color:rgba(100,116,139,0.4);pointer-events:none;}
    .rin{width:100%;background:rgba(0,0,0,0.5);border:1px solid rgba(26,39,68,0.9);border-radius:9px;padding:0.8rem 1rem 0.8rem 2.6rem;color:#e2e8f0;font-family:'Share Tech Mono',monospace;font-size:0.85rem;outline:none;transition:border-color 0.2s,box-shadow 0.2s;box-sizing:border-box;}
    .rin:focus{border-color:rgba(0,245,255,0.5);box-shadow:0 0 0 3px rgba(0,245,255,0.08);}
    .rin::placeholder{color:rgba(100,116,139,0.3);}
    .rerr{background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.3);border-radius:8px;padding:0.65rem 1rem;color:#ff3366;font-family:'Share Tech Mono',monospace;font-size:0.72rem;margin-bottom:1.2rem;}
    .rok{background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);border-radius:8px;padding:0.65rem 1rem;color:#00ff88;font-family:'Share Tech Mono',monospace;font-size:0.72rem;margin-bottom:1.2rem;}
    .rbtn{width:100%;padding:0.9rem;background:linear-gradient(135deg,#00f5ff,#0088bb);border:none;border-radius:9px;color:#000;font-family:'Orbitron',monospace;font-size:0.75rem;font-weight:700;letter-spacing:0.18em;cursor:pointer;transition:all 0.2s;margin-top:0.4rem;}
    .rbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 35px rgba(0,245,255,0.4);}
    .rbtn:disabled{opacity:0.7;cursor:not-allowed;}
    .rstr-wrap{margin-top:0.5rem;}
    .rstr-bar{display:flex;gap:4px;margin-bottom:4px;}
    .rstr-seg{height:4px;flex:1;border-radius:2px;background:rgba(26,39,68,0.8);transition:background 0.3s;}
    .rstr-label{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.5);letter-spacing:0.1em;}
    .rdiv{display:flex;align-items:center;gap:1rem;margin:1.4rem 0;}
    .rdivl{flex:1;height:1px;background:rgba(26,39,68,0.8);}
    .rdivt{font-family:'Share Tech Mono',monospace;font-size:0.6rem;color:rgba(100,116,139,0.4);letter-spacing:0.1em;}
    .rft{text-align:center;font-family:'Share Tech Mono',monospace;font-size:0.7rem;color:rgba(100,116,139,0.5);}
    .rft a{color:#00f5ff;text-decoration:none;}
    .rdot{display:flex;justify-content:center;gap:6px;margin-top:1.3rem;}
    .dot2{width:5px;height:5px;border-radius:50%;background:rgba(0,245,255,0.15);}
    .dot2.on{background:#00f5ff;box-shadow:0 0 8px #00f5ff;animation:blink 0.8s infinite;}
    @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
    .rcn{position:absolute;width:12px;height:12px;border-color:rgba(0,245,255,0.35);border-style:solid;}
    .tl2{top:8px;left:8px;border-width:2px 0 0 2px;}
    .tr2{top:8px;right:8px;border-width:2px 2px 0 0;}
    .bl2{bottom:8px;left:8px;border-width:0 0 2px 2px;}
    .br2{bottom:8px;right:8px;border-width:0 2px 2px 0;}
    .sp2{display:inline-block;width:13px;height:13px;border:2px solid rgba(0,0,0,0.3);border-top-color:#000;border-radius:50%;animation:spin2 0.6s linear infinite;}
    @keyframes spin2{to{transform:rotate(360deg);}}
    [data-theme="light"] .rr{background:#f0f4ff;}
    [data-theme="light"] .rt{color:#0077aa;text-shadow:0 0 20px rgba(0,119,170,0.3);}
    [data-theme="light"] .rsub{color:rgba(71,85,105,0.7);}
    [data-theme="light"] .ri{border-color:rgba(0,119,170,0.4);background:rgba(0,119,170,0.06);}
    [data-theme="light"] .rcard{background:rgba(255,255,255,0.97);border:1px solid rgba(0,119,170,0.15);box-shadow:0 20px 60px rgba(0,0,0,0.1);}
    [data-theme="light"] .rcard::before{background:linear-gradient(90deg,transparent,rgba(0,119,170,0.5),transparent);}
    [data-theme="light"] .rh{color:#1e293b;}
    [data-theme="light"] .rdesc{color:rgba(0,119,170,0.5);}
    [data-theme="light"] .rlb{color:rgba(71,85,105,0.7);}
    [data-theme="light"] .rlb.on{color:#0077aa;}
    [data-theme="light"] .rin{background:rgba(240,244,255,0.8);border:1px solid rgba(203,213,225,0.9);color:#1e293b;}
    [data-theme="light"] .rin:focus{border-color:rgba(0,119,170,0.5);box-shadow:0 0 0 3px rgba(0,119,170,0.08);}
    [data-theme="light"] .rin::placeholder{color:rgba(100,116,139,0.4);}
    [data-theme="light"] .ric{color:rgba(100,116,139,0.5);}
    [data-theme="light"] .rbtn{background:linear-gradient(135deg,#0077aa,#005580);color:#fff;}
    [data-theme="light"] .rbtn:hover:not(:disabled){box-shadow:0 8px 25px rgba(0,119,170,0.35);}
    [data-theme="light"] .rdivl{background:rgba(203,213,225,0.8);}
    [data-theme="light"] .rdivt{color:rgba(100,116,139,0.5);}
    [data-theme="light"] .rft{color:rgba(100,116,139,0.7);}
    [data-theme="light"] .rft a{color:#0077aa;}
    [data-theme="light"] .dot2{background:rgba(0,119,170,0.15);}
    [data-theme="light"] .dot2.on{background:#0077aa;box-shadow:0 0 8px #0077aa;}
    [data-theme="light"] .rcn{border-color:rgba(0,119,170,0.3);}
    [data-theme="light"] .rstr-seg{background:rgba(203,213,225,0.8);}
  `;

  return (
    <>
      <style>{css}</style>
      <div className="rr">
        <canvas ref={canvasRef} className="rc" />
        <div className="rp">
          <div className="rl">
            <div className="ri">🔎</div>
            <span className="rt">VERIFYIT</span>
            <span className="rsub">Create Your Account</span>
          </div>
          <div className="rcard">
            <div className="rcn tl2" />
            <div className="rcn tr2" />
            <div className="rcn bl2" />
            <div className="rcn br2" />
            <div className="rh">REGISTER TERMINAL</div>
            <div className="rdesc">// initialize new agent profile</div>

            {error && <div className="rerr">⚠ {error}</div>}
            {success && <div className="rok">✓ {success}</div>}

            <form onSubmit={handleSubmit}>
              {fields.map(({ name, type, icon, placeholder }) => (
                <div className="rf" key={name}>
                  <label className={"rlb" + (focused === name ? " on" : "")}>
                    {name === "confirm" ? "Confirm Password" : name}
                  </label>
                  <div className="riw">
                    <span className="ric">{icon}</span>
                    <input
                      className="rin"
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={() => setFocused("")}
                    />
                  </div>
                  {name === "password" && form.password && (
                    <div className="rstr-wrap">
                      <div className="rstr-bar">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="rstr-seg"
                            style={{ background: i <= strength ? strengthColors[strength - 1] : undefined }}
                          />
                        ))}
                      </div>
                      <span className="rstr-label" style={{ color: strength > 0 ? strengthColors[strength - 1] : undefined }}>
                        {strengthLabels[strength]}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              <button className="rbtn" type="submit" disabled={loading}>
                {loading ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span className="sp2" />
                    CREATING PROFILE...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>

            <div className="rdiv">
              <div className="rdivl" />
              <span className="rdivt">or</span>
              <div className="rdivl" />
            </div>
            <div className="rft">
              Already have an account? <a href="/login">Login →</a>
            </div>
            <div className="rdot">
              <div className={"dot2" + (loading ? " on" : "")} />
              <div className={"dot2" + (loading ? " on" : "")} />
              <div className={"dot2" + (loading ? " on" : "")} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}






