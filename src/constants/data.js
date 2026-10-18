// VoxPay Constants and Initial Dataset

export const DIALECTS = [
  {
    id: 'standard-bangla',
    name: 'প্রমিত বাংলা',
    subname: 'Standard Bengali',
    flag: '🇧🇩',
    sampleVoicePrompt: 'রহিমকে ৫০০ টাকা পাঠাও',
    translatedVoicePrompt: 'Send 500 BDT to Rahim',
    voiceCode: 'bn-BD',
    accentTone: 'Formal Standard'
  },
  {
    id: 'chittagong',
    name: 'চাঁটগাঁইয়া',
    subname: 'Chittagonian',
    flag: '⚓',
    sampleVoicePrompt: 'অনরে পাঁচ হাজার টিয়া লোন চাই, দেন না',
    translatedVoicePrompt: 'I want a 5,000 Taka loan, please approve it',
    voiceCode: 'bn-BD',
    accentTone: 'Chatgaya Coastal'
  },
  {
    id: 'sylhet',
    name: 'ছিলটী',
    subname: 'Sylheti',
    flag: '🍵',
    sampleVoicePrompt: 'আমার একাউন্ট থাকি কারেন্টের বিল দিলাইতাউ',
    translatedVoicePrompt: 'Pay my electricity bill from my account',
    voiceCode: 'bn-BD',
    accentTone: 'Surma Valley Dialect'
  },
  {
    id: 'banglish',
    name: 'Banglish',
    subname: 'Romanized Bangla',
    flag: '💬',
    sampleVoicePrompt: 'Amar credit score check kore 10000 loan dao',
    translatedVoicePrompt: 'Check my credit score and give 10,000 loan',
    voiceCode: 'en-US',
    accentTone: 'Urban Youth'
  },
  {
    id: 'english',
    name: 'English',
    subname: 'Global / Shenzhen',
    flag: '🌐',
    sampleVoicePrompt: 'Transfer 200 e-CNY to Shenzhen merchant',
    translatedVoicePrompt: 'Transfer 200 e-CNY to Shenzhen merchant',
    voiceCode: 'en-US',
    accentTone: 'International FinTech'
  }
];

export const INITIAL_WALLET = {
  accountName: 'মোহাম্মদ করিম (Mohammad Karim)',
  phone: '01712-984521',
  nid: '19922695482000314',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  bdtBalance: 24850.50,
  ecnyBalance: 1250.00, // Shenzhen Digital Yuan
  greenTokens: 340, // ESG loyalty tokens
  soulboundDid: 'did:vox:0x89C1...42F7',
  kycLevel: 'Tier 3 (Voice Biometric + ZKP Verified)',
  trustScore: 785, // 300 - 900
  fraudRiskLevel: 'LOW_RISK', // 'LOW_RISK' | 'MODERATE' | 'HIGH_RISK_FRAUD'
  creditTier: 'Platinum Rural Pro',
  activeLoan: {
    hasLoan: true,
    amount: 15000,
    remainingInstallments: 3,
    monthlyEmi: 5120,
    isFrozenDueToDisaster: false,
    disasterFreezeReason: null
  }
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-9021',
    type: 'send_money',
    title: 'টাকা পাঠানো (Send Money)',
    recipient: 'আব্দুল রহিম (01819-332145)',
    amount: -500,
    currency: '৳',
    timestamp: 'আজ, ১০:৪২ AM',
    status: 'Completed',
    verifiedBy: 'Voice Biometric AI',
    zkpHash: '0x3f8a...99c2'
  },
  {
    id: 'TXN-9020',
    type: 'recharge',
    title: 'মোবাইল রিচার্জ (Grameenphone)',
    recipient: '01712-984521 (Self)',
    amount: -120,
    currency: '৳',
    timestamp: 'গতকাল, ০৬:১৫ PM',
    status: 'Completed',
    verifiedBy: 'Instant Pinless Voice',
    zkpHash: '0x9d11...bb01'
  },
  {
    id: 'TXN-9019',
    type: 'ecny_remit',
    title: 'Cross-Border e-CNY Remittance',
    recipient: 'Shenzhen Hardware Supplies Ltd.',
    amount: -200,
    currency: '¥',
    bdtEquivalent: 3380,
    timestamp: '১৬ অক্টোবর, ০২:২০ PM',
    status: 'Completed',
    verifiedBy: 'CBDC Ledger Bridge',
    zkpHash: '0x7e44...81df'
  },
  {
    id: 'TXN-9018',
    type: 'cash_in',
    title: 'টাকা গ্রহণ (Soundbox Merchant Pay)',
    recipient: 'করিম জেনারেল স্টোর (Agent)',
    amount: 2500,
    currency: '৳',
    timestamp: '১৫ অক্টোবর, ১১:০০ AM',
    status: 'Completed',
    verifiedBy: 'NFC Soundbox Confirmation',
    zkpHash: '0x1c88...e332'
  },
  {
    id: 'TXN-9017',
    type: 'green_reward',
    title: 'Solar Energy ESG Loyalty Reward',
    recipient: 'IDCOL Rural Solar Network',
    amount: 45,
    currency: 'GREEN',
    timestamp: '১৪ অক্টোবর, ০৯:১০ AM',
    status: 'Completed',
    verifiedBy: 'IoT Smart Meter Oracle',
    zkpHash: '0x6a21...ff45'
  }
];

