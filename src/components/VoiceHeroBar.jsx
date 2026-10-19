import React, { useState, useEffect } from 'react';
import { Mic, MicOff, ShieldCheck, Activity, Sparkles, Volume2, Fingerprint } from 'lucide-react';
import { DIALECTS, SAMPLE_VOICE_COMMANDS } from '../constants/data';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';

export default function VoiceHeroBar({ 
  selectedDialect, 
  setSelectedDialect,
  onTriggerVoiceCommand, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [audioBars, setAudioBars] = useState([30, 50, 75, 45, 85, 60, 40, 70, 55, 80, 45, 65, 35, 75, 50, 90]);

  const currentDialectObj = DIALECTS.find(d => d.id === selectedDialect) || DIALECTS[0];

  useEffect(() => {
    return () => {
      voiceEngine.stopListening();
      voiceEngine.stopSpeaking();
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setAudioBars(prev => prev.map(() => Math.floor(Math.random() * 85) + 15));
      }, 100);
    } else {
      setAudioBars([25, 35, 45, 30, 50, 35, 25, 40, 30, 45, 25, 35, 20, 40, 30, 50]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleMicToggle = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      if (soundEnabled) {
        voiceEngine.playSoundboxChime();
      }

      voiceEngine.startListening({
        lang: lang === 'en' ? 'en-US' : currentDialectObj.voiceCode,
        onResult: (res) => {
          if (res.finalText) {
            setIsListening(false);
            onTriggerVoiceCommand(res.finalText, selectedDialect);
          }
        },
        onError: () => {
          setTimeout(() => {
            setIsListening(false);
            const prompt = lang === 'en' ? 'Send 500 Taka to Abdul Rahim' : currentDialectObj.sampleVoicePrompt;
            onTriggerVoiceCommand(prompt, selectedDialect);
          }, 600);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-center animate-fadeIn py-2 sm:py-4">
      
      {/* Dialect Switcher Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DIALECTS.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDialect(d.id);
              if (soundEnabled) {
                const msg = lang === 'en' ? `Language set to ${d.name}` : `ভাষা ${d.name} সেট করা হয়েছে`;
                voiceEngine.speakText(msg, lang === 'en' ? 'en-US' : d.voiceCode, false);
              }
            }}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition ${
              selectedDialect === d.id
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-base">{d.flag}</span>
            <span>{d.name}</span>
          </button>
        ))}
      </div>

      {/* Main Big Voice Pulse Area */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 space-y-5 relative overflow-hidden shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{lang === 'en' ? `Voice Biometric Engine · Active (${currentDialectObj.name})` : `ভয়েস বায়োমেট্রিক ইঞ্জিন অ্যাক্টিভ (${currentDialectObj.name})`}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white">
            {lang === 'en' ? 'Transact by Voice — PIN-Free & Secure' : 'কণ্ঠে লেনদেন করুন — পিনবিহীন ও নিরাপদ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {lang === 'en' ? 'Tap and speak — Send money, apply for loans, pay utility bills, or check balance' : 'ট্যাপ করে বাংলায় বলুন — টাকা পাঠানো, লোন আবেদন, ইউটিলিটি বিল বা ব্যালেন্স অনুসন্ধান'}
          </p>
        </div>

        {/* Big Mic Button */}
        <div className="relative flex items-center justify-center py-6">
          {isListening && (
            <>
              <div className="absolute w-44 h-44 rounded-full bg-brand-500/20 animate-ping" />
              <div className="absolute w-56 h-56 rounded-full bg-brand-500/10 animate-pulse" />
            </>
          )}

          <button
            onClick={handleMicToggle}
            className={`relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-brand-600 to-rose-600 ring-4 ring-brand-400/50 glow-magenta'
                : 'bg-gradient-to-tr from-brand-500 via-brand-600 to-pink-600 hover:glow-magenta ring-4 ring-brand-500/20 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff size={42} className="text-white animate-bounce" />
            ) : (
              <Mic size={42} className="text-white" />
            )}
            <span className="text-xs sm:text-sm font-bold text-white mt-1.5 uppercase tracking-wider">
              {isListening ? (lang === 'en' ? 'Listening...' : 'শুনছি...') : (lang === 'en' ? 'Tap to Speak' : 'ট্যাপ করুন')}
            </span>
          </button>
        </div>

        {/* Audio Waveform */}
        <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 h-10">
          {audioBars.map((height, idx) => (
            <span
              key={idx}
              style={{ height: `${height}%` }}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                isListening ? 'bg-gradient-to-t from-brand-500 to-cyan-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Biometric Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>{lang === 'en' ? 'Voice-Print Biometric: 98.4% Match' : 'ভয়েস-প্রিন্ট বায়োমেট্রিক: ৯৮.৪% ম্যাচ'}</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-medium">
            <Activity size={14} className="text-cyan-400" />
            <span>{lang === 'en' ? 'Deepfake Liveness Guard: Organic Human' : 'ডিপফেক লাইভনেস গার্ড: অরগানিক হিউম্যান'}</span>
          </span>
        </div>
      </div>

      {/* Dialect Voice Prompts (Quick Click to Test) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 text-left space-y-3 shadow-xl">
        <span className="text-xs sm:text-sm font-bold text-slate-300 block">
          {lang === 'en' ? 'Click to simulate regional voice command:' : 'ক্লিক করে আঞ্চলিক ভাষায় ভয়েস কমান্ড টেস্ট করুন (Click to simulate speech):'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_VOICE_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => onTriggerVoiceCommand(cmd.text, cmd.dialect)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-brand-500/15 border border-slate-800 text-xs sm:text-sm text-slate-300 hover:text-white transition group"
            >
              <span className="font-medium group-hover:text-brand-300">"{cmd.text}"</span>
              <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                {cmd.dialect === 'chittagong' ? 'চট্টগ্রাম' : cmd.dialect === 'sylhet' ? 'সিলেট' : 'প্রমিত'}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
