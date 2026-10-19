import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Cpu, CheckCircle2, 
  ExternalLink, Sparkles, FileCode2, Copy, Check 
} from 'lucide-react';
import { zkpEngine } from '../services/zkpSimulator';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';

export default function ZkpVerificationModal({ 
  isOpen, 
  onClose, 
  wallet, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [zkpResult, setZkpResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      voiceEngine.stopSpeaking();
    };
  }, []);

  const handleClose = () => {
    voiceEngine.stopSpeaking();
    onClose();
  };

  if (!isOpen) return null;

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    const res = await zkpEngine.generateLoanProof({
      threshold: 10000,
      actualBalance: wallet.bdtBalance,
      riskScore: wallet.fraudRiskLevel === 'LOW_RISK' ? 0.04 : 0.88
    });

    setZkpResult(res);
    setIsGenerating(false);

    if (soundEnabled) {
      const speech = lang === 'en'
        ? 'Zero-Knowledge Proof successfully generated and verified on-chain. Creditworthiness and transaction integrity verified with zero data leakage.'
        : 'জিরো নলেজ প্রুফ সফলভাবে তৈরি ও অন-চেইনে ভেরিফাইড হয়েছে। ব্যক্তিগত কোনো আর্থিক তথ্য ফাঁস না করেই ক্রেডিট যোগ্যতা ও লেনদেন সততা প্রমাণিত।';
      voiceEngine.speakText(speech, lang === 'en' ? 'en-US' : 'bn-BD', false);
    }
  };

  const handleCopyHash = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-brand-500 to-cyan-500" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Zero-Knowledge Proof (ZKP) Verification' : 'Zero-Knowledge Proof (ZKP) যাচাইকরণ'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Verify loan creditworthiness on-chain without revealing private balance' : 'ব্যালেন্স ও আর্থিক ইতিহাস গোপন রেখে অন-চেইন লোন যোগ্যতা প্রমাণ'}
            </p>
          </div>
        </div>

        {/* Plain Language Explainer */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
          <span className="font-semibold text-purple-300 block mb-1">
            🔒 {lang === 'en' ? 'Privacy-First Guarantee:' : 'গোপনীয়তা সুরক্ষা (Privacy-First Guarantee):'}
          </span>
          {lang === 'en'
            ? `Banks or lending partners cannot see your real balance (৳${wallet.bdtBalance.toLocaleString('en-US')}). Mathematical zk-SNARK proof only confirms: your financial holding is >= ৳10,000.`
            : `ব্যাংক বা ঋণদানকারী প্রতিষ্ঠান আপনার আসল ব্যালেন্স (৳${wallet.bdtBalance.toLocaleString('en-IN')}) দেখতে পাবে না। গণিতসম্মত zk-SNARK প্রুফ শুধু নিশ্চিত করবে: আপনার আর্থিক অবস্থান ৳১০,০০০ এর সমান বা বেশি।`}
        </div>

        {/* User Identity & Soulbound DID */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Soulbound DID:</span>
            <span className="font-mono text-cyan-300 font-semibold">{wallet.soulboundDid}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 text-[11px] block">Verification Standard:</span>
            <span className="font-medium text-emerald-300">zk-SNARK Groth16 (bn128)</span>
          </div>
        </div>

        {/* ZKP Output Console if generated */}
        {zkpResult ? (
          <div className="rounded-2xl bg-slate-950 p-4 border border-purple-500/30 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 size={14} />
                <span>On-Chain Verification: PASS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Block #{zkpResult.blockNumber}
              </span>
            </div>

            <div className="text-[11px] font-mono text-slate-300 space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Proof Hash:</span>
                <button
                  onClick={() => handleCopyHash(zkpResult.proofHash)}
                  className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
                >
                  <span>{zkpResult.proofHash.substring(0, 16)}...</span>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verifier Contract:</span>
                <span className="text-slate-300">{zkpResult.verifierAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gas Used:</span>
                <span className="text-emerald-400">{zkpResult.gasUsed}</span>
              </div>
            </div>

            <p className="text-xs text-emerald-300 font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/60">
              ✅ {lang === 'en' ? 'Statement Verified: ' : 'স্টেটমেন্ট প্রমাণিত: '}{zkpResult.statementVerified}
            </p>
          </div>
        ) : (
          <div className="text-center py-6 px-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 mb-5">
            <Cpu size={32} className="mx-auto text-purple-400/70 mb-2" />
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Click below to generate cryptographic zk-SNARK proof' : 'zk-SNARK ক্রিপ্টোগ্রাফিক প্রুফ তৈরি করতে নিচের বাটনে চাপ দিন'}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>

          <button
            onClick={handleGenerateProof}
            disabled={isGenerating}
            className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-brand-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg transition"
          >
            {isGenerating ? (
              <>
                <Cpu size={16} className="animate-spin text-purple-200" />
                <span>{lang === 'en' ? 'Generating Proof...' : 'প্রুফ জেনারেট হচ্ছে...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>
                  {zkpResult
                    ? (lang === 'en' ? 'Regenerate Proof' : 'পুনরায় প্রুফ তৈরি করুন')
                    : (lang === 'en' ? 'Generate zk-SNARK Proof' : 'zk-SNARK প্রুফ জেনারেট করুন')}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
