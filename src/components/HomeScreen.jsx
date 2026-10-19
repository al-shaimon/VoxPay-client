import React from 'react';
import {
  Send, Smartphone, Landmark, ArrowDownLeft, Coins,
  CloudRain, ShieldAlert, HeartHandshake, Mic, Sparkles,
  ArrowRight, ShieldCheck, TrendingUp, Satellite, Zap
} from 'lucide-react';
import { SAMPLE_VOICE_COMMANDS } from '../constants/data';

export default function HomeScreen({ wallet, transactions, onActionClick, onTriggerVoice, onSwitchTab }) {

  const coreServices = [
    { id: 'send_money',       name: 'টাকা পাঠান',    enName: 'Send',         icon: Send,          color: '#e2136e', bg: 'rgba(226,19,110,0.15)' },
    { id: 'recharge',         name: 'রিচার্জ',        enName: 'Recharge',     icon: Smartphone,    color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { id: 'ai_loan',          name: 'AI লোন',         enName: 'Micro-Loan',   icon: Landmark,      color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { id: 'cash_out',         name: 'ক্যাশ আউট',     enName: 'Cash Out',     icon: ArrowDownLeft, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { id: 'cross_border_ecny',name: 'e-CNY',          enName: 'CBDC',         icon: Coins,         color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    { id: 'weather_protection',name:'ওয়েদার শিল্ড',  enName: 'Weather',      icon: CloudRain,     color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
    { id: 'zkp_verify',       name: 'ZKP প্রাইভেসি', enName: 'Privacy',      icon: ShieldAlert,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { id: 'emergency_relief', name: 'জরুরি ত্রাণ',   enName: 'Aid',          icon: HeartHandshake,color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  ];

  const recentTxs = transactions.slice(0, 4);

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Hero Voice Banner ─────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden p-5 sm:p-7"
        style={{ background: 'linear-gradient(135deg, rgba(226,19,110,0.12) 0%, rgba(10,16,30,0.95) 60%, rgba(9,13,28,0.98) 100%)', border: '1px solid rgba(226,19,110,0.2)' }}>
        
        {/* Ambient glow */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: '#e2136e', filter: 'blur(80px)', opacity: 0.08 }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-blink" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f472b6' }}>
                Regional Voice Engine · Active
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
              শুধু কণ্ঠে বলুন —<br className="hidden sm:block" />
              <span style={{ color: '#f472b6' }}>তাৎক্ষণিক পেমেন্ট</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-sm">
              প্রমিত বাংলা, চাঁটগাঁইয়া বা Banglish-এ কথা বলুন। কোনো PIN দরকার নেই।
            </p>
          </div>

          <button
            onClick={() => onTriggerVoice('রহিমকে ৫০০ টাকা পাঠাও')}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-2xl font-bold text-sm text-white flex-shrink-0 self-start sm:self-center transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #e2136e, #9333ea)', boxShadow: '0 8px 30px -6px rgba(226,19,110,0.6)' }}
          >
            <div className="flex items-end gap-0.5 h-5">
              {[...Array(5)].map((_, i) => <div key={i} className="voice-bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
            </div>
            <span>মুখে বলুন</span>
          </button>
        </div>

        {/* Quick Voice Chips */}
        <div className="mt-4 pt-4 flex items-center gap-2 overflow-x-auto scrollbar-none" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-[11px] text-slate-500 font-semibold flex-shrink-0 hidden sm:block">চেষ্টা করুন:</span>
          {SAMPLE_VOICE_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => onTriggerVoice(cmd.text, cmd.dialect)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs text-slate-300 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              "{cmd.text}"
            </button>
          ))}
        </div>
      </div>

      {/* ── Balance Summary Cards ─────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'BDT ব্যালেন্স', value: `৳${wallet.bdtBalance.toLocaleString('en-IN')}`, color: '#f472b6', icon: '৳' },
          { label: 'e-CNY ব্যালেন্স', value: `¥${wallet.ecnyBalance}`, color: '#22d3ee', icon: '¥' },
          { label: 'Green টোকেন', value: `${wallet.greenTokens ?? 0} GT`, color: '#34d399', icon: '🌿' },
        ].map((item, i) => (
          <div key={i} className="card p-4 text-center">
            <p className="text-[11px] text-slate-500 font-medium mb-1">{item.label}</p>
            <p className="text-base font-black" style={{ color: item.color }}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Core Services Grid ────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">মূল সেবাসমূহ</h2>
          <span className="text-[11px] text-slate-500">১-ট্যাপে ব্যবহার করুন</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {coreServices.map((svc) => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => onActionClick(svc.id)}
                className="group flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0)', border: '1px solid transparent' }}
                onMouseEnter={e => { e.currentTarget.style.background = svc.bg; e.currentTarget.style.borderColor = `${svc.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0)'; e.currentTarget.style.borderColor = 'transparent'; }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95"
                  style={{ background: svc.bg, color: svc.color }}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 text-center leading-tight">{svc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Row: Credit Score + Weather + Transactions ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Credit Score Highlight */}
        <div className="lg:col-span-5 card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <ShieldCheck size={15} style={{ color: '#10b981' }} />
              </div>
              <span className="text-sm font-bold text-white">AI ক্রেডিট স্কোর</span>
            </div>
            <span className="badge badge-green">✓ বিশ্বস্ত</span>
          </div>

          <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl font-black" style={{ color: '#10b981' }}>{wallet.trustScore ?? 785}</span>
                <span className="text-slate-500 text-sm ml-1">/ ৯০০</span>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400">অনুমোদিত সীমা</p>
                <p className="text-base font-bold" style={{ color: '#f472b6' }}>৳২৫,০০০</p>
              </div>
            </div>
            <div className="mt-2 progress-bar">
              <div className="progress-fill" style={{ width: `${((wallet.trustScore ?? 785) / 900) * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-slate-500 text-[10px]">রিচার্জ স্কোর</p>
              <p className="font-bold text-white mt-0.5">৯২ / ১০০</p>
            </div>
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-slate-500 text-[10px]">বিল পরিশোধ</p>
              <p className="font-bold text-white mt-0.5">৮৮ / ১০০</p>
            </div>
          </div>

          <button
            onClick={() => onSwitchTab('loan')}
            className="w-full btn-primary py-2.5"
          >
            <Landmark size={14} />
            লোন আবেদন করুন
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Right: Weather + Transactions */}
        <div className="lg:col-span-7 space-y-4">

          {/* Weather Shield Mini */}
          <div className="card" style={{ border: '1px solid rgba(6,182,212,0.2)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
                  <Satellite size={15} style={{ color: '#06b6d4' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">স্যাটেলাইট ওয়েদার শিল্ড</h3>
                  <p className="text-[11px] text-slate-400">দুর্যোগে কিস্তি স্বয়ংক্রিয় ফ্রিজ</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-cyan">LIVE</span>
                <button onClick={() => onSwitchTab('weather')} className="btn-ghost px-2.5 py-1.5 text-xs">
                  দেখুন <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">সাম্প্রতিক লেনদেন</h3>
              <button
                onClick={() => onSwitchTab('history')}
                className="text-xs font-semibold" style={{ color: '#f472b6' }}
              >
                সব দেখুন →
              </button>
            </div>
            <div className="space-y-2">
              {recentTxs.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-4">কোনো লেনদেন নেই</p>
              ) : recentTxs.map((tx) => {
                const isNeg = tx.amount < 0;
                const txIcons = {
                  send_money: '↗',
                  loan_disbursement: '⚡',
                  utility: '💡',
                  ecny_remit: '🌐',
                  crop_insurance: '🌾',
                  emergency_aid: '🆘',
                };
                return (
                  <div key={tx.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl transition"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {txIcons[tx.type] || '•'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white line-clamp-1">{tx.title}</p>
                        <p className="text-[10px]" style={{ color: '#475569' }}>{tx.timestamp}</p>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-xs flex-shrink-0"
                      style={{ color: isNeg ? '#f87171' : '#34d399' }}>
                      {isNeg ? '-' : '+'}{Math.abs(tx.amount).toLocaleString('en-IN')} {tx.currency}
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
