import React, { useState, useEffect } from 'react';
import { 
  X, Speaker, Radio, Volume2, CheckCircle2, 
  Smartphone, Wifi, ArrowDownLeft 
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';

export default function SoundboxDemoModal({ 
  isOpen, 
  onClose, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [lastPayment, setLastPayment] = useState({ amount: 500, time: 'Just now' });
  const [isPlaying, setIsPlaying] = useState(false);

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

  const triggerTestSoundbox = (amount) => {
    setIsPlaying(true);
    setLastPayment({ amount, time: new Date().toLocaleTimeString() });

    // Play crisp soundbox double chime
    voiceEngine.playSoundboxChime();

    // Language-aware TTS Announcement
    setTimeout(() => {
      const speech = lang === 'en'
        ? `Payment of ${Number(amount).toLocaleString('en-US')} Taka received on VoxPay Smart Soundbox. Your balance has been updated.`
        : `VoxPay মার্চেন্ট সাউন্ডবক্সে ${Number(amount).toLocaleString('en-IN')} টাকা সফলভাবে প্রাপ্ত হয়েছে। আপনার বর্তমান ব্যালেন্স আপডেট হয়েছে।`;
      voiceEngine.speakText(speech, lang === 'en' ? 'en-US' : 'bn-BD', false);
      setIsPlaying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-500 via-brand-500 to-rose-500" />
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Speaker size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              VoxPay Smart Audio Soundbox
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Instant voice broadcast confirmation for merchants' : 'দোকানি ও মার্চেন্টদের জন্য তাৎক্ষণিক বাংলা অডিও স্বীকৃতি'}
            </p>
          </div>
        </div>

        {/* Hardware Soundbox Simulator Device Mockup */}
        <div className="mx-auto w-64 rounded-3xl bg-slate-950 p-5 border-2 border-brand-500/40 shadow-2xl relative text-center mb-6">
          
          {/* LED Indicator Light */}
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>4G LTE + BLE MESH</span>
            </span>
            <Wifi size={13} className="text-slate-500" />
          </div>

          {/* OLED Digital Display */}
          <div className="rounded-2xl bg-black p-3.5 border border-slate-800 mb-4 shadow-inner">
            <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider block">
              RECEIVED PAYMENT
            </span>
            <div className="text-3xl font-extrabold text-white my-1 font-mono tracking-tight">
              ৳ {lastPayment.amount}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {lastPayment.time}
            </span>
          </div>

          {/* Speaker Mesh Grille */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center relative overflow-hidden">
              {isPlaying && (
                <div className="absolute inset-0 bg-brand-500/30 animate-ping rounded-full" />
              )}
              <Volume2 size={36} className={`text-brand-400 ${isPlaying ? 'scale-110 animate-bounce' : ''}`} />
            </div>
          </div>

          <p className="text-[11px] font-bold text-slate-300 mt-3">
            VoxPay Soundbox 4G Pro
          </p>
        </div>

        {/* Test Chime Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 block mb-1">
            {lang === 'en' ? 'Test Soundbox Broadcast:' : 'অডিও ঘোষণা পরীক্ষা করুন (Test Soundbox Broadcast):'}
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1250].map((amt) => (
              <button
                key={amt}
                onClick={() => triggerTestSoundbox(amt)}
                className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-brand-600/30 border border-slate-700 hover:border-brand-500/50 text-white font-bold text-xs transition"
              >
                {lang === 'en' ? `৳ ${amt} Audio` : `৳ ${amt} অডিও`}
              </button>
            ))}
          </div>
        </div>

        {/* Close */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>

      </div>
    </div>
  );
}
