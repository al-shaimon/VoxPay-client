import React from 'react';
import { 
  Send, ArrowDownLeft, Smartphone, Landmark, 
  CloudRain, ShieldAlert, Coins, Speaker, Sparkles, HeartHandshake 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function QuickActionsGrid({ 
  onActionClick 
}) {
  const { lang, t } = useLanguage();
  const actions = [
    {
      id: 'send_money',
      name: 'Send Money',
      bnName: 'টাকা পাঠানো',
      icon: Send,
      color: 'from-pink-500 to-rose-600',
      tag: lang === 'en' ? 'Voice PIN-Free' : 'ভয়েস পিনবিহীন',
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    {
      id: 'recharge',
      name: 'Recharge',
      bnName: 'মোবাইল রিচার্জ',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-600',
      tag: 'Instant 4G/5G',
      badgeColor: 'bg-cyan-500/20 text-cyan-300'
    },
    {
      id: 'ai_loan',
      name: 'AI Micro-Loan',
      bnName: 'এআই ঋণ ও স্কোর',
      icon: Landmark,
      color: 'from-emerald-500 to-teal-600',
      tag: lang === 'en' ? '0% First 30 Days' : '০% প্রথম ৩০ দিন',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'weather_protection',
      name: 'Weather Shield',
      bnName: 'আবহাওয়া ঝুঁকি সুরক্ষা',
      icon: CloudRain,
      color: 'from-sky-500 to-blue-600',
      tag: lang === 'en' ? 'Satellite Auto-Freeze' : 'স্যাটেলাইট অটো-ফ্রিজ',
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    {
      id: 'zkp_verify',
      name: 'ZKP Privacy',
      bnName: 'গোপন ব্যালেন্স যাচাই',
      icon: ShieldAlert,
      color: 'from-purple-500 to-violet-600',
      tag: 'zk-SNARK On-Chain',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'cross_border_ecny',
      name: 'e-CNY Gateway',
      bnName: 'Shenzhen ডিজিটাল ইউয়ান',
      icon: Coins,
      color: 'from-amber-500 to-orange-600',
      tag: 'Cross-Border CBDC',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'soundbox_pay',
      name: 'Soundbox Audio',
      bnName: 'সাউন্ডবক্স মার্চেন্ট পে',
      icon: Speaker,
      color: 'from-fuchsia-500 to-pink-600',
      tag: lang === 'en' ? 'Audio Chime' : 'অডিও স্বীকৃতি',
      badgeColor: 'bg-pink-500/20 text-pink-300'
    },
    {
      id: 'emergency_relief',
      name: 'Disaster Relief',
      bnName: 'স্বায়ত্তশাসিত ত্রাণ ফান্ড',
      icon: HeartHandshake,
      color: 'from-red-500 to-rose-700',
      tag: lang === 'en' ? '0% Interest Aid' : '০% সুদে সহায়তা',
      badgeColor: 'bg-rose-500/20 text-rose-300'
    }
  ];

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
          <span>{lang === 'en' ? 'Core Financial Services' : 'মূল সেবাসমূহ (Core MFS Services)'}</span>
        </h3>
        <span className="text-xs text-slate-400">
          {lang === 'en' ? 'Voice or tap' : 'ভয়েস বা ট্যাপ করুন'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.id)}
              className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-brand-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center"
            >
              {/* Badge Tag */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${act.badgeColor}`}>
                {act.tag}
              </span>

              {/* Icon Container with Gradient */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>

              {/* Titles */}
              <div className="mt-2.5">
                <p className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-brand-300 transition-colors">
                  {lang === 'en' ? act.name : act.bnName}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {lang === 'en' ? act.bnName : act.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
