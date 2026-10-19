// GenAI Financial Counselor Service — Powered by Groq AI
// Uses Groq's ultra-fast LLM inference for real-time financial guidance in Bangla

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Models available on user's Groq account, prioritized for best Bengali reasoning
const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
];

export const COUNSELOR_PRESETS = [
  {
    q: 'আমি কীভাবে প্রতিদিন ৫০ টাকা সঞ্চয় করতে পারি?',
    topic: 'সঞ্চয়',
    answer:
      'প্রতিদিন ৫০ টাকা VoxPay অটো-রাউন্ডআপ ফিচারে রাখলে মাসে ১,৫০০ টাকা এবং বছরে ১৮,০০০ টাকা জমবে! এটি সরাসরি ডিজিটাল গোল্ড বা সরকারি শর্ট-টার্ম বন্ডে ৪.৮% সুদে বৃদ্ধি পাবে।',
  },
  {
    q: 'আমার জন্য ১০,০০০ টাকা লোন নেওয়া কি নিরাপদ?',
    topic: 'মাইক্রো-লোন',
    answer:
      'আপনার বর্তমান এআই ক্রেডিট স্কোর ৭৮৫ (Platinum)। যদি মাসিক আয় ৮,০০০ টাকার উপরে হয়, তবে ৩ মাসের কিস্তিতে ৩,৪২০ টাকা করে সহজেই পরিশোধ করতে পারবেন। প্রথম ৩০ দিন কোনো সুদ নেই।',
  },
  {
    q: 'বন্যা বা ঝড়ের সময় কি ঋণের কিস্তি দিতে হবে?',
    topic: 'দুর্যোগ সুরক্ষা',
    answer:
      'না! VoxPay স্যাটেলাইট রাডার দিয়ে দুর্যোগ সংকেত জারি হলে স্বয়ংক্রিয়ভাবে আপনার ঋণের কিস্তি ৯০ দিনের জন্য স্থগিত থাকবে এবং কোনো জরিমানা বা লেট ফি কাটা হবে না।',
  },
  {
    q: 'সন্দেহজনক ফোন কল বা পিন চাইলে কী করব?',
    topic: 'নিরাপত্তা',
    answer:
      'VoxPay কখনো আপনার পিন বা ওটিপি জানতে চাইবে না! কোনো কল পেলে কখনো কোনো কোড বা তথ্য দেবেন না। VoxPay বায়োমেট্রিক ভয়েস গার্ড দিয়ে নিজেই আপনার আসল কণ্ঠ শনাক্ত করে।',
  },
  {
    q: 'চীন বা বিদেশ থেকে কীভাবে e-CNY টাকা গ্রহণ করব?',
    topic: 'রেমিট্যান্স',
    answer:
      'Shenzhen FinTechathon করিডোরের মাধ্যমে চীন থেকে প্রেরক ডিজিটাল ইউয়ান (e-CNY) পাঠালে মাত্র ৩ সেকেন্ডে সরাসরি আপনার VoxPay ওয়ালেটে বাংলাদেশি টাকায় কনভার্ট হয়ে জমা হবে।',
  },
  {
    q: 'আমার ক্রেডিট স্কোর কীভাবে ৮০০-র উপরে নেব?',
    topic: 'ক্রেডিট স্কোর',
    answer:
      'নিয়মিত বিদ্যুৎ বিল পরিশোধ, প্রতি সপ্তাহে ছোট অংকের মোবাইল রিচার্জ এবং পূর্বের লোন সময়মতো কিস্তি পরিশোধ করলে আপনার এআই অল্টারনেটিভ স্কোর দ্রুত বৃদ্ধি পাবে।',
  },
];

