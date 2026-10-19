import React from 'react';
import { Home, Landmark, Mic, CloudRain, Clock } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onVoiceClick }) {
  const tabs = [
    { id: 'overview', label: 'হোম',       icon: Home },
    { id: 'loan',     label: 'লোন',       icon: Landmark },
    { id: 'voice',    label: 'ভয়েস',      icon: Mic,      isCenter: true },
    { id: 'weather',  label: 'ওয়েদার',    icon: CloudRain },
    { id: 'history',  label: 'ইতিহাস',    icon: Clock },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40"
      style={{ background: 'rgba(7,11,20,0.95)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-around h-16 px-3 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={onVoiceClick}
                className="relative -top-5 flex flex-col items-center gap-0.5"
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center ring-4 transition-transform active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #e2136e, #9333ea)',
                    boxShadow: '0 8px 32px -4px rgba(226,19,110,0.6)',
                    ringColor: '#070b14'
                  }}>
                  <Mic size={22} className="text-white animate-blink" />
                </div>
                <span className="text-[10px] font-bold" style={{ color: '#f472b6' }}>ভয়েস</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 flex-1 py-1 transition-all"
            >
              <div className="p-1.5 rounded-xl transition-all"
                style={isActive ? { background: 'rgba(226,19,110,0.15)' } : {}}>
                <Icon size={19} style={{ color: isActive ? '#f472b6' : '#475569' }} />
              </div>
              <span className="text-[10px] font-semibold tracking-tight"
                style={{ color: isActive ? '#f472b6' : '#475569' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
