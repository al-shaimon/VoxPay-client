import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Eye, EyeOff, Globe, Sparkles, 
  ShieldCheck, ChevronDown, CheckCircle2, Code2, 
  Home, Landmark, Mic, CloudRain, Clock 
} from 'lucide-react';
import { DIALECTS } from '../constants/data';
import { voiceEngine } from '../services/voiceEngine';

export default function Navbar({ 
  wallet, 
  selectedDialect, 
  setSelectedDialect, 
  soundEnabled, 
  setSoundEnabled,
  activeTab,
  setActiveTab,
  onOpenCounselor,
  onOpenMlSpec
}) {
  const [showBalance, setShowBalance] = useState(false);
  const [balanceTapping, setBalanceTapping] = useState(false);
  const [dialectDropdownOpen, setDialectDropdownOpen] = useState(false);

  const handleBalanceTap = () => {
    setBalanceTapping(true);
    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }
    setShowBalance(prev => !prev);
    setTimeout(() => setBalanceTapping(false), 400);
  };

  const currentDialectObj = DIALECTS.find(d => d.id === selectedDialect) || DIALECTS[0];

  const navLinks = [
    { id: 'overview', label: 'ওভারভিউ (Overview)', icon: Home },
    { id: 'loan', label: 'এআই লোন ও স্কোর', icon: Landmark },
    { id: 'voice', label: 'ভয়েস পে', icon: Mic },
    { id: 'weather', label: 'ওয়েদার শিল্ড', icon: CloudRain },
    { id: 'history', label: 'স্টেটমেন্ট', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-pink-500 shadow-md shadow-brand-500/25">
              <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight">V</span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white">
                  Vox<span className="text-brand-400">Pay</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30">
                  Voice-First MFS
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  🇨🇳 Shenzhen FinTechathon
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                ভয়েস বায়োমেট্রিক • এআই অল্টারনেটিভ ক্রেডিট স্কোর • ZKP প্রাইভেসি
              </p>
            </div>
          </div>

          {/* Center: bKash Tap to Check Balance Capsule */}
          <div className="flex items-center">
            <button
              onClick={handleBalanceTap}
              className={`relative overflow-hidden group flex items-center bg-slate-800/90 hover:bg-slate-800 text-white rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 border border-brand-500/40 shadow-inner transition-all duration-300 ${
                balanceTapping ? 'scale-95' : 'hover:scale-102'
              }`}
              title="ট্যাপ করে ব্যালেন্স দেখুন"
            >
              <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center mr-2 shadow-sm">
                <span className="text-xs font-bold font-mono">৳</span>
              </div>

              <div className="text-left select-none">
                <p className="text-[9px] sm:text-[10px] text-brand-300 font-semibold uppercase tracking-wider">
                  {showBalance ? 'VoxPay ওয়ালেট' : 'ব্যালেন্স দেখতে ট্যাপ করুন'}
                </p>
                <div className="h-5 flex items-center">
                  {showBalance ? (
                    <div className="flex items-center space-x-2 animate-fadeIn">
                      <span className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                        ৳ {wallet.bdtBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded font-mono border border-cyan-800">
                        ¥{wallet.ecnyBalance} e-CNY
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-slate-300">
                      ••••••• ৳
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Dialect Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDialectDropdownOpen(!dialectDropdownOpen)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-700 transition"
                title="ভাষা পরিবর্তন"
              >
                <span>{currentDialectObj.flag}</span>
                <span className="hidden lg:inline">{currentDialectObj.name}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {dialectDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      ভয়েস ডায়ালেক্ট নির্বাচন
                    </p>
                  </div>
                  {DIALECTS.map((dialect) => (
                    <button
                      key={dialect.id}
                      onClick={() => {
                        setSelectedDialect(dialect.id);
                        setDialectDropdownOpen(false);
                        if (soundEnabled) {
                          voiceEngine.speakText(`ভয়েস ভাষা ${dialect.name} সেট করা হয়েছে`, dialect.voiceCode, false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition ${
                        selectedDialect === dialect.id
                          ? 'bg-brand-500/20 text-brand-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{dialect.flag}</span>
                        <span>{dialect.name}</span>
                      </div>
                      {selectedDialect === dialect.id && (
                        <CheckCircle2 size={13} className="text-brand-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition ${
                soundEnabled 
                  ? 'bg-brand-500/10 border-brand-500/40 text-brand-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'সাউন্ড চালু' : 'সাউন্ড বন্ধ'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* AI Advisor Modal Trigger */}
            <button
              onClick={onOpenCounselor}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-md transition"
              title="এআই আর্থিক উপদেষ্টা"
            >
              <Sparkles size={14} className="text-yellow-300 animate-spin-slow" />
              <span className="hidden sm:inline">AI Counselor</span>
            </button>

            {/* ML API Spec Modal Trigger */}
            <button
              onClick={onOpenMlSpec}
              className="flex items-center space-x-1 px-2.5 py-1.5 sm:py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-medium transition"
              title="ML Team API Documentation"
            >
              <Code2 size={15} />
              <span className="hidden lg:inline">ML Spec</span>
            </button>

          </div>

        </div>

        {/* Laptop / Desktop Sub-Navbar Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
