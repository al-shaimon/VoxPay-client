import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2, VolumeX, Globe, Sparkles,
  ChevronDown, CheckCircle2, Code2,
  Home, Landmark, Mic, CloudRain, Clock, Eye, EyeOff
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
  const [dialectDropdownOpen, setDialectDropdownOpen] = useState(false);
  const balanceTimerRef = useRef(null);

  const currentDialectObj = DIALECTS.find(d => d.id === selectedDialect) || DIALECTS[0];

  const handleToggleBalance = () => {
    if (showBalance) {
      setShowBalance(false);
      if (balanceTimerRef.current) clearTimeout(balanceTimerRef.current);
    } else {
      setShowBalance(true);
      if (soundEnabled) voiceEngine.playSoundboxChime();
      if (balanceTimerRef.current) clearTimeout(balanceTimerRef.current);
      // Auto-hide balance after 7 seconds just like bKash / Nagad
      balanceTimerRef.current = setTimeout(() => {
        setShowBalance(false);
      }, 7000);
    }
  };

  useEffect(() => {
    return () => {
      if (balanceTimerRef.current) clearTimeout(balanceTimerRef.current);
    };
  }, []);

  const dropdownRef = useRef(null);

  // Close dialect dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDialectDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDialectDropdownOpen(false);
      }
    };
    if (dialectDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialectDropdownOpen]);

  const navLinks = [
    { id: 'overview', label: 'হোম',       icon: Home },
    { id: 'loan',     label: 'AI লোন',    icon: Landmark },
    { id: 'voice',    label: 'ভয়েস পে',   icon: Mic },
    { id: 'weather',  label: 'ওয়েদার',    icon: CloudRain },
    { id: 'history',  label: 'স্টেটমেন্ট', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full overflow-visible" style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ── Main Top Row ──────────────────────────────────── */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #e2136e, #9333ea)' }}>
                <span className="text-white font-black text-sm sm:text-base">V</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#070b14' }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                Vox<span style={{ color: '#e2136e' }}>Pay</span>
              </span>
              <span className="badge badge-brand hidden md:inline-flex text-[10px]">Voice-First MFS</span>
            </div>
          </div>

          {/* Desktop Balance Pill (Hidden on Mobile, Clean on Tablet/Desktop) */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              onClick={handleToggleBalance}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{
                background: showBalance ? 'rgba(226,19,110,0.12)' : 'rgba(255,255,255,0.05)',
                border: showBalance ? '1px solid rgba(226,19,110,0.3)' : '1px solid rgba(255,255,255,0.09)',
                boxShadow: showBalance ? '0 0 24px -6px rgba(226,19,110,0.3)' : 'none'
              }}
              title="ব্যালেন্স জানতে ক্লিক করুন"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: '#e2136e' }}>৳</div>
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#f472b6' }}>
                  {showBalance ? 'ওয়ালেট ব্যালেন্স' : 'ব্যালেন্স দেখুন'}
                </p>
                <div className="h-5 flex items-center">
                  {showBalance ? (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <span className="font-extrabold text-sm text-white">
                        ৳{wallet.bdtBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="badge badge-cyan text-[10px] py-0 px-1.5">¥{wallet.ecnyBalance}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold tracking-wider" style={{ color: '#64748b' }}>••••••• ৳</span>
                  )}
                </div>
              </div>
              <div className="w-5 h-5 flex items-center justify-center">
                {showBalance ? <EyeOff size={14} style={{ color: '#f472b6' }} /> : <Eye size={14} style={{ color: '#64748b' }} />}
              </div>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* AI Advisor Button */}
            <button
              onClick={onOpenCounselor}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition active:scale-95 shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 16px -4px rgba(124,58,237,0.5)' }}
              title="Groq AI Financial Counselor"
            >
              <Sparkles size={13} className="animate-spin-slow text-yellow-300 shrink-0" />
              <span className="hidden sm:inline">AI Advisor</span>
              <span className="sm:hidden font-bold text-[11px]">AI</span>
            </button>

            {/* Dialect Selector */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDialectDropdownOpen(!dialectDropdownOpen)}
                className="btn-ghost gap-1 px-2 sm:px-2.5 py-1.5 shrink-0"
                title="ভাষা নির্বাচন"
                aria-haspopup="true"
                aria-expanded={dialectDropdownOpen}
              >
                <Globe size={14} className="shrink-0" />
                <span className="hidden sm:inline text-xs font-medium">{currentDialectObj.name}</span>
                <span className="sm:hidden text-xs">{currentDialectObj.flag}</span>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform duration-200 shrink-0 ${dialectDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dialectDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl p-2 z-50 animate-fadeInScale shadow-2xl"
                  style={{
                    background: 'rgba(13, 20, 38, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(226, 19, 110, 0.2)'
                  }}
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      ভাষা ও আঞ্চলিক ভয়েস
                    </span>
                    <span className="text-[10px] text-pink-400 font-semibold px-1.5 py-0.5 rounded bg-pink-500/10">5টি ডায়ালেক্ট</span>
                  </div>
                  <div className="space-y-1 max-h-[70vh] overflow-y-auto scrollbar-none">
                    {DIALECTS.map((dialect) => {
                      const isSelected = selectedDialect === dialect.id;
                      return (
                        <button
                          key={dialect.id}
                          onClick={() => {
                            setSelectedDialect(dialect.id);
                            setDialectDropdownOpen(false);
                            if (soundEnabled) voiceEngine.speakText(`${dialect.name} সেট হয়েছে`, dialect.voiceCode, false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                            isSelected
                              ? 'bg-pink-500/15 text-pink-300 font-semibold border border-pink-500/30'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{dialect.flag}</span>
                            <div className="text-left min-w-0">
                              <p className="font-semibold text-xs truncate leading-tight">{dialect.name}</p>
                              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">{dialect.region}</p>
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 size={15} className="text-pink-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="btn-ghost p-1.5 sm:p-2 shrink-0"
              title={soundEnabled ? 'সাউন্ড চালু' : 'সাউন্ড বন্ধ'}
            >
              {soundEnabled ? <Volume2 size={15} style={{ color: '#e2136e' }} /> : <VolumeX size={15} />}
            </button>

            {/* ML Spec */}
            <button
              onClick={onOpenMlSpec}
              className="btn-ghost p-2 hidden md:flex shrink-0"
              title="ML API Spec"
            >
              <Code2 size={15} style={{ color: '#22d3ee' }} />
            </button>
          </div>
        </div>

        {/* ── Mobile Balance Bar (Under navbar for 100% responsive phone experience) ── */}
        <div className="md:hidden pb-2.5 pt-0">
          <button
            onClick={handleToggleBalance}
            className="w-full flex items-center justify-between px-3 py-2 rounded-2xl transition-all duration-300 active:scale-[0.98]"
            style={{
              background: showBalance ? 'rgba(226,19,110,0.12)' : 'rgba(255,255,255,0.04)',
              border: showBalance ? '1px solid rgba(226,19,110,0.32)' : '1px solid rgba(255,255,255,0.07)',
              boxShadow: showBalance ? '0 0 20px -5px rgba(226,19,110,0.25)' : 'none'
            }}
          >
            {/* Left Icon & Text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: '#e2136e' }}>
                ৳
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#f472b6' }}>
                  {showBalance ? 'ওয়ালেট ব্যালেন্স' : 'ব্যালেন্স জানতে ট্যাপ করুন'}
                </p>
                <div className="h-5 flex items-center min-w-0">
                  {showBalance ? (
                    <div className="flex items-center gap-1.5 animate-fadeIn flex-wrap">
                      <span className="font-extrabold text-sm text-white whitespace-nowrap">
                        ৳{wallet.bdtBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="badge badge-cyan text-[10px] py-0 px-1.5 shrink-0">¥{wallet.ecnyBalance}</span>
                      {wallet.greenTokens !== undefined && (
                        <span className="badge badge-emerald text-[10px] py-0 px-1.5 hidden xs:inline-flex shrink-0">
                          🌿 {wallet.greenTokens}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      ••••••• ৳ (ট্যাপ করুন)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Toggle Indicator */}
            <div className="flex items-center gap-1.5 pl-2 shrink-0">
              <span className="text-[11px] font-medium" style={{ color: showBalance ? '#f472b6' : '#94a3b8' }}>
                {showBalance ? 'লুকান' : 'দেখুন'}
              </span>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {showBalance ? <EyeOff size={13} style={{ color: '#f472b6' }} /> : <Eye size={13} style={{ color: '#94a3b8' }} />}
              </div>
            </div>
          </button>
        </div>

        {/* ── Desktop Nav Tabs ──────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1 py-2 overflow-x-auto scrollbar-none" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0"
                style={isActive
                  ? { background: 'rgba(226,19,110,0.15)', color: '#f472b6', border: '1px solid rgba(226,19,110,0.25)' }
                  : { color: '#64748b', background: 'transparent', border: '1px solid transparent' }}
              >
                <Icon size={14} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