export const ALTERNATIVE_DATA_FACTORS = [
  {
    id: 'recharge',
    name: 'মোবাইল রিচার্জ ধারাবাহিকতা',
    enName: 'Mobile Recharge Frequency',
    score: 92,
    weight: '30%',
    detail: 'বিগত ১৮০ দিনে সপ্তাহে ৩+ বার গড়ে ৳১২০ রিচার্জ হয়েছে (Very High Reliability)',
    status: 'Excellent'
  },
  {
    id: 'utility',
    name: 'পল্লী বিদ্যুৎ ও ইউটিলিটি বিল',
    enName: 'Utility & Solar Bill Timeliness',
    score: 88,
    weight: '25%',
    detail: 'টানা ১২ মাস শূন্য বিল বকেয়া, সময়মতো ডিজিটাল পেমেন্ট সম্পন্ন',
    status: 'High'
  },
  {
    id: 'peer_velocity',
    name: 'লোকাল ট্রানজেকশন নেটওয়ার্ক',
    enName: 'Peer Transfer Velocity & Trust',
    score: 84,
    weight: '25%',
    detail: '৪০+ ইউনিক স্থানীয় ভেরিফাইড গ্রাহকের সাথে স্বাভাবিক লেনদেন লেনাদেনা',
    status: 'High'
  },
  {
    id: 'rwa_collateral',
    name: 'টোকেনাইজড গ্রামীণ সম্পদ (RWA)',
    enName: 'Tokenized Physical Asset Anchor',
    score: 79,
    weight: '20%',
    detail: 'স্মার্ট খামার ২ টি গাভী ও পোল্ট্রি শেড জিপিএস জিও-ট্যাগ ভেরিফাইড',
    status: 'Good'
  }
];

export const WEATHER_DISASTER_SCENARIOS = [
  {
    id: 'cyclone_bay',
    title: 'ঘূর্ণিঝড় "রেমাল" সংকেত ৮ (Cyclone Emergency)',
    region: 'উপকূলীয় অঞ্চল (কক্সবাজার, পটুয়াখালী, ভোলা)',
    division: 'Chittagong & Barisal',
    riskLevel: 'SEVERE',
    satelliteWindSpeed: '115 km/h',
    rainProbability: '95%',
    actions: [
      'স্বয়ংক্রিয়ভাবে পরবর্তী ২ কিস্তি লোন ফ্রিজ (০% অতিরিক্ত সুদ)',
      'তাৎক্ষণিক জরুরি শস্যবীমা ৳৮,৫০০ সরাসরি VoxPay ওয়ালেটে ছাড়',
      'জরুরি খাদ্য সহায়তা ফান্ড অ্যাক্টিভেশন'
    ]
  },
  {
    id: 'flood_haor',
    title: 'হাওর অঞ্চলে আকস্মিক বন্যা (Flash Flood Alert)',
    region: 'সুনামগঞ্জ, নেত্রকোনা ও কিশোরগঞ্জ হাওর অঞ্চল',
    division: 'Sylhet',
    riskLevel: 'HIGH',
    satelliteWindSpeed: '45 km/h',
    rainProbability: '98%',
    actions: [
      'মৎস্য ও ধান খামারিদের লোন কিস্তি ৯০ দিনের জন্য স্থগিত',
      'স্যাটেলাইট রাডার ভিত্তিতে ওয়ালেট প্রতি ৳৫,০০০ অনুদান রিলিজ',
      'অফলাইন BLE মেশ পেমেন্ট প্রটোকল সক্রিয়'
    ]
  },
  {
    id: 'normal',
    title: 'স্বাভাবিক আবহাওয়া (Normal Weather Conditions)',
    region: 'সারাদেশ (All Bangladesh Divisions)',
    division: 'Nationwide',
    riskLevel: 'NORMAL',
    satelliteWindSpeed: '12 km/h',
    rainProbability: '10%',
    actions: [
      'নিয়মিত কিস্তি সময়সূচী চলমান',
      'কৃষি ঋণ সুদমুক্ত স্পেশাল অফার সক্রিয়'
    ]
  }
];

export const SAMPLE_VOICE_COMMANDS = [
  {
    text: 'রহিমকে ৫০০ টাকা পাঠিয়ে দাও',
    dialect: 'standard-bangla',
    intent: 'SEND_MONEY',
    amount: 500,
    recipient: 'আব্দুল রহিম'
  },
  {
    text: 'অনরে পাঁচ হাজার টিয়া লোন চাই, দেন না',
    dialect: 'chittagong',
    intent: 'REQUEST_LOAN',
    amount: 5000,
    recipient: null
  },
  {
    text: 'আমার একাউন্ট থাকি কারেন্টের বিল দিলাইতাউ',
    dialect: 'sylhet',
    intent: 'PAY_UTILITY',
    amount: 850,
    recipient: 'পল্লী বিদ্যুৎ'
  },
  {
    text: 'Amar credit score check kore instant loan dao',
    dialect: 'banglish',
    intent: 'CREDIT_SCORE',
    amount: null,
    recipient: null
  },
  {
    text: 'Convert 100 e-CNY to Taka and send to wallet',
    dialect: 'english',
    intent: 'ECNY_REMITTANCE',
    amount: 100,
    recipient: 'Shenzhen Gateway'
  }
];
