import React, { useState, useEffect } from 'react';
import { 
  X, HeartHandshake, ShieldCheck, CheckCircle2, 
  MapPin, AlertCircle, Sparkles 
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

export default function EmergencyReliefModal({ 
  isOpen, 
  onClose, 
  onClaimAid, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

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

  const handleClaim = () => {
    setIsProcessing(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsClaimed(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      if (soundEnabled) {
        voiceEngine.playSoundboxChime();
        const speech = lang === 'en'
          ? 'Autonomous emergency disaster aid of 5,000 Taka transferred to your wallet with zero interest. Verified via satellite geo-fencing.'
          : 'স্বায়ত্তশাসিত জরুরি দুর্যোগ সহায়তা ৫,০০০ টাকা শূন্য শতাংশ সুদে আপনার ওয়ালেটে হস্তান্তর সম্পন্ন হয়েছে। স্যাটেলাইট জিও-ফেন্সিং দ্বারা এটি যাচাইকৃত।';
        voiceEngine.speakText(speech, lang === 'en' ? 'en-US' : 'bn-BD', false);
      }

      onClaimAid(5000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <HeartHandshake size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Autonomous Emergency Relief' : 'স্বায়ত্তশাসিত জরুরি ত্রাণ ফান্ড'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Disaster emergency aid & 0% interest liquidity' : 'Autonomous Disaster Emergency Aid & Zero-Interest Liquidity'}
            </p>
          </div>
        </div>

        {/* Disaster Geofence status */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-4 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-200">
            <span className="flex items-center space-x-1 font-bold text-red-400">
              <MapPin size={14} />
              <span>{lang === 'en' ? 'Geo-Fence Verification:' : 'জিও-ফেন্স ভেরিফিকেশন:'}</span>
            </span>
            <span className="font-mono text-emerald-400">PASSED (Disaster Zone)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === 'en'
              ? 'Based on satellite & cellular tower data, your wallet is currently situated in an active disaster warning zone.'
              : 'স্যাটেলাইট ও মোবাইল নেটওয়ার্ক টাওয়ার ডেটা অনুসারে আপনার ওয়ালেটটি বর্তমানে প্রাকৃতিক দুর্যোগ সতর্কতা জোনে তালিকাভুক্ত।'}
          </p>
        </div>

        {/* Grant Details */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-red-950/30 to-slate-950 border border-red-500/30 text-center mb-5">
          <span className="text-xs text-red-300 font-semibold uppercase tracking-wider block">
            {lang === 'en' ? 'Allocated Zero-Interest Emergency Grant' : 'বরাদ্দকৃত সুদমুক্ত জরুরি অনুদান'}
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white my-1 tracking-tight">
            ৳ ৫,০০০
          </div>
          <p className="text-[11px] text-slate-400">
            {lang === 'en' ? '0% Interest Rate • Instant Withdrawal to Wallet' : 'কোনো সুদের হার নেই (০% Interest) • তাৎক্ষণিক উত্তোলনযোগ্য'}
          </p>
        </div>

        {isClaimed && (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 mb-4 flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span>{lang === 'en' ? 'Emergency aid ৳5,000 successfully added to wallet!' : 'জরুরি সহায়তা ৳৫,০০০ সরাসরি ওয়ালেটে যোগ হয়েছে!'}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            {isClaimed ? (lang === 'en' ? 'Close' : 'বন্ধ') : (lang === 'en' ? 'Cancel' : 'বাতিল')}
          </button>

          {!isClaimed && (
            <button
              onClick={handleClaim}
              disabled={isProcessing}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg transition"
            >
              {isProcessing ? (
                <span>{lang === 'en' ? 'Disbursing...' : 'বিতরণ হচ্ছে...'}</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>{lang === 'en' ? 'Claim Relief Aid' : 'ত্রাণ গ্রহণ করুন (Claim Aid)'}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
