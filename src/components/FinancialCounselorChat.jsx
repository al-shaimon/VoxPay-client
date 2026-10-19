import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Mic, Bot, User, Volume2, Zap } from 'lucide-react';
import { aiCounselor, COUNSELOR_PRESETS } from '../services/aiCounselorService';
import { voiceEngine } from '../services/voiceEngine';

const GROQ_KEY_SET = import.meta.env.VITE_GROQ_API_KEY && import.meta.env.VITE_GROQ_API_KEY !== 'your_groq_api_key_here';

export default function FinancialCounselorChat({ isOpen, onClose, selectedDialect, soundEnabled, wallet }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি VoxAI — আপনার আর্থিক উপদেষ্টা। সঞ্চয়, লোন, বা দুর্যোগ সুরক্ষা সংক্রান্ত যেকোনো প্রশ্ন করুন।',
      timestamp: 'এইমাত্র',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      aiCounselor.resetHistory();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const text = (queryText || inputText).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), sender: 'user', text, timestamp: 'এইমাত্র' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const reply = await aiCounselor.askCounselor(text, selectedDialect, wallet);

    const aiMsg = { id: Date.now() + 1, sender: 'ai', text: reply, timestamp: 'এইমাত্র' };
    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);

    if (soundEnabled) voiceEngine.speakText(reply, 'bn-BD', false);
  };

  const handleMic = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      if (soundEnabled) voiceEngine.playSoundboxChime();
      voiceEngine.startListening({
        lang: 'bn-BD',
        onResult: (res) => {
          if (res.finalText) {
            setIsListening(false);
            handleSend(res.finalText);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false),
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel w-full" style={{ maxWidth: '560px', height: '85vh', maxHeight: '680px', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(13,20,38,0))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center ring-2"
                style={{ background: 'rgba(124,58,237,0.2)', ringColor: 'rgba(124,58,237,0.3)' }}>
                <Sparkles size={20} style={{ color: '#c4b5fd' }} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2" style={{ borderColor: '#0d1426' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">VoxAI Financial Advisor</h3>
                {GROQ_KEY_SET ? (
                  <span className="badge badge-purple flex items-center gap-1"><Zap size={10} />Groq</span>
                ) : (
                  <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>Local AI</span>
                )}
              </div>
              <p className="text-xs" style={{ color: '#64748b' }}>ভয়েস ও টেক্সটে বুদ্ধিমান পরামর্শ</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={17} />
          </button>
        </div>

        {/* Preset Quick Questions */}
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {COUNSELOR_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.q)}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-left text-xs transition"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="font-bold block" style={{ color: '#c4b5fd', fontSize: '10px' }}>{p.topic}</span>
              <span className="text-slate-400 max-w-[150px] block truncate">{p.q}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  <Bot size={15} style={{ color: '#c4b5fd' }} />
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
              }`}
                style={msg.sender === 'user'
                  ? { background: 'linear-gradient(135deg, #e2136e, #9333ea)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p>{msg.text}</p>
                {msg.sender === 'ai' && soundEnabled && (
                  <button
                    onClick={() => voiceEngine.speakText(msg.text, 'bn-BD', false)}
                    className="mt-2 flex items-center gap-1 text-[11px] font-medium transition"
                    style={{ color: '#8b5cf6' }}
                  >
                    <Volume2 size={11} />
                    পুনরায় শুনুন
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(226,19,110,0.2)', border: '1px solid rgba(226,19,110,0.3)' }}>
                  <User size={15} style={{ color: '#f472b6' }} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2.5 animate-fadeIn">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <Bot size={15} style={{ color: '#c4b5fd' }} />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-blink" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMic}
              className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all"
              style={isListening
                ? { background: '#e2136e', boxShadow: '0 0 20px rgba(226,19,110,0.5)' }
                : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
            >
              <Mic size={17} style={{ color: isListening ? '#fff' : '#94a3b8' }} className={isListening ? 'animate-blink' : ''} />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="যেকোনো প্রশ্ন লিখুন বা মুখে বলুন..."
              className="input-field flex-1"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              <Send size={16} style={{ color: '#fff' }} />
            </button>
          </form>

          {!GROQ_KEY_SET && (
            <p className="text-center text-[10px] mt-2" style={{ color: '#475569' }}>
              💡 .env-এ <code style={{ color: '#fbbf24' }}>VITE_GROQ_API_KEY</code> যোগ করলে Groq AI সক্রিয় হবে
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
