import React, { useState } from 'react';
import { 
  CloudRain, Wind, AlertTriangle, ShieldCheck, CheckCircle2, 
  Satellite, PauseCircle, Play, DollarSign, Sparkles 
} from 'lucide-react';
import { WEATHER_DISASTER_SCENARIOS } from '../constants/data';
import { voiceEngine } from '../services/voiceEngine';

export default function WeatherProtectionSection({ 
  wallet, 
  onDisasterTrigger, 
  soundEnabled 
}) {
  const [activeScenarioId, setActiveScenarioId] = useState('cyclone_bay');
  const [isSimulating, setIsSimulating] = useState(false);

  const currentScenario = WEATHER_DISASTER_SCENARIOS.find(s => s.id === activeScenarioId) || WEATHER_DISASTER_SCENARIOS[0];
  const isEmergency = currentScenario.riskLevel !== 'NORMAL';

  const handleScenarioChange = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    setIsSimulating(true);

    const scenario = WEATHER_DISASTER_SCENARIOS.find(s => s.id === scenarioId);

    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
    }

    setTimeout(() => {
      setIsSimulating(false);
      onDisasterTrigger(scenario);

      if (soundEnabled) {
        if (scenario.riskLevel !== 'NORMAL') {
          voiceEngine.speakText(`আবহাওয়া সতর্কতা সংকেত জারি। আপনার লোন কিস্তি ফ্রিজ করা হয়েছে এবং শস্যবীমা বরাদ্দ করা হলো।`, 'bn-BD', false);
        } else {
          voiceEngine.speakText('আবহাওয়া স্বাভাবিক অবস্থায় ফিরে এসেছে।', 'bn-BD', false);
        }
      }
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Scenario Switcher */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Satellite size={18} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              স্যাটেলাইট ওয়েদার-রিস্ক লোন প্রটেকশন
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sentinel-3 ও NOAA স্যাটেলাইট রাডার ভিত্তিক স্বয়ংক্রিয় কিস্তি ফ্রিজ ও শস্যবীমা
          </p>
        </div>

        {/* Scenarios Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WEATHER_DISASTER_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleScenarioChange(sc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
                activeScenarioId === sc.id
                  ? 'bg-sky-600 border-sky-400 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{sc.riskLevel === 'SEVERE' ? '🌪️' : sc.riskLevel === 'HIGH' ? '🌊' : '☀️'}</span>
              <span>{sc.division}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Responsive Grid: Laptop (2 Columns) / Mobile (Stacked) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (6 Cols): Weather Satellite Telemetry */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              স্যাটেলাইট ডেটা ফিড (Sentinel-3)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 text-xs font-mono">
              {currentScenario.region}
            </span>
          </div>

          <div className={`p-5 rounded-2xl border text-center space-y-2 ${
            isEmergency 
              ? 'bg-gradient-to-b from-slate-950 to-sky-950/30 border-sky-500/40' 
              : 'bg-gradient-to-b from-slate-950 to-emerald-950/20 border-emerald-500/30'
          }`}>
            <div className="text-4xl">
              {currentScenario.riskLevel === 'SEVERE' ? '🌪️' : currentScenario.riskLevel === 'HIGH' ? '🌊' : '☀️'}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {currentScenario.title}
            </h3>
            <p className="text-xs text-slate-400">
              বাতাসের গতিবেগ: <strong className="text-white">{currentScenario.satelliteWindSpeed}</strong> • প্লাবন সম্ভাবনা: <strong className="text-white">{currentScenario.rainProbability}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white">স্বয়ংক্রিয় সুরক্ষাসমূহ:</h4>
            {currentScenario.actions.map((act, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
                <CheckCircle2 size={15} className="text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (6 Cols): Active Loan & Insurance Payout Safeguards */}
        <div className="lg:col-span-6 rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ঋণগ্রহীতা সুরক্ষা অবস্থা (Shield Status)
              </span>
              {wallet.activeLoan?.isFrozenDueToDisaster ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center space-x-1">
                  <PauseCircle size={13} />
                  <span>কিস্তি ফ্রিজ (FROZEN)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1">
                  <Play size={13} />
                  <span>নিয়মিত কিস্তি অ্যাক্টিভ</span>
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">বর্তমান সক্রিয় ঋণ:</span>
                <span className="font-bold text-white">৳১৫,০০০ (৩ কিস্তি অবশিষ্ট)</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">দুর্যোগকালীন ফ্রিজ পেনাল্টি সুদ:</span>
                <span className="font-bold text-emerald-400">০% (সম্পূর্ণ মওকুফ)</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400">তাৎক্ষণিক শস্যবীমা ক্লেইম:</span>
                <span className="font-bold text-sky-400">৳৮,৫০০ সরাসরি ওয়ালেটে যুক্ত</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            {isEmergency ? (
              <p className="text-sky-300 font-medium">
                ⚡ দুর্যোগ পরিস্থিতি স্বাভাবিক না হওয়া পর্যন্ত কোনো ব্যাংক এসএমএস বা কিস্তির তাগাদা পাঠানো হবে না।
              </p>
            ) : (
              <p>
                শান্তকালীন সাধারণ মোড। স্যাটেলাইট রাডার প্রতিনিয়ত বাংলাদেশের আবহাওয়া পর্যবেক্ষণ করছে।
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
