// Voice Engine Service: Speech Recognition, Text-To-Speech, Web Audio Soundbox Chime, & Biometric Verification
import { apiUrl } from '../constants/api';

class VoiceEngineService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.currentAudio = null;
    this.currentSource = null;
    this.audioCache = new Map(); // Client-side ArrayBuffer cache for instant 0ms playback
    this.currentAbortController = null;
    this.currentSpeechId = 0;
    this.initRecognition();
    this.setupUserGestureUnlock();
  }

  // Pre-warm / unlock Web Audio Context on the very first user interaction
  setupUserGestureUnlock() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.ensureAudioContext();
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('click', unlock, { once: true, passive: true });
    }
  }

  async ensureAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return this.audioContext;
    } catch (e) {
      return null;
    }
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
      const ctx = await this.ensureAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1: High crisp ding (880Hz - A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: Harmonic resolving chime (1318.5Hz - E6)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now + 0.15);
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('AudioContext chime error:', e);
    }
  }

  // Stop any active audio playback, cancel speech synthesis, and abort in-flight fetch immediately
  stopSpeaking() {
    this.currentSpeechId++;
    if (this.currentAbortController) {
      try {
        this.currentAbortController.abort();
      } catch (e) {
        // ignore
      }
      this.currentAbortController = null;
    }
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentSource = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
  }

  // Normalize text into natural, fluid spoken language (remove markdown, convert currency/fractions)
  normalizeForSpeech(text, lang = 'bn') {
    if (!text) return '';
    const isEn = lang.startsWith('en') || lang === 'english';
    let clean = text.replace(/[*#_`~>]+/g, ' ');

    if (isEn) {
      clean = clean
        .replace(/৳\s*([0-9,]+)/g, '$1 Taka')
        .replace(/¥\s*([0-9,]+)/g, '$1 Yuan')
        .replace(/\/+\s*900/g, ' out of 900 ')
        .replace(/\/+\s*৯০০/g, ' out of 900 ')
        .replace(/%/g, ' percent ')
        .replace(/[•·|]/g, ', ')
        .replace(/\bEMI\b/gi, 'EMI installment')
        .replace(/\bZKP\b/gi, 'Zero Knowledge Proof')
        .replace(/\bAI\b/g, 'A.I.');
    } else {
      clean = clean
        .replace(/৳\s*([0-9,]+)/g, '$1 টাকা')
        .replace(/¥\s*([0-9,]+)/g, '$1 ইউয়ান')
        .replace(/\/+\s*৯০০/g, ' ৯০০ এর মধ্যে ')
        .replace(/\/+\s*900/g, ' ৯০০ এর মধ্যে ')
        .replace(/%/g, ' শতাংশ ')
        .replace(/[•·|]/g, ', ')
        .replace(/\bEMI\b/gi, 'ইএমআই কিস্তি')
        .replace(/\bZKP\b/gi, 'জিরো নলেজ প্রুফ')
        .replace(/\bAI\b/g, 'এআই');
    }

    return clean.replace(/\s+/g, ' ').trim();
  }

  // Play audio buffer via Web Audio API (immune to autoplay restrictions)
  async playWebAudio(arrayBuffer) {
    try {
      const ctx = await this.ensureAudioContext();
      if (!ctx) return false;

      // Stop previous active source
      if (this.currentSource) {
        try {
          this.currentSource.stop();
          this.currentSource.disconnect();
        } catch (e) {}
        this.currentSource = null;
      }

      // decodeAudioData needs a slice clone because it detaches the buffer
      const bufferCopy = arrayBuffer.slice(0);
      const audioBuffer = await ctx.decodeAudioData(bufferCopy);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
        }
      };

      source.start(0);
      this.currentSource = source;
      return true;
    } catch (err) {
      console.warn('Web Audio playback error:', err);
      return false;
    }
  }

  // Fallback blob audio playback via HTML5 Audio
  playBlobAudio(arrayBuffer) {
    return new Promise((resolve) => {
      try {
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        this.currentAudio = audio;

        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          if (this.currentAudio === audio) this.currentAudio = null;
        };

        const p = audio.play();
        if (p && p.then) {
          p.then(() => resolve(true)).catch(() => {
            URL.revokeObjectURL(blobUrl);
            resolve(false);
          });
        } else {
          resolve(true);
        }
      } catch (e) {
        resolve(false);
      }
    });
  }

  // Fallback to browser SpeechSynthesis ONLY if genuine matching voice exists
  fallbackBrowserSpeech(cleanText, dialectCode = 'bn-BD') {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const isEn = dialectCode.startsWith('en') || dialectCode === 'english' || dialectCode === 'en-US';
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (!isEn) {
      selectedVoice = voices.find(v =>
        (v.lang && (v.lang.includes('bn') || v.lang.includes('Bengali'))) ||
        (v.name && (v.name.includes('Bangla') || v.name.includes('Bengali')))
      );

      // CRITICAL: NEVER allow an English voice to read Bengali text.
      // Doing so results in a robotic American-accented buzzing sound.
      if (!selectedVoice) {
        console.warn('No native Bengali voice found in browser speech synthesis. Skipping robotic fallback.');
        return;
      }
    } else {
      selectedVoice = voices.find(v =>
        v.lang && v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aria'))
      ) || voices.find(v => v.lang && v.lang.startsWith('en'));
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.15; // Natural lively pace, never sluggish
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  // Speak voice feedback in authentic human voice using neural audio streaming with instant caching
  async speakText(text, dialectCode = 'bn-BD', playChimeFirst = true) {
    if (typeof window === 'undefined') return;

    // 1. Immediately cancel any prior speech or in-flight fetch
    this.stopSpeaking();
    const speechId = ++this.currentSpeechId;
    this.currentAbortController = new AbortController();
    const signal = this.currentAbortController.signal;

    // Ensure audio context is ready
    await this.ensureAudioContext();

    const isEn = dialectCode.startsWith('en') || dialectCode === 'english' || dialectCode === 'en-US';
    const lang = isEn ? 'en' : 'bn';
    const clean = this.normalizeForSpeech(text, lang);
    if (!clean) return;

    // 2. Play chime asynchronously if requested
    if (playChimeFirst) {
      this.playSoundboxChime().catch(() => {});
    }

    const cacheKey = `${lang}:${clean}`;

    // 3. INSTANT CACHE HIT (0ms): If audio was already fetched or played, play immediately!
    if (this.audioCache.has(cacheKey)) {
      if (this.currentSpeechId !== speechId) return;
      const cachedBuffer = this.audioCache.get(cacheKey);
      await this.playWebAudio(cachedBuffer);
      return;
    }

    // 4. Primary: Stream authentic Neural Audio from Backend
    let audioBuffer = null;
    try {
      const backendUrl = apiUrl(`/api/tts?text=${encodeURIComponent(clean)}&lang=${lang}`);
      const res = await fetch(backendUrl, { signal });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        if (arrayBuffer && arrayBuffer.byteLength > 200) {
          audioBuffer = arrayBuffer;
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') return; // User navigated away, abort cleanly
      console.warn('Backend TTS error, falling back:', e);
    }

    // Check if user cancelled/left section while fetching
    if (this.currentSpeechId !== speechId) return;

    // 5. Secondary fallback: Direct Google Neural Audio stream (client-side)
    if (!audioBuffer) {
      try {
        const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(clean.slice(0, 180))}&tl=${lang}&client=tw-ob`;
        const directRes = await fetch(directUrl, { signal });
        if (directRes.ok) {
          const arrayBuffer = await directRes.arrayBuffer();
          if (arrayBuffer && arrayBuffer.byteLength > 200) {
            audioBuffer = arrayBuffer;
          }
        }
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }

    // Check again if cancelled
    if (this.currentSpeechId !== speechId) return;

    // 6. If audio buffer retrieved, save in client-side memory cache and play
    if (audioBuffer) {
      if (this.audioCache.size < 200) {
        this.audioCache.set(cacheKey, audioBuffer);
      }
      let played = await this.playWebAudio(audioBuffer);
      if (!played && this.currentSpeechId === speechId) {
        played = await this.playBlobAudio(audioBuffer);
      }
      if (played) return;
    }

    // Check again before fallback
    if (this.currentSpeechId !== speechId) return;

    // 7. Last resort: Browser speech synthesis (never reads Bengali with English voice)
    this.fallbackBrowserSpeech(clean, dialectCode);
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
