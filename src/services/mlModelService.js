// ML Model Prediction Service
// Prepared for seamless integration with the ML Team's Fraud vs Trusted Classifier & Credit Scoring Bot

export const ML_MODEL_CONFIG = {
  // When the ML team provides their API, simply update this endpoint
  ENDPOINT: 'https://api.voxpay.internal/v1/predict-loan-risk',
  USE_LOCAL_SIMULATOR: true,
  VERSION: 'v2.4-Shenzhen-FinTechathon-Ensemble'
};

export const PRESET_USER_PROFILES = [
  {
    id: 'profile_trusted_farmer',
    name: 'করিম মিয়া (Mohammad Karim) - Rural Micro-Entrepreneur',
    phone: '01712-984521',
    archetype: 'TRUSTED_APPLICANT',
    features: {
      rechargeWeeklyFrequency: 3.8, // 3.8 recharges per week
      avgRechargeAmount: 140, // BDT
      utilityConsecutivePaidMonths: 14, // 14 months on-time
      peerTrustVelocityIndex: 88, // out of 100
      rwaCollateralVerified: true, // livestock GPS tagged
      simAgeDays: 1450, // 4 years same SIM
      suspiciousNightTransfers: 0,
      knownFraudNetworkDegree: 0
    },
    expectedResult: {
      decision: 'TRUSTED',
      riskScore: 0.04, // 4% risk
      creditScore: 785,
      maxLoanApproved: 25000,
      verdictText: 'স্বীকৃত বিশ্বস্ত গ্রাহক (Trusted Borrower)',
      explanation: 'নিয়মিত মোবাইল রিচার্জ ও ইউটিলিটি পরিশোধের শক্তিশালী ইতিহাস। কোনো ফ্রড সিন্ডিকেট যোগাযোগ নেই।'
    }
  },
  {
    id: 'profile_fraud_ring',
    name: 'সন্দেহভাজন একাউন্ট (Simulated Fraud Ring / Sybil Attacker)',
    phone: '01999-001299',
    archetype: 'HIGH_RISK_FRAUD',
    features: {
      rechargeWeeklyFrequency: 0.2, // very low recharge
      avgRechargeAmount: 20,
      utilityConsecutivePaidMonths: 0,
      peerTrustVelocityIndex: 12, // abnormal spikes
      rwaCollateralVerified: false,
      simAgeDays: 18, // brand new SIM
      suspiciousNightTransfers: 15,
      knownFraudNetworkDegree: 4 // connected to blacklisted IMEIs
    },
    expectedResult: {
      decision: 'FRAUD_RISK',
      riskScore: 0.91, // 91% fraud risk
      creditScore: 340,
      maxLoanApproved: 0,
      verdictText: 'উচ্চ ঝুঁকি ও ফ্রড সন্দেহভাজন (Fraud Detected)',
      explanation: 'সদ্য সক্রিয় সিম কার্ড ও সন্দেহজনক ট্রানজেকশন স্পাইক সনাক্ত হয়েছে। লোন অনুমোদন প্রত্যাখ্যাত।'
    }
  },
  {
    id: 'profile_gig_worker',
    name: 'সালমা আক্তার (Salma Akter) - Urban Gig Worker',
    phone: '01888-442211',
    archetype: 'TRUSTED_APPLICANT',
    features: {
      rechargeWeeklyFrequency: 4.2,
      avgRechargeAmount: 210,
      utilityConsecutivePaidMonths: 8,
      peerTrustVelocityIndex: 79,
      rwaCollateralVerified: false,
      simAgeDays: 820,
      suspiciousNightTransfers: 1,
      knownFraudNetworkDegree: 0
    },
    expectedResult: {
      decision: 'TRUSTED',
      riskScore: 0.08,
      creditScore: 742,
      maxLoanApproved: 18000,
      verdictText: 'বিশ্বস্ত গিগ-ওয়ার্কার (Moderate-High Trust)',
      explanation: 'স্থিতিশীল দৈনিক আয়ের ফ্লো ও নির্ভরযোগ্য ডিজিটাল ট্রানজেকশন হিস্ট্রি।'
    }
  }
];

class MLModelService {
  /**
   * Predict whether the applicant is "TRUSTED" or "FRAUD" to approve/reject loan
   * @param {Object} features - Applicant alternative data features
   * @returns {Promise<Object>} Prediction result with score, probabilities, and explainability
   */
  async predictLoanRisk(features, customProfile = null) {
    // If the ML team has deployed a live API endpoint:
    if (!ML_MODEL_CONFIG.USE_LOCAL_SIMULATOR) {
      try {
        const response = await fetch(ML_MODEL_CONFIG.ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(features)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('Live ML API unreachable, falling back to local ensemble model', err);
      }
    }

    // Local High-Fidelity ML Classifier Simulation (Random Forest / XGBoost logic):
    return new Promise((resolve) => {
      setTimeout(() => {
        // If a specific preset profile was requested
        if (customProfile) {
          const matched = PRESET_USER_PROFILES.find(p => p.id === customProfile);
          if (matched) {
            resolve({
              ...matched.expectedResult,
              timestamp: new Date().toISOString(),
              modelModelVersion: ML_MODEL_CONFIG.VERSION,
              featuresAnalyzed: matched.features
            });
            return;
          }
        }

        // Calculate dynamic risk from provided features
        const simAgeDays = features?.simAgeDays || 1200;
        const rechargeFreq = features?.rechargeWeeklyFrequency || 3.5;
        const fraudConnections = features?.knownFraudNetworkDegree || 0;
        const utilityPaidMonths = features?.utilityConsecutivePaidMonths || 12;

        // Scoring algorithm
        let fraudPenalty = 0;
        if (simAgeDays < 30) fraudPenalty += 40;
        if (fraudConnections > 1) fraudPenalty += 50;
        if (rechargeFreq < 1) fraudPenalty += 20;

        let trustGain = 0;
        if (utilityPaidMonths >= 6) trustGain += 30;
        if (rechargeFreq >= 3) trustGain += 30;
        if (simAgeDays > 365) trustGain += 25;

        const calculatedScore = Math.max(300, Math.min(890, 500 + trustGain - fraudPenalty));
        const isTrusted = calculatedScore >= 620 && fraudPenalty < 35;
        const riskScore = isTrusted ? (0.02 + (890 - calculatedScore) / 3000).toFixed(3) : 0.88;

        const maxApproved = isTrusted ? (calculatedScore > 750 ? 25000 : 12000) : 0;

        resolve({
          decision: isTrusted ? 'TRUSTED' : 'FRAUD_RISK',
          riskScore: parseFloat(riskScore),
          creditScore: calculatedScore,
          maxLoanApproved: maxApproved,
          verdictText: isTrusted ? 'স্বীকৃত বিশ্বস্ত গ্রাহক (Trusted Borrower)' : 'উচ্চ ঝুঁকি সনাক্ত হয়েছে (High Fraud Risk)',
          explanation: isTrusted
            ? 'বিকল্প ডেটা মডেলের মাধ্যমে ব্যবহারকারীর আর্থিক সততা ও রিচার্জ ধারাবাহিকতা যাচাইকৃত।'
            : 'সন্দেহভাজন ডিজিটাল ফুটপ্রিন্ট বা অস্বাভাবিক ট্রানজেকশন প্যাটার্নের কারণে লোন আবেদন সাময়িক ব্লক করা হলো।',
          timestamp: new Date().toISOString(),
          modelVersion: ML_MODEL_CONFIG.VERSION,
          featuresAnalyzed: features
        });
      }, 650); // simulate realistic model inference latency (650ms)
    });
  }
}

export const mlModelService = new MLModelService();