const buildSystemPrompt = (dialect = 'standard-bangla', wallet = null) => {
  const dialectGuidelines = {
    chittagong:
      'User dialect is Chittagonian (চাঁটগাঁইয়া). The user may speak using terms like আঁই, হঁন, টাহা, অনেরে, গম লাগের, ইতাদি. Understand their context fully and respond in warm, natural Bangla with respectful regional friendliness.',
    sylheti:
      'User dialect is Sylheti (সিলেটি). The user may speak using words like টেকা, আফনে, খরচা, কিলা আছেন. Understand their context and reply in clear, friendly Bengali.',
    banglish:
      'User may write in Banglish / Roman script (e.g. "kivabe save korbo", "loan pabo kina", "amar balance koto"). Understand Banglish effortlessly and reply in clean, friendly Bengali script.',
    'standard-bangla':
      'User prefers Standard Bengali (প্রমিত বাংলা). Use respectful phrasing (আপনি / প্রিয় গ্রাহক).',
  };

  const dialectNote = dialectGuidelines[dialect] || dialectGuidelines['standard-bangla'];

  const walletSnippet = wallet
    ? `
Current User Wallet Data:
- BDT Balance: ৳${wallet.bdtBalance?.toLocaleString('en-IN') || '12,450.00'}
- e-CNY Balance: ¥${wallet.ecnyBalance || '250'}
- Green Tokens: ${wallet.greenTokens ?? 0} GT
- AI Credit Score: 785 (Platinum / Low Default Risk)
- Pre-approved Micro-Loan Limit: Up to ৳25,000 (0% interest for first 30 days)
`
    : '';

  return `You are VoxAI (ভক্সএআই), the friendly and expert AI Financial Counselor for VoxPay — Bangladesh's Voice-First AI Mobile Financial Services platform.

🎯 YOUR PURPOSE:
Guide unbanked rural farmers, day laborers, small shopkeepers (মুদি দোকানি), women micro-entrepreneurs, and everyday mobile users in Bangladesh with practical, encouraging, and honest financial literacy.

🗣️ DIALECT GUIDELINE:
${dialectNote}

📚 VOXPAY FINTECH PLATFORM FEATURES (YOUR CORE KNOWLEDGE):
1. Voice-First MFS: Users can pay, recharge, and cash out using only their voice in their native dialect — zero PIN needed thanks to AI Voice-print biometric authentication.
2. AI Alternative Credit Scoring & Micro-Loans: Instant collateral-free micro-loans from ৳5,000 to ৳25,000. 0% interest for the first 30 days. Scoring is based on utility bills, mobile recharges, and transaction history.
3. Satellite Weather Protection (ওয়েদার শিল্ড): During flood, cyclone, river erosion, or severe weather alerts, loan installments automatically freeze for up to 90 days with 0 penalty.
4. Daily Micro-Savings: Auto-roundup on transactions puts spare change into inflation-proof micro-savings and gold (saving ৳50/day = ৳18,000+/year).
5. Cross-Border e-CNY Remittance: 3-second instant remittance between China and Bangladesh with zero hidden middleman fees.
6. Zero-Knowledge Proofs (ZKP): Mathematical proof of creditworthiness without revealing personal financial secrets.
7. Anti-Fraud & Cyber Security: VoxPay NEVER asks for PIN or OTP. Warn users against lottery scams and suspicious callers.

${walletSnippet}

📐 STRICT RESPONSE GUIDELINES:
- LENGTH: Exactly 2 to 4 sentences. Crisp, actionable, encouraging.
- LANGUAGE: Natural, warm Bengali (প্রমিত বাংলা).
- NO MARKDOWN FORMATTING: Do NOT use asterisks for bold (like **bold**) and do NOT use hashtags (#) because screen readers and speech synthesis read them out loud awkwardly.
- NUMERALS & CURRENCY: Use Bengali currency symbol ৳ and standard percentages (যেমন: ৳৫০০, ৳১০,০০০, ৫%).
- RESPECT: Address user warmly as আপনি.`;
};

class AICounselorService {
  constructor() {
    this.conversationHistory = [];
  }

  resetHistory() {
    this.conversationHistory = [];
  }

