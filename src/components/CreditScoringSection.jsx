import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertOctagon, Cpu, CheckCircle2,
  Sparkles, Zap, ShieldAlert, ArrowRight, TrendingUp, Volume2
} from 'lucide-react';
import { ALTERNATIVE_DATA_FACTORS } from '../constants/data';
import { mlModelService, PRESET_USER_PROFILES } from '../services/mlModelService';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';

const PROFILES = [
  { id: 'profile_trusted_farmer', label: 'করিম মিয়া', enLabel: 'Karim Mia', sub: 'কৃষক · Trusted', enSub: 'Farmer · Trusted', emoji: '🟢', accent: '#10b981' },
  { id: 'profile_gig_worker',     label: 'সালমা আক্তার', enLabel: 'Salma Akter', sub: 'গিগ ওয়ার্কার', enSub: 'Gig Worker', emoji: '🔵', accent: '#3b82f6' },
  { id: 'profile_fraud_ring',     label: 'সন্দেহভাজন', enLabel: 'Suspicious', sub: 'ফ্রড রিং', enSub: 'Fraud Ring', emoji: '🔴', accent: '#ef4444' },
];

export default function CreditScoringSection({ wallet, onApplyLoan, soundEnabled }) {
  const { lang, t } = useLanguage();
  const [selectedProfileId, setSelectedProfileId] = useState('profile_trusted_farmer');
  const [prediction, setPrediction] = useState(PRESET_USER_PROFILES[0].expectedResult);
  const [isInferring, setIsInferring] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(15000);

  // Stop audio immediately if user navigates away or unmounts this section
  useEffect(() => {
    return () => {
      voiceEngine.stopSpeaking();
    };
  }, []);

  const getPredictionSpeechText = (pred, currentLang = 'bn') => {
    if (!pred) return '';
    const riskPercent = ((pred.riskScore || 0) * 100).toFixed(1);
    const scoreVal = pred.creditScore || 750;
    const isTrusted = pred.decision === 'TRUSTED';

    if (currentLang === 'en') {
      if (isTrusted) {
        return `AI credit score is ${scoreVal} out of 900. Verdict: Trusted, low risk. Default probability is only ${riskPercent} percent. Pre-approved for up to 25,000 BDT instant loan at zero percent interest.`;
      } else {
        return `AI credit score is ${scoreVal} out of 900. Verdict: High default risk. Default probability is ${riskPercent} percent. Loan application temporarily suspended for security.`;
      }
    } else {
      if (isTrusted) {
        return `এআই বিকল্প ক্রেডিট স্কোর ৯০০ এর মধ্যে ${scoreVal}। এআই মূল্যায়ন: বিশ্বস্ত ও অত্যন্ত কম ঝুঁকিপূর্ণ। সম্ভাব্য ডিফল্ট ঝুঁকি মাত্র ${riskPercent} শতাংশ। আপনি সর্বোচ্চ ২৫,০০০ টাকা পর্যন্ত তাৎক্ষণিক শূন্য শতাংশ সুদে লোন গ্রহণের জন্য অনুমোদিত।`;
      } else {
        return `এআই বিকল্প ক্রেডিট স্কোর ৯০০ এর মধ্যে ${scoreVal}। এআই মূল্যায়ন: উচ্চ ঝুঁকি ও সম্ভাব্য ফ্রড সনাক্ত। সম্ভাব্য ডিফল্ট ঝুঁকি ${riskPercent} শতাংশ। আর্থিক সুরক্ষার স্বার্থে লোন আবেদন সাময়িকভাবে স্থগিত রাখা হয়েছে।`;
      }
    }
  };

  const handleProfileChange = async (profileId) => {
    setSelectedProfileId(profileId);
    setIsInferring(true);
    if (soundEnabled) voiceEngine.playSoundboxChime();

    const result = await mlModelService.predictLoanRisk(null, profileId);
    setPrediction(result);
    setIsInferring(false);

    if (soundEnabled) {
      const fullSpeech = getPredictionSpeechText(result, lang);
      const voiceCode = lang === 'en' ? 'en-US' : 'bn-BD';
      voiceEngine.speakText(fullSpeech, voiceCode, false);
    }
  };

  const handlePlayVoice = () => {
    const fullSpeech = getPredictionSpeechText(prediction, lang);
    const voiceCode = lang === 'en' ? 'en-US' : 'bn-BD';
    voiceEngine.speakText(fullSpeech, voiceCode, false);
  };

  const isTrusted = prediction.decision === 'TRUSTED';
  const loanOptions = [5000, 10000, 15000, 25000];
  const scorePercent = ((prediction.creditScore - 300) / 600) * 100;

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(226,19,110,0.15)' }}>
              <Cpu size={20} style={{ color: '#f472b6' }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t('credit.title', 'AI বিকল্প ক্রেডিট স্কোরিং')}</h2>
              <p className="text-xs" style={{ color: '#64748b' }}>{t('credit.subtitle', 'মোবাইল রিচার্জ, বিল ও পিয়ার ট্রানজেকশন বিশ্লেষণ')}</p>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl flex-shrink-0" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2" style={{ color: '#475569' }}>
              <Sparkles size={10} className="inline mr-1 text-yellow-400" />{t('credit.mlTestProfiles', 'ML টেস্ট:')}
            </span>
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProfileChange(p.id)}
                disabled={isInferring}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                style={selectedProfileId === p.id
                  ? { background: `${p.accent}25`, color: p.accent, border: `1px solid ${p.accent}40` }
                  : { color: '#64748b', background: 'transparent', border: '1px solid transparent' }}
              >
                {p.emoji} {lang === 'en' ? p.enLabel.split(' ')[0] : p.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Score + Loan Apply */}
        <div className="lg:col-span-5 card space-y-4">

          {/* Verdict Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#475569' }}>{t('credit.aiVerdict', 'AI Verdict')}</span>
              <button
                onClick={handlePlayVoice}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                title={t('credit.listenVoice', 'ভয়েস শুনুন')}
              >
                <Volume2 size={13} className="text-pink-400" />
              </button>
            </div>
            {isTrusted ? (
              <span className="badge badge-green flex items-center gap-1">
                <CheckCircle2 size={11} /> Trusted · Low Risk
              </span>
            ) : (
              <span className="badge badge-red flex items-center gap-1">
                <AlertOctagon size={11} /> Fraud Risk · High
              </span>
            )}
          </div>

          {/* Score Display */}
          <div className="rounded-2xl p-5 text-center space-y-2"
            style={isTrusted
              ? { background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }
              : { background: 'rgba(239,68,68,0.06)',  border: '1px solid rgba(239,68,68,0.2)' }}>
            <p className="text-[11px] text-slate-400">{t('credit.altScore', 'বিকল্প AI ক্রেডিট স্কোর')}</p>
            <div>
              {isInferring ? (
                <div className="flex items-center justify-center gap-2 py-3">
                  <Zap size={20} className="animate-blink" style={{ color: '#f472b6' }} />
                  <span className="text-sm text-slate-400 animate-blink">{t('credit.analyzing', 'মডেল বিশ্লেষণ করছে...')}</span>
                </div>
              ) : (
                <span className="text-6xl font-black" style={{ color: isTrusted ? '#10b981' : '#ef4444' }}>
                  {prediction.creditScore}
                </span>
              )}
              <p className="text-slate-500 text-sm">{t('credit.outOf900', '/ ৯০০')}</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${scorePercent}%`, background: isTrusted ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} />
            </div>
            <p className="text-sm font-semibold text-white">{prediction.verdictText}</p>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                {t('credit.defaultRisk', 'ডিফল্ট ঝুঁকি:')} {((prediction.riskScore || 0) * 100).toFixed(1)}%
              </span>
              <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee' }}>
                vhre-v3 · Render
              </span>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-xs leading-relaxed px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' }}>
            {prediction.explanation}
          </p>

          {/* Loan Apply or Blocked */}
          {isTrusted ? (
            <div className="space-y-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{t('credit.loanAmount', 'ঋণের পরিমাণ:')}</span>
                <span className="font-semibold" style={{ color: '#f472b6' }}>{t('credit.zeroInterest', '০% সুদ (প্রথম ৩০ দিন)')}</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {loanOptions.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className="py-2.5 px-1 rounded-xl text-xs font-bold transition-all text-center"
                    style={selectedAmount === amt
                      ? { background: 'rgba(226,19,110,0.2)', color: '#f472b6', border: '1px solid rgba(226,19,110,0.4)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    ৳{amt >= 1000 ? `${amt / 1000}K` : amt}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Monthly EMI (3 Mo):' : 'মাসিক কিস্তি (৩ মাস):'}</span>
                <span className="font-bold text-white">৳{Math.round((selectedAmount * 1.02) / 3)}{lang === 'en' ? '/mo' : '/মাস'}</span>
              </div>

              <button
                onClick={() => onApplyLoan(selectedAmount, prediction)}
                disabled={isInferring}
                className="w-full btn-primary py-3 text-sm disabled:opacity-50"
              >
                <ShieldCheck size={15} />
                ৳{selectedAmount.toLocaleString('en-IN')} {t('credit.applyLoan', 'তাৎক্ষণিক ঋণ নিন')}
              </button>
            </div>
          ) : (
            <div className="text-center p-5 rounded-2xl space-y-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <ShieldAlert size={30} className="mx-auto" style={{ color: '#f87171' }} />
              <h4 className="text-sm font-bold text-white">{t('credit.suspended', 'লোন আবেদন স্থগিত')}</h4>
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                {lang === 'en' ? 'Anomalous transactional activity detected.' : 'অস্বাভাবিক ট্রানজেকশন অ্যাক্টিভিটি সনাক্ত হয়েছে।'}
              </p>
            </div>
          )}
        </div>

        {/* Right: Alternative Data Factors */}
        <div className="lg:col-span-7 card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{t('credit.factorsTitle', 'বিকল্প ডেটা প্যারামিটার')}</h3>
            <span className="text-xs font-mono" style={{ color: '#f472b6' }}>{lang === 'en' ? 'Total Weight: 100%' : 'মোট ওয়েট: ১০০%'}</span>
          </div>

          <div className="space-y-3">
            {ALTERNATIVE_DATA_FACTORS.map((factor) => (
              <div key={factor.id} className="p-4 rounded-2xl transition-all"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-white">{factor.name}</span>
                    <span className="text-[11px] ml-1.5" style={{ color: '#475569' }}>({factor.enName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono" style={{ color: '#475569' }}>ওয়েট {factor.weight}</span>
                    <span className="text-sm font-black" style={{ color: '#f472b6' }}>{factor.score}/১০০</span>
                  </div>
                </div>

                <div className="progress-bar mb-2">
                  <div className="progress-fill" style={{ width: `${factor.score}%` }} />
                </div>

                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{factor.detail}</p>
              </div>
            ))}
          </div>

          {/* Research Disclaimer */}
          <div className="p-3 rounded-xl text-[11px] leading-relaxed" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
            <strong>⚠️ গবেষণা মডেল:</strong> এই মডেল তাইওয়ান ক্রেডিট কার্ড ডেটাসেটে প্রশিক্ষিত। বাংলাদেশের বাস্তব মাইক্রো-ফিনান্সে প্রয়োগের আগে স্থানীয় ডেটায় পুনরায় প্রশিক্ষণ প্রয়োজন।
          </div>
        </div>

      </div>
    </div>
  );
}
