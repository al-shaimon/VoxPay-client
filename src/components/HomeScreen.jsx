import React from 'react';
import { 
  Send, Smartphone, Landmark, ArrowDownLeft, Coins, 
  CloudRain, ShieldAlert, HeartHandshake, Mic, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Satellite 
} from 'lucide-react';
import { SAMPLE_VOICE_COMMANDS } from '../constants/data';

export default function HomeScreen({ 
  wallet, 
  transactions, 
  onActionClick, 
  onTriggerVoice, 
  onSwitchTab 
}) {
  const coreServices = [
    { id: 'send_money', name: 'টাকা পাঠানো', enName: 'Send Money', icon: Send, color: 'bg-rose-500 text-white' },
    { id: 'recharge', name: 'মোবাইল রিচার্জ', enName: 'Recharge', icon: Smartphone, color: 'bg-blue-500 text-white' },
    { id: 'ai_loan', name: 'এআই ঋণ', enName: 'AI Micro-Loan', icon: Landmark, color: 'bg-emerald-600 text-white' },
    { id: 'cash_out', name: 'ক্যাশ আউট', enName: 'Cash Out', icon: ArrowDownLeft, color: 'bg-amber-500 text-white' },
    { id: 'cross_border_ecny', name: 'e-CNY রেমিট্যান্স', enName: 'CBDC Gateway', icon: Coins, color: 'bg-orange-500 text-white' },
    { id: 'weather_protection', name: 'ওয়েদার শিল্ড', enName: 'Weather Freeze', icon: CloudRain, color: 'bg-sky-500 text-white' },
    { id: 'zkp_verify', name: 'ZKP প্রাইভেসি', enName: 'ZKP Privacy', icon: ShieldAlert, color: 'bg-purple-600 text-white' },
    { id: 'emergency_relief', name: 'জরুরি ত্রাণ', enName: 'Disaster Aid', icon: HeartHandshake, color: 'bg-red-600 text-white' },
  ];

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner: Voice Assistant Action Bar & Dialect Prompts */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-950/70 via-slate-900 to-slate-900 border border-brand-500/30 p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                ভয়েস ইঞ্জিন অ্যাক্টিভ (Regional Dialect Engine)
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              শুধু কণ্ঠে বলুন — তাৎক্ষণিক পেমেন্ট, লোন ও বিল পরিশোধ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              প্রমিত বাংলা, চাঁটগাঁইয়া, ছিলটী বা Banglish-এ কথা বলে কোনো পিন নম্বর ছাড়া নিরাপদ লেনদেন করুন।
            </p>
          </div>

          <button
            onClick={() => onTriggerVoice('রহিমকে ৫০০ টাকা পাঠাও')}
            className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0 self-start sm:self-auto"
          >
            <Mic size={20} className="animate-pulse" />
            <span>মুখে কথা বলুন</span>
          </button>
        </div>

        {/* Quick Voice Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-semibold flex-shrink-0 hidden sm:inline">
            ক্লিক করে টেস্ট করুন:
          </span>
          {SAMPLE_VOICE_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => onTriggerVoice(cmd.text, cmd.dialect)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-brand-500/20 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition"
            >
              "{cmd.text}"
            </button>
          ))}
        </div>
      </div>

      {/* 8 Core MFS Services Grid */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-white">
            মূল সেবাসমূহ (Core MFS Services)
          </h3>
          <span className="text-xs text-slate-400">
            ভয়েস বা ১-ট্যাপে ব্যবহার করুন
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {coreServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => onActionClick(service.id)}
                className="group flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 transition-all text-center"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${service.color} flex items-center justify-center shadow-md group-hover:scale-110 group-active:scale-95 transition-transform`}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-semibold text-slate-100 group-hover:text-brand-300 mt-2 line-clamp-1">
                  {service.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  {service.enName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Multi-Column Dashboard Row (Laptop: 2 Columns / Mobile: Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols on Laptop): AI Credit Score & Loan Highlights */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck size={18} />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  এআই ক্রেডিট স্কোর ও লোন স্ট্যাটাস
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
                ✓ বিশ্বস্ত (Trusted)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-slate-400 block">বিকল্প এআই ক্রেডিট স্কোর:</span>
                <div className="flex items-baseline space-x-1.5 justify-center sm:justify-start mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {wallet.trustScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ ৯০০ (Platinum)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  অনুমোদিত তাৎক্ষণিক লোন সিলিং: <strong className="text-brand-400">৳২৫,০০০</strong>
                </p>
              </div>

              <button
                onClick={() => onSwitchTab('loan')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md flex-shrink-0"
              >
                <span>লোন আবেদন করুন</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">মোবাইল রিচার্জ স্কোর:</span>
                <span className="text-sm font-bold text-white mt-0.5 block">৯২/১০০ (Very High)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">ইউটিলিটি বিল অন-টাইম:</span>
                <span className="text-sm font-bold text-white mt-0.5 block">৮৮/১০০ (১২ মাস ক্লিয়ার)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column (5 Cols on Laptop): Weather Protection & Recent Transactions */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Weather Status Card */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Satellite size={16} className="text-sky-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  স্যাটেলাইট ওয়েদার রাডার শিল্ড
                </h4>
              </div>
              <span className="text-[10px] text-sky-400 font-mono">LIVE FEED</span>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              উপকূল ও হাওর অঞ্চলে প্রাকৃতিক দুর্যোগ সংকেত জারি হলে কিস্তি স্বয়ংক্রিয়ভাবে ফ্রিজ থাকবে।
            </p>

            <button
              onClick={() => onSwitchTab('weather')}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
            >
              <span>ওয়েদার স্ট্যাটাস দেখুন</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mini Recent Transactions */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                সাম্প্রতিক লেনদেন
              </h4>
              <button
                onClick={() => onSwitchTab('history')}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300"
              >
                সব স্টেটমেন্ট →
              </button>
            </div>

            <div className="space-y-2">
              {recentTransactions.map((tx) => {
                const isNegative = tx.amount < 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{tx.title}</p>
                      <p className="text-[10px] text-slate-400">{tx.timestamp}</p>
                    </div>
                    <span className={`font-bold font-mono text-xs sm:text-sm ${
                      isNegative ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {isNegative ? '-' : '+'} {Math.abs(tx.amount).toLocaleString('en-IN')} {tx.currency}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
