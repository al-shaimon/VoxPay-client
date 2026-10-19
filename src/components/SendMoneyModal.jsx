import React, { useState, useEffect } from 'react';
import { 
  X, Send, Phone, User, ShieldCheck, CheckCircle2, 
  ArrowRight, Sparkles 
} from 'lucide-react';
import { voiceEngine } from '../services/voiceEngine';
import { useLanguage } from '../i18n/LanguageContext';
import confetti from 'canvas-confetti';

export default function SendMoneyModal({ 
  isOpen, 
  onClose, 
  wallet, 
  onSendSuccess, 
  soundEnabled 
}) {
  const { lang, t } = useLanguage();
  const [recipient, setRecipient] = useState(lang === 'en' ? 'Abdul Rahim (01819-332145)' : 'আব্দুল রহিম (01819-332145)');
  const [amount, setAmount] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const quickContacts = lang === 'en' ? [
    { name: 'Abdul Rahim', phone: '01819-332145', relation: 'Brother' },
    { name: 'Karim Mia (Shop)', phone: '01711-229988', relation: 'Merchant' },
    { name: 'Mother (Account)', phone: '01912-774411', relation: 'Family' },
  ] : [
    { name: 'আব্দুল রহিম', phone: '01819-332145', relation: 'Brother' },
    { name: 'করিম মিয়া (দোকান)', phone: '01711-229988', relation: 'Merchant' },
    { name: 'আম্মা (মায়ের একাউন্ট)', phone: '01912-774411', relation: 'Family' },
  ];

  const handleSend = () => {
    if (amount <= 0 || amount > wallet.bdtBalance) return;

    setIsProcessing(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    setTimeout(() => {
      setIsProcessing(false);

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
          ? `Successfully sent ${Number(amount).toLocaleString('en-US')} Taka to ${recipient}. No hidden fees charged.`
          : `${recipient} এর একাউন্টে ${Number(amount).toLocaleString('en-IN')} টাকা সফলভাবে পাঠানো হয়েছে। কোনো বাড়তি হিডেন চার্জ কাটা হয়নি।`;
        voiceEngine.speakText(speech, lang === 'en' ? 'en-US' : 'bn-BD', false);
      }

      onSendSuccess({
        recipient,
        amount: Number(amount)
      });
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-rose-500 to-pink-500" />
        
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
            <Send size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lang === 'en' ? 'Send Money' : 'টাকা পাঠান (Send Money)'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'en' ? 'Fast, PIN-free transfer with voice biometric authentication' : 'ভয়েস বায়োমেট্রিক অথেন্টিকেশন সহ পিনবিহীন দ্রুত লেনদেন'}
            </p>
          </div>
        </div>

        {/* Quick Contacts */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            {lang === 'en' ? 'Select Quick Contact:' : 'প্রিয়জন বা পরিচিত নম্বর নির্বাচন করুন:'}
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {quickContacts.map((c, i) => (
              <button
                key={i}
                onClick={() => setRecipient(`${c.name} (${c.phone})`)}
                className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-brand-500/20 border border-slate-700 hover:border-brand-500/40 text-xs text-left transition"
              >
                <span className="font-bold text-white block">{c.name}</span>
                <span className="text-[10px] text-slate-400">{c.phone}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            {lang === 'en' ? 'Recipient Name or Phone Number:' : 'প্রাপকের নাম বা মোবাইল নম্বর:'}
          </label>
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5">
            <User size={16} className="text-brand-400" />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-transparent w-full text-xs sm:text-sm text-white focus:outline-none"
              placeholder="017XX-XXXXXX"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {lang === 'en' ? 'Amount (BDT):' : 'পরিমাণ (Amount in BDT):'}
            </label>
            <span className="text-[11px] text-slate-400">
              {lang === 'en' ? 'Max: ' : 'সর্বোচ্চ: '}৳{wallet.bdtBalance.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950 border border-brand-500/30 rounded-2xl px-4 py-3">
            <span className="text-xl font-bold text-brand-400">৳</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent w-full text-xl font-bold text-white focus:outline-none"
              min="10"
              max={wallet.bdtBalance}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="w-1/3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition"
          >
            {lang === 'en' ? 'Cancel' : 'বাতিল'}
          </button>

          <button
            onClick={handleSend}
            disabled={isProcessing || amount <= 0 || amount > wallet.bdtBalance}
            className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-pink-600 hover:from-brand-500 hover:to-pink-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg transition"
          >
            {isProcessing ? (
              <span>{lang === 'en' ? 'Processing...' : 'প্রসেসিং হচ্ছে...'}</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>{lang === 'en' ? 'Voice Confirm & Send' : 'ভয়েস কনফার্ম ও সেন্ড'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
