// Voice Engine Service: Speech Recognition, Text-To-Speech, Web Audio Soundbox Chime, & Biometric Verification

class VoiceEngineService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.initRecognition();
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      }
    }
  }

  // Play realistic Merchant Soundbox chime using Web Audio API
  async playSoundboxChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;

      // Note 1: High crisp ding (880Hz - A5)
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.audioContext.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: Harmonic resolving chime (1318.5Hz - E6)
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(this.audioContext.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('AudioContext chime error:', e);
    }
  }

  // Speak voice feedback in Bangla or English with Soundbox prefix
  speakText(text, dialectCode = 'bn-BD', playChimeFirst = true) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (playChimeFirst) {
      this.playSoundboxChime();
    }

    // Cancel current speaking
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      // Try to match Bengali voice if applicable, else fallback to standard
      if (dialectCode.startsWith('bn')) {
        const banglaVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('Bengali') || v.name.includes('Bangla'));
        if (banglaVoice) {
          utterance.voice = banglaVoice;
        } else {
          // If no local Bangla voice is installed, use an available high quality voice with Bangla text
          const generic = voices.find(v => v.lang.startsWith('en'));
          if (generic) utterance.voice = generic;
        }
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, playChimeFirst ? 450 : 0);
  }

  // Start real browser speech recognition with callback
  startListening({ lang = 'bn-BD', onResult, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError('Speech Recognition is not supported on this browser. Try Chrome/Edge or use the sample dialect simulator.');
      return;
    }

    this.recognition.lang = lang;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          finalText: finalTranscript.trim(),
          interimText: interimTranscript.trim()
        });
      }
    };

    this.recognition.onerror = (err) => {
      console.warn('SpeechRecognition error:', err);
      if (onError) onError(err.error || 'Voice input interrupted');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.warn('Recognition start error:', e);
      if (onError) onError('Microphone busy or already active');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  // Parse natural language voice command into structured FinTech Intent & Action
  parseVoiceIntent(transcript, selectedDialect) {
    const text = transcript.toLowerCase();

    // Loan intent
    if (text.includes('লোন') || text.includes('loan') || text.includes('ধার') || text.includes('টিয়া চাই') || text.includes('credit')) {
      // Look for amount in Bengali or English digits
      const digitsMatch = text.match(/(\d+)/);
      const bengaliDigits = { '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9 };
      let bengaliNum = '';
      for (const char of text) {
        if (bengaliDigits[char] !== undefined) bengaliNum += bengaliDigits[char];
      }

      const amount = digitsMatch ? parseInt(digitsMatch[0], 10) : (bengaliNum ? parseInt(bengaliNum, 10) : 5000);

      return {
        intent: 'REQUEST_LOAN',
        intentName: 'মাইক্রো-লোন আবেদন (Micro-Loan Request)',
        amount: amount || 5000,
        recipient: 'VoxPay Autonomous Loan Vault',
        feedback: `আপনার আবেদন গৃহীত হয়েছে। বিকল্প ডেটা ও এআই ক্রেডিট স্কোরের ভিত্তিতে ৳${(amount || 5000).toLocaleString('en-IN')} লোন অনুমোদন করা হচ্ছে।`,
        requiresBiometric: true
      };
    }

    // Send Money intent
    if (text.includes('পাঠাও') || text.includes('send') || text.includes('দাও') || text.includes('ট্রান্সফার') || text.includes('দেও')) {
      let recipient = 'আব্দুল রহিম';
      if (text.includes('করিম') || text.includes('karim')) recipient = 'করিম মিয়া';
      if (text.includes('ফাতেমা') || text.includes('fatema')) recipient = 'বেগম ফাতেমা';

      const digitsMatch = text.match(/(\d+)/);
      const amount = digitsMatch ? parseInt(digitsMatch[0], 10) : 500;

      return {
        intent: 'SEND_MONEY',
        intentName: 'টাকা পাঠানো (Send Money)',
        amount: amount,
        recipient: recipient,
        feedback: `${recipient}-কে ৳${amount} টাকা পাঠানোর জন্য প্রস্তুত। ভয়েস বায়োমেট্রিক কনফার্ম করুন।`,
        requiresBiometric: true
      };
    }

    // Utility bill intent
    if (text.includes('বিল') || text.includes('বিদ্যুৎ') || text.includes('কারেন্ট') || text.includes('utility') || text.includes('gas') || text.includes('পানি')) {
      return {
        intent: 'PAY_UTILITY',
        intentName: 'পল্লী বিদ্যুৎ বিল পেমেন্ট (Utility Pay)',
        amount: 850,
        recipient: 'পল্লী বিদ্যুৎ সমিতি (Palli Bidyut)',
        feedback: 'পল্লী বিদ্যুৎ বিল ৳৮৫০ টাকা স্বয়ংক্রিয়ভাবে পরিশোধ করা হচ্ছে।',
        requiresBiometric: false
      };
    }

    // e-CNY cross border remittance
    if (text.includes('cny') || text.includes('yuan') || text.includes('চীন') || text.includes('shenzhen') || text.includes('e-cny')) {
      return {
        intent: 'ECNY_REMITTANCE',
        intentName: 'Cross-Border e-CNY Remittance',
        amount: 200,
        currency: '¥',
        recipient: 'Shenzhen Merchant Gateway',
        feedback: 'Shenzhen e-CNY গেটওয়েতে ¥200 ইউয়ান সমপরিমাণ ৳৩,৩৮০ টাকা সফলভাবে রেমিট্যান্স প্রস্তুত।',
        requiresBiometric: true
      };
    }

    // Emergency disaster relief
    if (text.includes('ত্রাণ') || text.includes('বন্যা') || text.includes('ঘূর্ণিঝড়') || text.includes('relief') || text.includes('disaster') || text.includes('জরুরি')) {
      return {
        intent: 'EMERGENCY_RELIEF',
        intentName: 'স্বায়ত্তশাসিত জরুরি ত্রাণ ফান্ড (Disaster Relief)',
        amount: 5000,
        recipient: 'VoxPay Disaster Relief Pool',
        feedback: 'স্যাটেলাইট জিও-ফেন্সিং ভিত্তিতে আপনার একাউন্টে ০% সুদে জরুরি সহায়তা ৳৫,০০০ বরাদ্দ হয়েছে।',
        requiresBiometric: false
      };
    }

    // Default general query / credit check
    return {
      intent: 'CHECK_CREDIT_SCORE',
      intentName: 'AI ক্রেডিট স্কোর যাচাই (Credit Scoring)',
      amount: null,
      recipient: 'VoxPay AI Engine',
      feedback: 'আপনার এআই বিকল্প ক্রেডিট স্কোর ৭৮৫ (Platinum Rural Pro)। আপনি সর্বোচ্চ ৳২৫,০০০ পর্যন্ত তাৎক্ষণিক মাইক্রো-লোন পেতে যোগ্য!',
      requiresBiometric: false
    };
  }

  // Simulate Biometric Voice-Print Verification
  simulateVoicePrintAnalysis() {
    // Generates biometric match parameters
    const pitchMatch = (97.5 + Math.random() * 2.3).toFixed(1); // 97.5% - 99.8%
    const formantCorrelation = (96.0 + Math.random() * 3.5).toFixed(1);
    const breathingLiveness = 'LIVE_ORGANIC_HUMAN'; // or 'DEEPFAKE_REPLAY_ATTACK'
    const stressIndex = Math.floor(18 + Math.random() * 14); // 18-32% (Calm / Normal)

    return {
      isVerified: true,
      confidenceScore: pitchMatch,
      formantCorrelation,
      breathingLiveness,
      stressIndex,
      isDeepfake: false,
      isDuress: false,
      algorithm: 'PQC Lattice Lattice-Hash + Mel-Spectrogram 256'
    };
  }
}

export const voiceEngine = new VoiceEngineService();
