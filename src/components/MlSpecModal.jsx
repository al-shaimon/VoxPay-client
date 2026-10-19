import React, { useState } from 'react';
import { X, Code2, CheckCircle2, ExternalLink, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export default function MlSpecModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('api'); // 'api' | 'fairness'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Code2 size={18} />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white">VoicePay AI — ML Integration & Fairness Spec</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  LIVE on Render
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Model: vhre-v3-research-1.0.3 • Platt Calibrated</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-3 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition ${
              activeTab === 'api' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔌 API Spec (19 Features)
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition ${
              activeTab === 'fairness' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Fairness & Audit Report
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-3 space-y-3 text-xs pr-1">
          {activeTab === 'api' ? (
            <>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                    POST https://voicepay-ai.onrender.com/predict
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Deployed FastAPI Ensemble • Platt Calibrated Default Risk Classifier
                  </p>
                </div>
                <a
                  href="https://voicepay-ai.onrender.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] flex items-center space-x-1 border border-cyan-800/40"
                >
                  <span>Open Docs</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">
                  Input: 19 Numeric Features (JSON):
                </span>
                <pre className="p-2.5 rounded-xl bg-black text-cyan-300 font-mono text-[10px] overflow-x-auto border border-slate-800 max-h-40">
{`{
  "credit_limit": 20000,
  "pay_sep": 2, "pay_aug": 2, "pay_jul": -1, "pay_jun": 1, "pay_may": -1, "pay_apr": 2,
  "bill_sep": 3913, "bill_aug": 3102, "bill_jul": 689, "bill_jun": 0, "bill_may": 0, "bill_apr": 0,
  "payment_sep": 0, "payment_aug": 689, "payment_jul": 0, "payment_jun": 0, "payment_may": 0, "payment_apr": 0
}`}
                </pre>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">
                  Output: Live Calibrated Risk Verdict (JSON):
                </span>
                <pre className="p-2.5 rounded-xl bg-black text-emerald-300 font-mono text-[10px] overflow-x-auto border border-slate-800">
{`{
  "prediction": 1,
  "prediction_label": "high_risk",
  "default_probability": 0.744736,
  "probability_type": "platt_calibrated",
  "threshold": 0.276105,
  "model_version": "vhre-v3-research-1.0.3"
}`}
                </pre>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                <span>
                  লাইভ সার্ভারের সাথে ব্যাকএন্ড ও ফ্রন্টএন্ড সফলভাবে সংযুক্ত। ডিফল্ট প্রবাবিলিটি স্বয়ংক্রিয়ভাবে ৩০০০-৯০০ ক্রেডিট স্কোরে কনভার্ট হয়।
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-1.5 text-brand-400 font-bold text-xs">
                  <ShieldCheck size={14} />
                  <span>Subgroup Fairness Audit (Research Methodology)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A subgroup fairness audit was conducted on the held-out, group-aware test set using <strong>sex</strong> and <strong>age</strong> categories. Demographic attributes were strictly excluded from predictive input features and retained solely for post-hoc auditing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Male vs Female Comparison
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Positive prediction rate difference: <strong>+2.66 pp</strong> (95% CI: 0.52 to 4.87 pp). Differences in TPR, FPR, precision, and Brier score included zero.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Under-35 vs 35+ Comparison
                  </span>
                  <p className="text-[11px] text-slate-300">
                    All five metric differences (95% CI) included zero. Precision difference was −4.14 pp (95% CI: −9.40 to 1.13 pp).
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-200 flex items-start space-x-2">
                <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-300">
                  <strong className="text-amber-300">Research Note:</strong> Findings are exploratory using the benchmark credit dataset. Real-world commercial deployment in Bangladesh requires local MFS representative data retraining and continual calibration.
                </p>
              </div>
            </div>
          )}
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
