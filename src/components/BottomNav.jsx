import React from 'react';
import { Home, Landmark, Mic, CloudRain, Clock } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onVoiceClick }) {
  const tabs = [
    { id: 'overview', label: 'হোম', icon: Home },
    { id: 'loan', label: 'লোন ও স্কোর', icon: Landmark },
    { id: 'voice', label: 'ভয়েস পে', icon: Mic, isCenter: true },
    { id: 'weather', label: 'ওয়েদার', icon: CloudRain },
    { id: 'history', label: 'স্টেটমেন্ট', icon: Clock },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={onVoiceClick}
                className="relative -top-3.5 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-600 via-brand-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/40 ring-4 ring-slate-900 group-hover:scale-105 group-active:scale-95 transition-all">
                  <Mic size={22} className="animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-brand-400 mt-0.5">
                  ভয়েস পে
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive ? 'text-brand-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-xl transition ${isActive ? 'bg-brand-500/15' : ''}`}>
                <Icon size={19} className={isActive ? 'text-brand-400' : 'text-slate-400'} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
