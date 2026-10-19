import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Activity, AlertTriangle, 
  ArrowRight, Sparkles, Volume2, Fingerprint, Lock, Cpu
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  transcript,
  selectedDialect,
  onExecuteAction,
  soundEnabled
}) {
  const { lang, t } = useLanguage();
  const [parsedData, setParsedData] = useState(null);
  const [biometricData, setBiometricData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Stop audio whenever modal closes or unmounts
  useEffect(() => {
    return () => {
      voiceEngine.stopSpeaking();
    };
  }, []);

  const handleClose = () => {
    voiceEngine.stopSpeaking();
    onClose();
  };

  useEffect(() => {
    if (isOpen && transcript) {
      setIsVerifying(true);
      setIsSuccess(false);

      // Parse natural language intent
      const parsed = voiceEngine.parseVoiceIntent(transcript, selectedDialect);
      setParsedData(parsed);

      // Simulate biometric voiceprint analysis
      const bio = voiceEngine.simulateVoicePrintAnalysis();
      setBiometricData(bio);

      // Simulate brief cryptographic & biometric verification time
      const timer = setTimeout(() => {
        setIsVerifying(false);
        if (soundEnabled && parsed) {
          const isEn = lang === 'en' || selectedDialect === 'english';
          const matchPercent = bio?.confidenceScore || '98.5';

          if (isEn) {
            const recipientPart = parsed.recipient ? `Recipient: ${parsed.recipient}. ` : '';
            const amountPart = parsed.amount ? `Amount: ${parsed.amount.toLocaleString('en-IN')} Taka. ` : '';
            const speech = `${recipientPart}${amountPart}Biometric voice-print matched ${matchPercent} percent. Vocal cords organic and verified. Please confirm below to proceed.`;
            voiceEngine.speakText(speech, 'en-US', true);
          } else {
            const recipientPart = parsed.recipient ? `প্রাপক: ${parsed.recipient}। ` : '';
            const amountPart = parsed.amount ? `পরিমাণ: ${parsed.amount.toLocaleString('en-IN')} টাকা। ` : '';
            const speech = `${parsed.feedback} শনাক্তকৃত কার্যক্রম: ${parsed.intentName}। ${recipientPart}${amountPart}বায়োমেট্রিক ভয়েস-প্রিন্ট ${matchPercent} শতাংশ সফলভাবে ম্যাচ হয়েছে। ভোকাল কর্ড অর্গানিক ও নিরাপদ। নিশ্চিত করতে নিচে কনফার্ম করুন।`;
            voiceEngine.speakText(speech, 'bn-BD', true);
          }
        }
      }, 700);

      return () => {
        clearTimeout(timer);
        voiceEngine.stopSpeaking();
      };
    }
  }, [isOpen, transcript, selectedDialect, lang]);

  if (!isOpen || !transcript) return null;

  const handleConfirmAction = () => {
    setIsSuccess(true);
    
    // Fire celebration confetti for successful voice transaction
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
      const isEn = lang === 'en' || selectedDialect === 'english';
      if (isEn) {
        const amountPart = parsedData?.amount ? `${parsedData.amount.toLocaleString('en-IN')} Taka ` : '';
        const recipientPart = parsedData?.recipient ? `to ${parsedData.recipient} ` : '';
        voiceEngine.speakText(
          `Congratulations! Payment of ${amountPart}${recipientPart}completed successfully. Verified by Zero Knowledge Proof on-chain.`,
          'en-US',
          false
        );
      } else {
        const amountPart = parsedData?.amount ? `${parsedData.amount.toLocaleString('en-IN')} টাকা ` : '';
        const recipientPart = parsedData?.recipient ? `${parsedData.recipient} এর কাছে ` : '';
        voiceEngine.speakText(
          `অভিনন্দন! লেনদেন সফলভাবে সম্পন্ন হয়েছে। ${recipientPart}${amountPart}সফলভাবে হস্তান্তর করা হয়েছে। এটি জিরো নলেজ প্রুফ দ্বারা ভেরিফাইড।`,
          'bn-BD',
          false
        );
      }
    }

    setTimeout(() => {
      onExecuteAction(parsedData);
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-purple-500 to-cyan-500" />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Volume2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {t('voice.title', 'VoxPay ভয়েস ইঞ্জিন অ্যানালাইসিস')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('voice.sub', 'Biometric Voice-Print & Intent Execution Engine')}
            </p>
          </div>
        </div>

        {/* User's Spoken Utterance Box */}
        <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{t('voice.recognized', 'আপনার উচ্চারিত কণ্ঠস্বর (Recognized Audio):')}</span>
            <span className="text-brand-400 font-mono">Dialect: {selectedDialect}</span>
          </p>
          <p className="text-base sm:text-lg font-medium text-white italic">
            "{transcript}"
          </p>
        </div>

        {/* Biometric Voice-Print & Liveness Guard Card */}
        <div className="rounded-2xl bg-slate-800/50 p-3.5 border border-slate-700/60 mb-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Fingerprint size={14} className="text-emerald-400" />
              <span>{t('voice.bioMatch', 'বায়োমেট্রিক ভয়েস-প্রিন্ট ম্যাচিং:')}</span>
            </span>
            {isVerifying ? (
              <span className="text-xs text-cyan-400 font-medium animate-pulse flex items-center space-x-1">
                <Activity size={12} className="animate-spin" />
                <span>{t('voice.matching', 'ম্যাচিং হচ্ছে...')}</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle size={13} />
                <span>{biometricData?.confidenceScore}% {t('voice.matched', 'Matched (Pass)')}</span>
              </span>
            )}
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t('voice.deepfake', 'Deepfake Guard:')}</span>
              <span className="font-semibold text-emerald-300">
                {isVerifying ? (lang === 'en' ? 'Analyzing breath...' : 'বায়োলজিক্যাল স্পেকট্রাম বিশ্লেষণ...') : t('voice.organic', 'Organic Vocal Cords')}
              </span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t('voice.stress', 'Stress / Duress Check:')}</span>
              <span className="font-semibold text-cyan-300">
                {isVerifying ? (lang === 'en' ? 'Scanning tremor...' : 'মাইক্রো-কম্পন স্ক্যানিং...') : t('voice.normalCalm', 'Normal Calm (No Coercion)')}
              </span>
            </div>
          </div>
        </div>

        {/* Extracted Intent & Action Details */}
        {parsedData && (
          <div className="rounded-2xl bg-gradient-to-b from-brand-950/40 to-slate-900 p-4 border border-brand-500/30 mb-5">
            <p className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-2">
              {t('voice.parsedIntent', 'শনাক্তকৃত আর্থিক কার্যক্রম (Parsed Intent):')}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{parsedData.intentName}</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t('voice.recipient', 'প্রাপক / লক্ষ্য:')} <span className="font-medium text-white">{parsedData.recipient}</span>
                </p>
              </div>
              {parsedData.amount && (
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-brand-400">
                    ৳{parsedData.amount.toLocaleString('en-IN')}
                  </span>
                  <p className="text-[10px] text-slate-400">{t('voice.zeroFee', '০% হিডেন ফি')}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-3 pt-2.5 border-t border-brand-500/20 leading-relaxed">
              {parsedData.feedback}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            {t('voice.cancel', 'বাতিল')}
          </button>

          <button
            onClick={handleConfirmAction}
            disabled={isVerifying || isSuccess}
            className={`w-2/3 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center space-x-2 shadow-lg transition-all ${
              isSuccess
                ? 'bg-emerald-600'
                : 'bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-500 hover:to-pink-500 glow-magenta active:scale-98'
            }`}
          >
            {isSuccess ? (
              <>
                <CheckCircle size={16} />
                <span>{t('voice.success', 'লেনদেন সফলভাবে সম্পন্ন হয়েছে!')}</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>{t('voice.confirmBtn', 'বায়োমেট্রিক পেমেন্ট নিশ্চিত করুন')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
