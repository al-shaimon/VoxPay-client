// GenAI Financial Counselor Service
// Provides conversational guidance on micro-loans, savings, and financial safety in local dialect

export const COUNSELOR_PRESETS = [
  {
    q: 'আমি কীভাবে প্রতিদিন ৫০ টাকা সঞ্চয় করতে পারি?',
    topic: 'Micro-Savings',
    answer: 'প্রতিদিন ৫০ টাকা VoxPay অটো-রাউন্ডআপ ফিচারে রাখলে মাসে ১,৫০০ টাকা এবং বছরে ১৮,০০০ টাকা জমবে! এটি সরাসরি ডিজিটাল গোল্ড বা সরকারি শর্ট-টার্ম বন্ডে ৪.৮% সুদে বৃদ্ধি পাবে।'
  },
  {
    q: 'আমার জন্য ১০,০০০ টাকা লোন নেওয়া কি নিরাপদ?',
    topic: 'Loan Advice',
    answer: 'আপনার বর্তমান এআই ক্রেডিট স্কোর ৭৮৫ (Platinum)। যদি আপনার মাসিক নিয়মিত আয় ৮,০০০ টাকার উপরে হয়, তবে ৩ মাসের কিস্তিতে ৩,৪২০ টাকা করে সহজেই পরিশোধ করতে পারবেন। অতিরিক্ত ঋণ নেওয়া এড়িয়ে চলুন।'
  },
  {
    q: 'বন্যার সময় কি ঋণের কিস্তি দিতে হবে?',
    topic: 'Disaster Protection',
    answer: 'না! VoxPay-তে স্যাটেলাইট ওয়েদার রাডার সংযুক্ত। ঘূর্ণিঝড় বা বন্যার সংকেত জারি হলে স্বয়ংক্রিয়ভাবে আপনার ঋণের কিস্তি ৯০ দিনের জন্য স্থগিত থাকবে এবং কোনো অতিরিক্ত জরিমানা বা সুদ কাটা হবে না।'
  },
  {
    q: 'সন্দেহজনক ফোন কল বা পিন চাইলে কী করব?',
    topic: 'Security & Anti-Fraud',
    answer: 'VoxPay কখনো আপনার পিন বা ওটিপি জানতে চাইবে না! কোনো কল পেলে কখনই তথ্য দেবেন না। VoxPay বায়োমেট্রিক ভয়েস গার্ড দিয়ে নিজেই আপনার আসল কণ্ঠ শনাক্ত করে।'
  }
];

class AICounselorService {
  constructor() {
    this.customApiKey = null;
  }

  setApiKey(key) {
    this.customApiKey = key;
  }

  async askCounselor(question, dialect = 'standard-bangla') {
    // If user configured an external Gemini or LLM API key:
    if (this.customApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.customApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are VoxPay's empathetic Financial Counselor for rural and unbanked populations in Bangladesh. Answer in simple, friendly ${dialect} dialect. Question: ${question}`
              }]
            }]
          })
        });
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      } catch (err) {
        console.warn('Custom LLM API call failed, falling back to local fintech knowledge base', err);
      }
    }

    // Local Intelligent Financial Counselor Knowledge Engine:
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQ = question.toLowerCase();

        if (lowerQ.includes('সঞ্চয়') || lowerQ.includes('save') || lowerQ.includes('জমানো') || lowerQ.includes('saving')) {
          resolve('প্রতিদিনের খুচরা খরচ থেকে ১০-৫০ টাকা VoxPay অটো-সেভিংস ফান্ডে রাখলে বছরে ১৮,০০০+ টাকা সঞ্চয় হয়। কোনো ব্যাংক ভিজিট ছাড়াই আপনি জরুরি তহবিলের নিরাপত্তা পাবেন।');
        } else if (lowerQ.includes('লোন') || lowerQ.includes('loan') || lowerQ.includes('ধার') || lowerQ.includes('কিস্তি')) {
          resolve('আপনার বিকল্প এআই ক্রেডিট স্কোর অনুযায়ী আপনি সর্বোচ্চ ৳২৫,০০০ টাকা তাৎক্ষণিক মাইক্রো-লোন নিতে পারেন। প্রথম ৩০ দিন কোনো সুদ নেই। যেকোনো প্রাকৃতিক দুর্যোগে কিস্তি স্থগিত থাকবে।');
        } else if (lowerQ.includes('বন্যা') || lowerQ.includes('ঝড়') || lowerQ.includes('weather') || lowerQ.includes('flood') || lowerQ.includes('disaster')) {
          resolve('উপকূলীয় বা হাওর অঞ্চলে আবহাওয়া দুর্যোগ দেখা দিলে VoxPay স্বয়ংক্রিয়ভাবে স্যাটেলাইট ডেটা বিশ্লেষণ করে কিস্তি ফ্রিজ করবে এবং শস্যবীমা বাবদ সহায়তা রিলিজ করবে।');
        } else if (lowerQ.includes('নিরাপত্তা') || lowerQ.includes('পিন') || lowerQ.includes('fraud') || lowerQ.includes('স্ক্যাম')) {
          resolve('সতর্ক থাকুন: VoxPay-তে কোনো পাসওয়ার্ড বা পিন শেয়ার করতে হয় না। আমাদের বায়োমেট্রিক ভয়েস গার্ড ও ডিপফেক লাইভনেস ডিটেক্টর জালিয়াতি থেকে ১০০% সুরক্ষা নিশ্চিত করে।');
        } else if (lowerQ.includes('shenzhen') || lowerQ.includes('yuan') || lowerQ.includes('china') || lowerQ.includes('cny')) {
          resolve('Shenzhen e-CNY করিডোরের মাধ্যমে চীন ও বাংলাদেশের মধ্যে মাত্র ৩ সেকেন্ডে সরাসরি ক্রস-বর্ডার রেমিট্যান্স লেনদেন সম্পন্ন হয়, কোনো মধ্যস্বত্বভোগী ফি ছাড়াই।');
        } else {
          resolve(`আপনার প্রশ্নের জন্য ধন্যবাদ। VoxPay এআই কাউন্সিলর হিসেবে আমার পরামর্শ: আপনার নিয়মিত আয় অনুসারে বাজেট পরিকল্পনা করুন এবং প্রয়োজনে ভয়েস কমান্ড দিয়ে যেকোনো সময় লোন বা সেভিংস হিসাব জেনে নিন।`);
        }
      }, 500);
    });
  }
}

export const aiCounselor = new AICounselorService();
