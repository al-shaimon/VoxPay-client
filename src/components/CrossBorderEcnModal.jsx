import React, { useState, useEffect } from 'react';
import { 
  X, Coins, ArrowRightLeft, ShieldCheck, CheckCircle2, 
  ExternalLink, Building2, Globe2, Sparkles, Send 
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

export default function CrossBorderEcnModal({ 
  isOpen, 
  onClose, 
  wallet, 
  onRemitSuccess, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [cnyAmount, setCnyAmount] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  const EXCHANGE_RATE = 16.90; // 1 e-CNY = 16.90 BDT
  const bdtAmount = Math.round(cnyAmount * EXCHANGE_RATE);

  const handleExecuteRemittance = () => {
    setIsProcessing(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (soundEnabled) {
        voiceEngine.playSoundboxChime();
        const speech = lang === 'en'
          ? `Received ${cnyAmount} Yuan equivalent to ${bdtAmount.toLocaleString('en-US')} Taka remittance from Shenzhen e-CNY gateway. Settlement bridge completed.`
          : `Shenzhen e-CNY গেটওয়ে থেকে ${cnyAmount} ইউয়ান সমপরিমাণ ${bdtAmount.toLocaleString('en-IN')} টাকা সফলভাবে রেমিট্যান্স গ্রহণ করা হয়েছে। সেটেলমেন্ট ব্রিজ সম্পন্ন।`;
        voiceEngine.speakText(speech, lang === 'en' ? 'en-US' : 'bn-BD', false);
      }

      onRemitSuccess({
        cnyAmount,
        bdtAmount,
        recipient: lang === 'en' ? 'Karim Mia (VoxPay Wallet)' : 'করিম মিয়া (VoxPay Wallet)',
        settlementBridge: 'Shenzhen-PBOC CBDC Node 04'
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Coins size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Cross-Border e-CNY Gateway
              </h3>
              <span className="text-[10px] bg-red-950 text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-800">
                🇨🇳 Shenzhen Corridor
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Direct instant remittance between Digital Yuan (e-CNY) and local Taka' : 'ডিজিটাল ইউয়ান (e-CNY) ও স্থানীয় টাকার মধ্যে সরাসরি তাৎক্ষণিক রেমিট্যান্স'}
            </p>
          </div>
        </div>

        {/* Live Conversion Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-5">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-slate-400">{lang === 'en' ? 'Live Exchange Rate:' : 'লাইভ এক্সচেঞ্জ রেট:'}</span>
            <span className="font-mono font-bold text-amber-300">
              1 e-CNY (¥) = 16.90 BDT (৳)
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            {/* From: Shenzhen e-CNY */}
            <div className="col-span-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">{lang === 'en' ? 'Sent (e-CNY):' : 'প্রেরিত (Send):'}</span>
              <div className="flex items-center space-x-1">
                <span className="text-amber-400 font-bold">¥</span>
                <input
                  type="number"
                  value={cnyAmount}
                  onChange={(e) => setCnyAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-transparent text-white font-bold text-base focus:outline-none"
                  min="1"
                />
              </div>
              <span className="text-[9px] text-slate-400">Digital Yuan</span>
            </div>

            {/* Bridge Icon */}
            <div className="col-span-1 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <ArrowRightLeft size={14} />
              </div>
            </div>

            {/* To: VoxPay Wallet */}
            <div className="col-span-2 p-2.5 rounded-xl bg-slate-900 border border-brand-500/30">
              <span className="text-[10px] text-brand-300 block mb-1">{lang === 'en' ? 'Receive (BDT):' : 'প্রাপ্ত হবে (Receive):'}</span>
              <div className="flex items-center space-x-1">
                <span className="text-brand-400 font-bold">৳</span>
                <span className="text-white font-bold text-base">
                  {bdtAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[9px] text-slate-400">VoxPay BDT Wallet</span>
            </div>
          </div>
        </div>

        {/* Corridor Security Specs */}
        <div className="space-y-2 text-xs text-slate-300 mb-5">
          <div className="flex justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">{lang === 'en' ? 'Settlement Time:' : 'সেটেলমেন্ট সময়:'}</span>
            <span className="font-medium text-emerald-400">{lang === 'en' ? '2.4 seconds (Instant CBDC)' : '২.৪ সেকেন্ড (Instant CBDC)'}</span>
          </div>
          <div className="flex justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">{lang === 'en' ? 'Transfer Fee:' : 'রেমিট্যান্স ট্রান্সফার ফি:'}</span>
            <span className="font-medium text-emerald-400">0.0% (Zero-Fee Pilot)</span>
          </div>
          <div className="flex justify-between p-2 rounded-xl bg-slate-800/50">
            <span className="text-slate-400">{lang === 'en' ? 'Originator:' : 'প্রেরক প্রতিষ্ঠান:'}</span>
            <span className="text-slate-200">Shenzhen Nanshan Hi-Tech Supply Chain Node</span>
          </div>
        </div>

        {/* Complete State */}
        {isComplete && (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 mb-4 flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span>
              {lang === 'en'
                ? `Remittance successful! ৳${bdtAmount.toLocaleString('en-US')} added to your VoxPay balance.`
                : `রেমিট্যান্স সফল! ৳${bdtAmount.toLocaleString('en-IN')} আপনার VoxPay ব্যালেন্সে যোগ হয়েছে।`}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            {isComplete ? (lang === 'en' ? 'Completed' : 'সম্পন্ন') : (lang === 'en' ? 'Cancel' : 'বাতিল')}
          </button>

          {!isComplete && (
            <button
              onClick={handleExecuteRemittance}
              disabled={isProcessing || cnyAmount <= 0}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-brand-600 hover:from-amber-500 hover:to-brand-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg transition"
            >
              {isProcessing ? (
                <span>{lang === 'en' ? 'Settling...' : 'সেটেলমেন্ট হচ্ছে...'}</span>
              ) : (
                <>
                  <Send size={15} />
                  <span>{lang === 'en' ? 'Accept Instant Remittance' : 'তাৎক্ষণিক রেমিট্যান্স গ্রহণ করুন'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
