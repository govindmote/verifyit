# VerifyIt ⛓️
### Blockchain-Powered Decentralized Fact-Checking System

> A full-stack Web3 application that combats misinformation through community-driven voting, AI-powered analysis, and immutable blockchain verdict recording on Polygon Amoy Testnet.

---

## 📌 Project Overview

**VerifyIt** is a decentralized fact-checking platform where users submit suspicious claims, vote on their authenticity, and receive verdicts permanently recorded on the blockchain. Every verdict is tamper-proof, transparent, and verifiable by anyone.

Built as a final year project for **BSc Blockchain Technology**, Savitribai Phule Pune University (2025–2026).

**Submitted by:** Govind Mote  
**Guide:** Asst. Prof. Sahil Shaikh  

---

## 🚀 Features

- **Claim Submission** — Submit rumors, fake news, or suspicious claims with source URL
- **Community Voting** — Users vote TRUE / FALSE; reputation-weighted voting system
- **AI Analysis** — Claude AI analyzes each claim before voting and returns confidence score + verdict
- **Blockchain Verdict Recording** — Final verdicts stored immutably on Polygon Amoy Testnet via Solidity smart contract
- **Blockchain Explorer** — View all on-chain transaction hashes and verify on PolygonScan
- **Download Certificate** — Verified/debunked claims generate a shareable certificate
- **Admin Override** — Admin can manually set verdict and override community voting
- **Cyberpunk Dark UI** — Full responsive dark theme with animated timeline, verdict reveal animation
- **Reputation System** — Voters gain/lose reputation based on correctness of their vote

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Blockchain | Solidity, Hardhat, Ethers.js |
| Network | Polygon Amoy Testnet (Chain ID: 80002) |
| AI | Claude API (Anthropic) |
| Auth | JWT + localStorage |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
factcheck/
├── factcheck-frontend/          # React frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.js
│       │   ├── Submit.js
│       │   ├── Vote.js
│       │   ├── Verdict.js
│       │   ├── Explorer.js
│       │   ├── Dashboard.js
│       │   └── Profile.js
│       └── components/
│           ├── AIAnalysis.js
│           └── BlockchainConfirm.js
│
├── factcheck-backend/           # Node.js + Express backend
│   ├── routes/
│   │   ├── claims.js
│   │   ├── votes.js
│   │   ├── users.js
│   │   └── admin.js
│   ├── models/
│   │   ├── Claim.js
│   │   ├── Vote.js
│   │   └── User.js
│   ├── blockchain/
│   │   └── VerifyIt.json        # Compiled contract ABI
│   ├── blockchainService.js     # Ethers.js integration
│   └── server.js
│
└── contracts/                   # Solidity smart contracts
    └── VerifyIt.sol
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local)
- MetaMask wallet with Polygon Amoy POL tokens

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/factcheck.git
cd factcheck
```

### 2. Backend setup
```bash
cd factcheck-backend
npm install
```

Create `.env` file:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/factcheck
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://rpc-amoy.polygon.technology/
CONTRACT_ADDRESS=0x72C2d53659368608c5216453D00497eCF319a210
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_claude_api_key
```

Start backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd factcheck-frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

---

## 📜 Smart Contract

**Contract Name:** VerifyIt Fact Checker v1.0  
**Network:** Polygon Amoy Testnet  
**Contract Address:** `0x72C2d53659368608c5216453D00497eCF319a210`  
**Explorer:** [View on PolygonScan](https://amoy.polygonscan.com/address/0x72C2d53659368608c5216453D00497eCF319a210)

### Key Functions
```solidity
storeVerdict(claimId, title, verdict, trueVotes, falseVotes)
getVerdict(claimId)
```

---

## 🔄 How It Works

```
User submits claim
       ↓
Claude AI analyzes claim (confidence score + preliminary verdict)
       ↓
Community votes TRUE / FALSE (minimum 3 votes required)
       ↓
Verdict calculated (60%+ TRUE → VERIFIED, 40%- → MARKED FALSE)
       ↓
Verdict stored on Polygon Amoy blockchain (immutable)
       ↓
Transaction hash recorded → verifiable on PolygonScan
```

---

## 🗳️ Verdict Logic

| Condition | Verdict |
|---|---|
| TRUE votes ≥ 60% (min 3 votes) | ✅ VERIFIED TRUE |
| FALSE votes ≥ 60% (min 3 votes) | ❌ MARKED FALSE |
| Neither threshold met | ⚠️ UNVERIFIED |

Votes are **reputation-weighted** — users with higher reputation have more voting power (max 5.0x).

---

## 🤖 AI Analysis

Each claim is analyzed by **Claude (Anthropic)** which returns:
- Confidence score (0–100%)
- Preliminary verdict (LIKELY TRUE / LIKELY FALSE / UNCERTAIN)
- Key reasoning points

AI analysis is advisory only — final verdict is determined by community votes.

---

## 📊 Dashboard Stats

- Total claims submitted
- Verified TRUE count
- Marked FALSE count  
- Total votes cast
- On-chain records
- Verdict distribution chart
- Live Polygon Amoy network status

---

## 🔐 Security

- JWT-based authentication
- Duplicate vote prevention (one vote per user per claim)
- Smart contract owner-only admin functions
- Private key stored in `.env` (never committed to Git)

---

## 📸 Screenshots

| Page | Description |
|---|---|
| Home | Landing page with live stats |
| Submit | Claim submission form |
| Vote | Community voting with AI analysis |
| Verdicts | All settled claims with blockchain proof |
| Explorer | On-chain transaction records |
| Dashboard | Live network + stats overview |

---

## 👨‍💻 Author

**Govind Mote**  
BSc Blockchain Technology  
Savitribai Phule Pune University, Pune  
Academic Year: 2025–2026

---

## 📄 License

This project is submitted as academic coursework under BBT-401.  
© 2026 Govind Mote. All rights reserved.
