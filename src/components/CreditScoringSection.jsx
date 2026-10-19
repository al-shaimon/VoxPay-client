import React, { useState } from 'react';
import { 
  ShieldCheck, AlertOctagon, Cpu, CheckCircle2, 
  Sparkles, Smartphone, Zap, Users, ShieldAlert, ArrowRight 
} from 'lucide-react';
import { ALTERNATIVE_DATA_FACTORS } from '../constants/data';
import { mlModelService, PRESET_USER_PROFILES } from '../services/mlModelService';
import { voiceEngine } from '../services/voiceEngine';

export default function CreditScoringSection({ 
  wallet, 
  onApplyLoan, 
  soundEnabled 
}) {
  const [selectedProfileId, setSelectedProfileId] = useState('profile_trusted_farmer');
  const [prediction, setPrediction] = useState(PRESET_USER_PROFILES[0].expectedResult);
  const [isInferring, setIsInferring] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(15000);

  const handleProfileChange = async (profileId) => {
    setSelectedProfileId(profileId);
    setIsInferring(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    const result = await mlModelService.predictLoanRisk(null, profileId);
    setPrediction(result);
    setIsInferring(false);

    if (soundEnabled) {
      if (result.decision === 'TRUSTED') {
        voiceEngine.speakText(`এআই ক্রেডিট স্কোর ${result.creditScore}। আপনি লোন অনুমোদিত।`, 'bn-BD', false);
      } else {
        voiceEngine.speakText('সন্দেহজনক কার্যক্রম সনাক্ত হয়েছে। লোন আবেদন স্থগিত।', 'bn-BD', false);
      }
    }
  };

  const isTrusted = prediction.decision === 'TRUSTED';
  const loanOptions = [5000, 10000, 15000, 25000];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Demo Switcher */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-brand-500/20 text-brand-400">
              <Cpu size={18} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              AI বিকল্প ক্রেডিট স্কোরিং ও ঝুঁকি নিরূপণ
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            মোবাইল রিচার্জ, বিদ্যুৎ বিল ও পিয়ার ট্রানজেকশন ভিত্তিক স্মার্ট লোন অনুমোদন
          </p>
        </div>

        {/* Demo Switcher Pills */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center space-x-1">
            <Sparkles size={12} className="text-yellow-400" />
            <span className="hidden sm:inline">ML টেস্ট:</span>
          </span>
          <button
            onClick={() => handleProfileChange('profile_trusted_farmer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProfileId === 'profile_trusted_farmer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🟢 কৃষক (Karim)
          </button>
          <button
            onClick={() => handleProfileChange('profile_gig_worker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProfileId === 'profile_gig_worker'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🔵 গিগ (Salma)
          </button>
          <button
            onClick={() => handleProfileChange('profile_fraud_ring')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProfileId === 'profile_fraud_ring'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🔴 ফ্রড রিং
          </button>
        </div>
      </div>

      {/* Main Responsive Grid: Laptop (2 Columns) / Mobile (Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (5 Cols): Score Wheel & Loan Application Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                মডেল ফলাফল (AI Verdict)
              </span>
              {isTrusted ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 size={13} />
                  <span>TRUSTED (Low Risk)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 text-xs font-bold flex items-center space-x-1">
                  <AlertOctagon size={13} />
                  <span>FRAUD RISK (High)</span>
                </span>
              )}
            </div>

            {/* Score Number Display */}
            <div className={`text-center p-5 rounded-2xl border my-3 ${
              isTrusted 
                ? 'bg-gradient-to-b from-slate-950 to-emerald-950/20 border-emerald-500/30' 
                : 'bg-gradient-to-b from-slate-950 to-red-950/20 border-red-500/30'
            }`}>
              <span className="text-xs text-slate-400 font-medium">এআই বিকল্প ক্রেডিট স্কোর</span>
              <div className="flex items-baseline justify-center space-x-1.5 mt-1">
                <span className={`text-5xl font-black tracking-tight ${
                  isTrusted ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {prediction.creditScore}
                </span>
                <span className="text-slate-500 font-mono text-sm">/ ৯০০</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mt-1">
                {prediction.verdictText}
              </p>
              <div className="mt-2 flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                  ডিফল্ট ঝুঁকি: {((prediction.riskScore || 0) * 100).toFixed(1)}%
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300">
                  vhre-v3 (Render)
                </span>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              {prediction.explanation}
            </p>
          </div>

          {/* Loan Amount Selector & CTA */}
          {isTrusted ? (
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">ঋণের পরিমাণ:</span>
                <span className="text-brand-400 font-semibold">০% সুদ (প্রথম ৩০ দিন)</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {loanOptions.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition text-center ${
                      selectedAmount === amt
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ৳{amt >= 1000 ? `${amt / 1000}K` : amt}
                  </button>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between text-xs">
                <span className="text-slate-400">মাসিক কিস্তি (৩ মাস):</span>
                <span className="font-bold text-white">৳{Math.round((selectedAmount * 1.02) / 3)}/মাস</span>
              </div>

              <button
                onClick={() => onApplyLoan(selectedAmount, prediction)}
                disabled={isInferring}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition active:scale-98 flex items-center justify-center space-x-2"
              >
                <ShieldCheck size={16} />
                <span>৳{selectedAmount.toLocaleString('en-IN')} তাৎক্ষণিক ঋণ গ্রহণ করুন</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
              <ShieldAlert size={28} className="mx-auto text-red-400" />
              <h4 className="text-xs font-bold text-white">লোন আবেদন সাময়িক স্থগিত</h4>
              <p className="text-[11px] text-slate-400">
                অস্বাভাবিক সিম ও ট্রানজেকশন অ্যাক্টিভিটির কারণে লোন সুবিধা সাময়িক নিষ্ক্রিয়।
              </p>
            </div>
          )}

        </div>

        {/* Right Column (7 Cols): 4 Alternative Data Pillars & Weights */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              বিকল্প ডেটা প্যারামিটারসমূহ (Alternative Data Pillars)
            </h4>
            <span className="text-xs font-mono text-brand-400">মোট ওয়েট: ১০০%</span>
          </div>

          <div className="space-y-3.5">
            {ALTERNATIVE_DATA_FACTORS.map((factor) => (
              <div 
                key={factor.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-bold text-white">{factor.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      ({factor.enName})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400 font-mono">ওয়েট {factor.weight}</span>
                    <span className="text-xs font-extrabold text-brand-400 font-mono">
                      {factor.score}/১০০
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {factor.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
