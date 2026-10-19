# VoxPay AI — Frontend Web Application

Modern, voice-first Mobile Financial Services (MFS) interface designed for **VoxPay AI** at the **Shenzhen International FinTech Competition (FinTechathon) 2026**.

Inspired by bKash's clean mobile ergonomics, VoxPay enables rural and unbanked populations to execute financial transactions, access instant alternative credit, and protect against climate disasters simply by speaking in their native regional dialect.

---

## 📱 Key Features & Modules

### 1. 🎙 Regional Dialect Voice Engine
- **Dialect Coverage**:
  - প্রমিত বাংলা (Standard Bengali - `bn-BD`)
  - চাঁটগাঁইয়া (Chittagonian Dialect - Coastal accent)
  - ছিলটী (Sylheti Dialect - Surma Valley)
  - Banglish (Romanized youth Bengali)
  - English (Shenzhen FinTechathon Global)
- **Natural Language Intent Parsing**: Automatically maps spoken commands like *"অনরে পাঁচ হাজার টিয়া লোন চাই, দেন না"* or *"রহিমকে ৫০০ টাকা পাঠাও"* into structured transaction intents (`REQUEST_LOAN`, `SEND_MONEY`, `PAY_UTILITY`, `ECNY_REMITTANCE`, `EMERGENCY_RELIEF`).
- **Interactive Spectrogram**: Real-time voice frequency waveforms and audio feedback.

### 2. 🛡 Biometric Voice-Print Auth & Deepfake Guard
- Simulates 98.4% pitch and formant biometric verification.
- Organic breathing liveness detection against AI voice cloning and recorded replay attacks.
- Bio-sensory stress and coercion detection indicators.

### 3. 💳 AI Credit Scoring & Fraud Detection (Live ML Model)
- **1-Click Live Profile Switcher**:
  - 🟢 **করিম মিয়া (Karim Mia) — Rural Farmer**: Low Risk (`default_probability = 13.3%`), Credit Score `785 / 900`, Approved for `৳25,000` instant loan.
  - 🔵 **সালমা আক্তার (Salma Akter) — Urban Gig Worker**: Moderate-High Trust (`default_probability = 14.1%`), Credit Score `742 / 900`, Approved for `৳18,000`.
  - 🔴 **সন্দেহভাজন একাউন্ট (Fraud Ring / Sybil Attacker)**: High Risk (`default_probability = 74.5%`), Credit Score `340 / 900`, Loan Request Blocked (`৳0`).
- **Live Model Telemetry**: Displays the active model version (`vhre-v3-research-1.0.3`) and Platt calibrated default probability directly from the live Render model (`https://voicepay-ai.onrender.com`).
- **Loan Disbursement**: Select loan amounts (৳5,000 – ৳25,000) with 0% interest for the first 30 days and 3-month EMI calculation.

### 4. ⛈ Satellite Weather-Risk Loan Protection
- **Sentinel-3 Radar Feed Simulation**:
  - Cyclone 'Remal' (Signal 8 coastal emergency).
  - Haor Flash Flood Alert (Sylhet basin).
- **Automated Actions**:
  - Instantly freezes upcoming loan installments with 0% interest penalty.
  - Automatically disburses **৳8,500** emergency crop insurance directly into user wallet.

### 5. 🇨🇳 Shenzhen Cross-Border e-CNY Gateway
- Dedicated calculator converting Digital Yuan (e-CNY / ¥) to Bangladeshi Taka (৳) with instant 2.4-second settlement.
- Built specifically for cross-border remittance and bilateral trade scenarios in the Shenzhen FinTechathon.

### 6. 🔐 Zero-Knowledge Proof (ZKP) & On-Chain Audit
- Generates zk-SNARK Groth16 cryptographic proof components (`pi_a`, `pi_b`, `pi_c`, public signals) verifying loan eligibility ($\ge$ ৳10,000) without disclosing private account balances.
- Issues a Soulbound Decentralized Identity (`did:vox:0x89C1...42F7`).

### 7. 🔊 Merchant Smart Soundbox & Core MFS
- Tap-to-reveal bKash-style balance capsule.
- Web Audio API dual-tone synthesized crisp soundbox chime (880Hz + 1318.5Hz).
- Bengali voice confirmation announcement (*"VoxPay এ ৫০০ টাকা সফলভাবে প্রাপ্ত হয়েছে"*).
- Send Money, Mobile Recharge, Utility Bill Pay, and Disaster Relief Fund claims.

### 8. 🤖 GenAI Voice Financial Counselor
- Conversational financial advisor explaining loan safety, micro-savings, and anti-fraud practices in simple vernacular Bangla.

### 9. ⚙️ ML Integration Spec & Subgroup Fairness Modal
- Accessible via the top-right **ML Spec** icon in the navbar.
- Features the full 19-numeric input fields contract, live endpoint URLs, and the **Subgroup Fairness Audit Report** (Male vs. Female and Under-35 vs. 35+ bootstrap confidence intervals).

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS 3 (bKash Rose & Emerald FinTech Dark Mode)
- **Icons**: Lucide React
- **Audio & Speech**: Web Speech API (`SpeechRecognition`, `speechSynthesis`), Web Audio API (`AudioContext`)
- **Effects**: Canvas Confetti

---

## 🚀 Development Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
- Local URL: [http://localhost:5173](http://localhost:5173)
- API requests to `/api` are automatically proxied to the backend at `http://localhost:8000`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets in `dist/`.

---

## 🌐 Deploying on Vercel

When deploying to Vercel, add this Environment Variable in your Vercel Project Settings (**Settings > Environment Variables**):

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-voxpay-backend.onrender.com` | Live deployed backend base URL (no trailing slash) |

In development or if `VITE_API_URL` is omitted, the app defaults to `/api` which is automatically proxied to `http://localhost:8000` via [vite.config.js](file:///c:/Users/alsha/Desktop/VoxPay/frontend/vite.config.js).

