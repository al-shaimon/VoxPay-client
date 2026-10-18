import React, { useState } from 'react';
import { 
  Cpu, Network, ShieldCheck, Zap, Radio, Globe, 
  Terminal, Code2, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react';

export default function FintechathonTelemetry({ wallet }) {
  const [activeTab, setActiveTab] = useState('ml_spec');

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Network size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">
              Shenzhen FinTechathon Node Telemetry
            </h3>
            <p className="text-[11px] text-slate-400">
              Agentic AI • Web3 ZKP • Post-Quantum Cryptography
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ONLINE</span>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('ml_spec')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'ml_spec'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ML Team API Spec
        </button>
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'nodes'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CBDC & Nodes
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'security'
              ? 'bg-brand-500 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          PQC & Privacy
        </button>
      </div>

      {/* Tab 1: ML Model Integration Spec */}
      {activeTab === 'ml_spec' && (
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-brand-400 uppercase tracking-wider block mb-1">
              POST /api/v1/predict-loan-risk
            </span>
            <p className="text-[11px] text-slate-300">
              When the ML team completes their model (Flask/FastAPI/Node), they can hook directly to this schema:
            </p>
          </div>

          <pre className="p-3 rounded-xl bg-black text-cyan-300 font-mono text-[10px] overflow-x-auto leading-relaxed border border-slate-800">
{`// Input Features Payload:
{
  "applicant_phone": "${wallet.phone}",
  "weekly_recharge_count": 3.8,
  "avg_recharge_bdt": 140,
  "consecutive_utilities_paid": 14,
  "peer_trust_velocity_index": 88,
  "rwa_collateral_token": true,
  "sim_age_days": 1450
}

// Expected Model Output:
{
  "decision": "TRUSTED",      // "TRUSTED" | "FRAUD_RISK"
  "risk_score": 0.04,          // 0.00 to 1.00
  "credit_score": 785,         // 300 to 900
  "approved_loan_limit": 25000,// in BDT
  "explainability_reasons": ["Frequent recharge", "Clean utility"]
}`}
          </pre>
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-center space-x-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>Frontend service (`mlModelService.js`) ready for instant live switch!</span>
          </div>
        </div>
      )}

      {/* Tab 2: CBDC & Mesh Network Nodes */}
      {activeTab === 'nodes' && (
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Shenzhen e-CNY Bridge:</span>
              <span className="text-[10px] text-emerald-400 font-mono">LATENCY: 18ms</span>
            </div>
            <p className="text-[11px] text-slate-400">
              PBOC Digital Currency Institute Node #04 (Nanshan, Shenzhen)
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white">Offline BLE Mesh Protocol:</span>
              <span className="text-[10px] text-cyan-400 font-mono">3 PEERS NEARBY</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Enables offline P2P transfers in zero-connectivity village zones with deferred on-chain sync.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Post-Quantum Cryptography & Privacy */}
      {activeTab === 'security' && (
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="font-semibold text-white block mb-1">
              Quantum-Resistant Lattice Key (CRYSTALS-Dilithium):
            </span>
            <span className="font-mono text-[10px] text-purple-300 break-all block">
              pqc_vox_89f029a1b0c99e419820f12cba774
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-white block">
              Bio-Sensory Coercion & Stress Guard:
            </span>
            <p className="text-[11px] text-slate-400">
              Detects speech pitch tremors and stress indicators during coerced transfers, triggering a silent distress signal.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