  async askCounselor(question, dialect = 'standard-bangla', wallet = null) {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: question });

    // Try calling Groq with candidate models
    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_api_key_here') {
      const systemPrompt = buildSystemPrompt(dialect, wallet);

      for (const model of GROQ_MODELS) {
        try {
          const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt },
                ...this.conversationHistory.slice(-6), // keep last 6 turns for conversational context
              ],
              max_tokens: 300,
              temperature: 0.6,
              stream: false,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            let reply = data?.choices?.[0]?.message?.content?.trim();
            if (reply) {
              // Clean any markdown formatting like ** or #
              reply = reply.replace(/\*\*/g, '').replace(/^#+\s+/gm, '').trim();
              this.conversationHistory.push({ role: 'assistant', content: reply });
              return reply;
            }
          } else {
            console.warn(`Groq model ${model} failed with status ${response.status}, trying next...`);
          }
        } catch (err) {
          console.warn(`Error invoking Groq model ${model}:`, err);
        }
      }
    }

    // High quality intelligent local fallback knowledge base
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQ = question.toLowerCase();
        let reply;

        if (
          lowerQ.includes('সঞ্চয়') ||
          lowerQ.includes('save') ||
          lowerQ.includes('জমানো') ||
          lowerQ.includes('টাকা রাখা')
        ) {
          reply =
            'প্রতিদিনের খুচরা খরচ থেকে ১০-৫০ টাকা VoxPay অটো-রাউন্ডআপ ফিচারে জমালে বছরে ১৮,০০০ টাকার বেশি সঞ্চয় হয়। কোনো ব্যাংক ভিজিট ছাড়াই আপনার এই ক্ষুদ্র সঞ্চয় সর্বোচ্চ সুরক্ষায় বৃদ্ধি পাবে।';
        } else if (
          lowerQ.includes('লোন') ||
          lowerQ.includes('loan') ||
          lowerQ.includes('ঋণ') ||
          lowerQ.includes('টাকা ধার')
        ) {
          reply =
            'আপনার বর্তমান এআই ক্রেডিট স্কোরের ভিত্তিতে আপনি সর্বোচ্চ ৳২৫,০০০ তাৎক্ষণিক মাইক্রো-লোন নিতে পারেন। প্রথম ৩০ দিন সম্পূর্ণ ০% সুদে লোন ব্যবহার করা যাবে এবং যথাসময়ে পরিশোধে লিমিট বৃদ্ধি পাবে।';
        } else if (
          lowerQ.includes('বন্যা') ||
          lowerQ.includes('ঝড়') ||
          lowerQ.includes('weather') ||
          lowerQ.includes('flood') ||
          lowerQ.includes('দুর্যোগ')
        ) {
          reply =
            'উপকূলীয় বা হাওর অঞ্চলে আবহাওয়া দুর্যোগ ও সংকেত জারি হলে VoxPay স্যাটেলাইট অটোমেশনের মাধ্যমে ঋণের কিস্তি ৯০ দিনের জন্য স্থগিত থাকবে। এ সময় কোনো বাড়তি ফি বা জরিমানা কাটা হবে না।';
        } else if (
          lowerQ.includes('নিরাপত্তা') ||
          lowerQ.includes('পিন') ||
          lowerQ.includes('fraud') ||
          lowerQ.includes('স্ক্যাম') ||
          lowerQ.includes('কল')
        ) {
          reply =
            'VoxPay কখনো কোনো পিন, পাসওয়ার্ড বা ওটিপি চায় না। কারো সাথে কোনো কোড শেয়ার করবেন না। VoxPay বায়োমেট্রিক ভয়েসপ্রিন্ট প্রযুক্তি দিয়ে জালিয়াতি শনাক্ত করে আপনার অ্যাকাউন্ট সুরক্ষিত রাখে।';
        } else if (
          lowerQ.includes('ecny') ||
          lowerQ.includes('yuan') ||
          lowerQ.includes('china') ||
          lowerQ.includes('রেমিট্যান্স') ||
          lowerQ.includes('remittance')
        ) {
          reply =
            'Shenzhen e-CNY করিডোরের মাধ্যমে চীন ও বাংলাদেশের মধ্যে মাত্র ৩ সেকেন্ডে সরাসরি ক্রস-বর্ডার রেমিট্যান্স লেনদেন সম্পন্ন হয়। মধ্যস্বত্বভোগী বা হুন্ডি ঝুঁকি ছাড়াই টাকা সরাসরি বিডিটি ওয়ালেটে যুক্ত হয়।';
        } else if (lowerQ.includes('স্কোর') || lowerQ.includes('score') || lowerQ.includes('credit')) {
          reply =
            'নিয়মিত পল্লী বিদ্যুৎ বিল পরিশোধ, ছোট অংকের মোবাইল রিচার্জ ও লেনদেনের মাধ্যমে আপনার এআই ক্রেডিট স্কোর বৃদ্ধি পায়। স্কোর ৭০০-র উপরে থাকলে কম খরচে বড় অংকের লোন সুবিধা মেলে।';
        } else {
          reply =
            'আপনার প্রশ্নের জন্য ধন্যবাদ! VoxPay AI পরামর্শক হিসেবে আপনার পাশে আছে। সঞ্চয়, লোন বা দুর্যোগ সুরক্ষায় কোনো সহায়তা প্রয়োজন হলে নিশ্চিন্তে যেকোনো প্রশ্ন করুন।';
        }

        this.conversationHistory.push({ role: 'assistant', content: reply });
        resolve(reply);
      }, 350);
    });
  }
}

export const aiCounselor = new AICounselorService();
