import React from 'react';
import { X, Code2, CheckCircle2, Copy } from 'lucide-react';
import { ML_MODEL_CONFIG } from '../services/mlModelService';

export default function MlSpecModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Code2 size={18} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">ML Team API Integration Spec</h3>
              <p className="text-[11px] text-slate-400">FastAPI / Flask Model Connector</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-brand-400 block mb-1">
              POST /api/v1/predict-loan-risk
            </span>
            <p className="text-[11px] text-slate-300">
              অন্য টিম যখন তাদের মডেল তৈরি করবে, তারা এই পেলোড অনুযায়ী এন্ডপয়েন্ট কানেক্ট করবে।
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Input Payload (JSON):</span>
            <pre className="p-3 rounded-xl bg-black text-cyan-300 font-mono text-[10px] overflow-x-auto border border-slate-800">
{`{
  "applicant_phone": "01712-984521",
  "weekly_recharge_count": 3.8,
  "avg_recharge_bdt": 140,
  "consecutive_utilities_paid": 14,
  "peer_trust_velocity_index": 88,
  "rwa_collateral_token": true,
  "sim_age_days": 1450
}`}
            </pre>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Expected Output (JSON):</span>
            <pre className="p-3 rounded-xl bg-black text-emerald-300 font-mono text-[10px] overflow-x-auto border border-slate-800">
{`{
  "decision": "TRUSTED",      // "TRUSTED" or "FRAUD_RISK"
  "risk_score": 0.04,          // 0.00 to 1.00
  "credit_score": 785,         // 300 to 900
  "approved_loan_limit": 25000,// in BDT
  "explainability_reasons": ["Frequent recharge", "Clean utility"]
}`}
            </pre>
          </div>

          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-center space-x-1.5">
            <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
            <span>Frontend service (`mlModelService.js`) প্রস্তুত রয়েছে।</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          বন্ধ করুন
        </button>

      </div>
    </div>
  );
}
