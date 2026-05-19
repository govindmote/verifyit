import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubmitClaim from "./pages/SubmitClaim";
import Vote from "./pages/Vote";
import Verdict from "./pages/Verdict";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import AdminPanel from "./pages/AdminPanel";
import HowItWorks from "./pages/HowItWorks";

const LoginRequired = () => {
  const navigate = useNavigate();
  const [count, setCount] = React.useState(10);
  React.useEffect(() => {
    if (count === 0) { navigate("/login"); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);
  return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1.5rem",fontFamily:"'Share Tech Mono',monospace"}}>
      <div style={{fontSize:"3rem"}}>&#128274;</div>
      <div style={{fontFamily:"'Orbitron',monospace",fontSize:"1.2rem",color:"#00f5ff",letterSpacing:"0.1em"}}>ACCESS DENIED</div>
      <div style={{color:"#64748b",fontSize:"0.85rem"}}>You must be logged in to vote.</div>
      <div style={{color:"#ffd700",fontSize:"0.75rem"}}>Redirecting in <span style={{fontSize:"1.1rem",color:"#ff3366",fontWeight:"700"}}>{count}</span> seconds...</div>
      <button onClick={() => navigate("/login")} style={{background:"linear-gradient(135deg,#00f5ff,#0088bb)",border:"none",borderRadius:"8px",padding:"0.7rem 2rem",color:"#000",fontFamily:"'Orbitron',monospace",fontSize:"0.75rem",fontWeight:"700",letterSpacing:"0.1em",cursor:"pointer"}}>
        LOGIN NOW
      </button>
    </div>
  );
};

const Protected = ({ children }) => {
  return localStorage.getItem("token") ? children : <LoginRequired />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitClaim />} />
        <Route path="/vote" element={<Protected><Vote /></Protected>} />
        <Route path="/vote/:id" element={<Protected><Vote /></Protected>} />
        <Route path="/verdicts" element={<Verdict />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explorer" element={<BlockchainExplorer />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/howto" element={<HowItWorks />} />
      </Routes>
    </Router>
  );
}

export default App;
