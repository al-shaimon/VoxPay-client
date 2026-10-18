import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Sparkles, Volume2, Mic, Bot, User, 
  HelpCircle, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { aiCounselor, COUNSELOR_PRESETS } from '../services/aiCounselorService';
import { voiceEngine } from '../services/voiceEngine';

export default function FinancialCounselorChat({ 
  isOpen, 
  onClose, 
  selectedDialect, 
  soundEnabled 
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি VoxPay এআই আর্থিক উপদেষ্টা। আপনার ক্ষুদ্র সঞ্চয়, সহজ কিস্তির ঋণ, বা দুর্যোগ সুরক্ষা সংক্রান্ত যেকোনো প্রশ্ন মুখে বলুন বা লিখে জানান।',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const reply = await aiCounselor.askCounselor(textToSend, selectedDialect);

    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: reply,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsThinking(false);

    if (soundEnabled) {
      voiceEngine.speakText(reply, 'bn-BD', false);
    }
  };

  const handleMicVoice = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      if (soundEnabled) {
        voiceEngine.playSoundboxChime();
      }

      voiceEngine.startListening({
        lang: 'bn-BD',
        onResult: (res) => {
          if (res.finalText) {
            setIsListening(false);
            setInputText(res.finalText);
            handleSendMessage(res.finalText);
          }
        },
        onError: () => {
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl h-[90vh] max-h-[680px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center ring-2 ring-purple-500/30">
              <Sparkles size={20} className="text-purple-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">VoxAI Financial Counselor</h3>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800">
                  GenAI 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ভয়েস ও টেক্সটে বুদ্ধিমান আর্থিক ও ঋণ পরামর্শক
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Questions Bar */}
        <div className="p-3 bg-slate-950 border-b border-slate-800/80 overflow-x-auto scrollbar-none flex gap-2">
          {COUNSELOR_PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p.q)}
              className="flex-shrink-0 text-left px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-600/40 text-xs text-slate-300 transition"
            >
              <span className="text-[10px] text-purple-400 font-semibold block">{p.topic}</span>
              <span className="truncate max-w-[200px] block">{p.q}</span>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-500/30">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                {msg.sender === 'ai' && soundEnabled && (
                  <button
                    onClick={() => voiceEngine.speakText(msg.text, 'bn-BD', false)}
                    className="mt-2 text-[11px] text-purple-400 hover:text-purple-300 flex items-center space-x-1 font-medium"
                  >
                    <Volume2 size={13} />
                    <span>পুনরায় শুনুন (Listen again)</span>
                  </button>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 flex items-center justify-center flex-shrink-0 mt-1 border border-brand-500/30">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-2 text-xs text-purple-400 font-medium p-2">
              <Bot size={16} className="animate-spin" />
              <span>এআই উত্তর বিশ্লেষণ করছে...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={handleMicVoice}
              className={`p-3 rounded-2xl transition ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="মুখে কথা বলুন"
            >
              <Mic size={18} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="আর্থিক বিষয়ে যেকোনো প্রশ্ন লিখুন বা মুখে বলুন..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
