import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownLeft, Search, Copy, Check, Filter 
} from 'lucide-react';

export default function TransactionHistory({ transactions }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredList = transactions.filter(tx => {
    if (activeFilter === 'SENT' && tx.amount >= 0) return false;
    if (activeFilter === 'RECEIVED' && tx.amount < 0) return false;
    if (activeFilter === 'REMITTANCE' && tx.type !== 'ecny_remit') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.title.toLowerCase().includes(q) ||
        tx.recipient.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (id, hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Header with Title and Search Bar */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            লেনদেন হিস্ট্রি ও অন-চেইন অডিট ট্রেল
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            ক্রিপ্টোগ্রাফিক zk-SNARK হ্যাশ ও ভয়েস বায়োমেট্রিক দ্বারা সংরক্ষিত
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="লেনদেন বা নম্বর খুঁজুন..."
            className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {[
          { id: 'ALL', label: 'সব লেনদেন (All)' },
          { id: 'SENT', label: 'প্রেরিত (Sent)' },
          { id: 'RECEIVED', label: 'প্রাপ্ত (Received)' },
          { id: 'REMITTANCE', label: 'e-CNY রেমিট্যান্স' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition ${
              activeFilter === tab.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredList.map((tx) => {
          const isNegative = tx.amount < 0;
          return (
            <div
              key={tx.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isNegative ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                }`}>
                  {isNegative ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white">{tx.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                      [{tx.id}]
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {tx.recipient} • {tx.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end">
                <span className={`font-black font-mono text-sm sm:text-base ${
                  isNegative ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {isNegative ? '-' : '+'} {Math.abs(tx.amount).toLocaleString('en-IN')} {tx.currency}
                </span>
                <button
                  onClick={() => handleCopy(tx.id, tx.zkpHash)}
                  className="text-[10px] sm:text-xs text-slate-500 hover:text-slate-300 font-mono inline-flex items-center space-x-1 mt-0.5"
                  title="zkP Hash কপি করুন"
                >
                  <span>zk: {tx.zkpHash}</span>
                  {copiedId === tx.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            কোনো লেনদেন পাওয়া যায়নি
          </div>
        )}
      </div>

    </div>
  );
}
