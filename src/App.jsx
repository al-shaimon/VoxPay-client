import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import CreditScoringSection from './components/CreditScoringSection';
import WeatherProtectionSection from './components/WeatherProtectionSection';
import VoiceHeroBar from './components/VoiceHeroBar';
import TransactionHistory from './components/TransactionHistory';

import VoiceAssistantModal from './components/VoiceAssistantModal';
import ZkpVerificationModal from './components/ZkpVerificationModal';
import CrossBorderEcnModal from './components/CrossBorderEcnModal';
import FinancialCounselorChat from './components/FinancialCounselorChat';
import SoundboxDemoModal from './components/SoundboxDemoModal';
import SendMoneyModal from './components/SendMoneyModal';
import EmergencyReliefModal from './components/EmergencyReliefModal';
import MlSpecModal from './components/MlSpecModal';

import { INITIAL_WALLET, INITIAL_TRANSACTIONS } from './constants/data';
import { apiUrl } from './constants/api';
import { zkpEngine } from './services/zkpSimulator';
import { voiceEngine } from './services/voiceEngine';
import confetti from 'canvas-confetti';

export default function App() {
  const [wallet, setWallet] = useState(INITIAL_WALLET);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [selectedDialect, setSelectedDialect] = useState('standard-bangla');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'loan' | 'voice' | 'weather' | 'history'

  // Modals state
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [zkpModalOpen, setZkpModalOpen] = useState(false);
  const [cnyModalOpen, setCnyModalOpen] = useState(false);
  const [counselorModalOpen, setCounselorModalOpen] = useState(false);
  const [soundboxModalOpen, setSoundboxModalOpen] = useState(false);
  const [sendMoneyModalOpen, setSendMoneyModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [mlSpecModalOpen, setMlSpecModalOpen] = useState(false);

  // Fetch persisted wallet and transactions on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [walletRes, txRes] = await Promise.all([
          fetch(apiUrl('/api/wallet')),
          fetch(apiUrl('/api/transactions'))
        ]);
        if (walletRes.ok) {
          const wData = await walletRes.json();
          if (wData && wData.accountName) setWallet(wData);
        }
        if (txRes.ok) {
          const tData = await txRes.json();
          if (Array.isArray(tData) && tData.length > 0) setTransactions(tData);
        }
      } catch (err) {
        console.warn('Backend offline on initial load, using local demo state', err);
      }
    };
    fetchInitialData();
  }, []);

  // Helper to sync transactions to backend asynchronously
  const syncTransactionToBackend = async (tx) => {
    try {
      await fetch(apiUrl('/api/transactions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tx.type,
          title: tx.title,
          recipient: tx.recipient,
          amount: tx.amount,
          currency: tx.currency || '৳',
          status: tx.status || 'Completed',
          verifiedBy: tx.verifiedBy || 'Voice Biometric',
          zkpHash: tx.zkpHash
        })
      });
    } catch (e) {
      console.warn('Backend transaction sync failed (offline)', e);
    }
  };

  // Trigger Voice Command from Hero bar or chips
  const handleTriggerVoiceCommand = (text, dialect) => {
    setVoiceTranscript(text);
    if (dialect) setSelectedDialect(dialect);
    setVoiceModalOpen(true);
  };

  // Execute Action parsed by Voice Engine
  const handleExecuteVoiceAction = (parsed) => {
    if (!parsed) return;

    if (parsed.intent === 'SEND_MONEY') {
      const amount = parsed.amount || 500;
      setWallet(prev => ({
        ...prev,
        bdtBalance: Math.max(0, prev.bdtBalance - amount)
      }));

      const newTx = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'send_money',
        title: 'ভয়েস টাকা পাঠানো (Send)',
        recipient: parsed.recipient,
        amount: -amount,
        currency: '৳',
        timestamp: 'Just now',
        status: 'Completed',
        verifiedBy: 'Voice-Print Biometric (98.4%)',
        zkpHash: zkpEngine.generateTxAuditHash(parsed)
      };
      setTransactions(prev => [newTx, ...prev]);
      syncTransactionToBackend(newTx);
    } else if (parsed.intent === 'REQUEST_LOAN') {
      const loanAmt = parsed.amount || 5000;
      setWallet(prev => ({
        ...prev,
        bdtBalance: prev.bdtBalance + loanAmt,
        activeLoan: {
          hasLoan: true,
          amount: (prev.activeLoan?.amount || 0) + loanAmt,
          remainingInstallments: 3,
          monthlyEmi: Math.round((loanAmt * 1.02) / 3),
          isFrozenDueToDisaster: false,
          disasterFreezeReason: null
        }
      }));

      const newTx = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'loan_disbursement',
        title: 'তাৎক্ষণিক এআই লোন (Instant Loan)',
        recipient: 'VoxPay Autonomous Loan Vault',
        amount: loanAmt,
        currency: '৳',
        timestamp: 'Just now',
        status: 'Completed',
        verifiedBy: 'ZKP On-Chain Prover',
        zkpHash: zkpEngine.generateTxAuditHash(parsed)
      };
      setTransactions(prev => [newTx, ...prev]);
      syncTransactionToBackend(newTx);
    } else if (parsed.intent === 'PAY_UTILITY') {
      const amount = parsed.amount || 850;
      setWallet(prev => ({
        ...prev,
        bdtBalance: Math.max(0, prev.bdtBalance - amount)
      }));

      const newTx = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'utility',
        title: 'পল্লী বিদ্যুৎ বিল (Utility Bill)',
        recipient: 'পল্লী বিদ্যুৎ সমিতি (Palli Bidyut)',
        amount: -amount,
        currency: '৳',
        timestamp: 'Just now',
        status: 'Completed',
        verifiedBy: 'Voice Smart Contract',
        zkpHash: zkpEngine.generateTxAuditHash(parsed)
      };
      setTransactions(prev => [newTx, ...prev]);
      syncTransactionToBackend(newTx);
    } else if (parsed.intent === 'ECNY_REMITTANCE') {
      const cny = parsed.amount || 200;
      const bdt = Math.round(cny * 16.90);
      setWallet(prev => ({
        ...prev,
        bdtBalance: prev.bdtBalance + bdt,
        ecnyBalance: prev.ecnyBalance + cny
      }));

      const newTx = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'ecny_remit',
        title: 'Cross-Border e-CNY Remittance',
        recipient: 'Shenzhen Merchant Gateway',
        amount: bdt,
        currency: '৳',
        timestamp: 'Just now',
        status: 'Completed',
        verifiedBy: 'CBDC Cross-Border Bridge',
        zkpHash: zkpEngine.generateTxAuditHash(parsed)
      };
      setTransactions(prev => [newTx, ...prev]);
      syncTransactionToBackend(newTx);
    } else if (parsed.intent === 'EMERGENCY_RELIEF') {
      handleClaimEmergencyAid(5000);
    }
  };

  // Quick Action Click Router
  const handleActionClick = (actionId) => {
    switch (actionId) {
      case 'send_money':
        setSendMoneyModalOpen(true);
        break;
      case 'recharge':
        handleTriggerVoiceCommand('আমার নম্বরে ১২০ টাকা রিচার্জ করে দাও', selectedDialect);
        break;
      case 'ai_loan':
        setActiveTab('loan');
        break;
      case 'cash_out':
        setSoundboxModalOpen(true);
        break;
      case 'cross_border_ecny':
        setCnyModalOpen(true);
        break;
      case 'weather_protection':
        setActiveTab('weather');
        break;
      case 'zkp_verify':
        setZkpModalOpen(true);
        break;
      case 'emergency_relief':
        setEmergencyModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Send Money Success
  const handleSendSuccess = ({ recipient, amount }) => {
    setWallet(prev => ({
      ...prev,
      bdtBalance: Math.max(0, prev.bdtBalance - amount)
    }));

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'send_money',
      title: 'টাকা পাঠানো (Send Money)',
      recipient,
      amount: -amount,
      currency: '৳',
      timestamp: 'Just now',
      status: 'Completed',
      verifiedBy: 'Biometric Voice-Print (98.4%)',
      zkpHash: zkpEngine.generateTxAuditHash({ recipient, amount })
    };
    setTransactions(prev => [newTx, ...prev]);
    syncTransactionToBackend(newTx);
  };

  // Apply Loan from Credit Score Section
  const handleApplyLoan = async (amount, prediction) => {
    setWallet(prev => ({
      ...prev,
      bdtBalance: prev.bdtBalance + amount,
      activeLoan: {
        hasLoan: true,
        amount: (prev.activeLoan?.amount || 0) + amount,
        remainingInstallments: 3,
        monthlyEmi: Math.round((amount * 1.02) / 3),
        isFrozenDueToDisaster: false,
        disasterFreezeReason: null
      }
    }));

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    if (soundEnabled) {
      voiceEngine.playSoundboxChime();
      voiceEngine.speakText(`অভিনন্দন! আপনার একাউন্টে ${amount} টাকা লোন তাৎক্ষণিক যুক্ত হয়েছে।`, 'bn-BD', false);
    }

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'loan_disbursement',
      title: 'এআই লোন বিতরণ (AI Micro-Loan)',
      recipient: 'VoxPay Autonomous Loan Pool',
      amount,
      currency: '৳',
      timestamp: 'Just now',
      status: 'Completed',
      verifiedBy: 'ZKP On-Chain Prover',
      zkpHash: zkpEngine.generateTxAuditHash({ amount, prediction })
    };
    setTransactions(prev => [newTx, ...prev]);

    // Backend sync
    try {
      await fetch(apiUrl('/api/ml/apply-loan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, prediction })
      });
    } catch (err) {
      console.warn('Backend loan application sync offline', err);
    }
  };

  // Cross-Border Remittance Success
  const handleRemitSuccess = ({ cnyAmount, bdtAmount, recipient }) => {
    setWallet(prev => ({
      ...prev,
      bdtBalance: prev.bdtBalance + bdtAmount,
      ecnyBalance: prev.ecnyBalance + cnyAmount
    }));

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'ecny_remit',
      title: 'Cross-Border e-CNY Remittance',
      recipient,
      amount: bdtAmount,
      currency: '৳',
      timestamp: 'Just now',
      status: 'Completed',
      verifiedBy: 'Shenzhen-PBOC CBDC Node',
      zkpHash: zkpEngine.generateTxAuditHash({ cnyAmount, bdtAmount })
    };
    setTransactions(prev => [newTx, ...prev]);
    syncTransactionToBackend(newTx);
  };

  // Disaster Trigger: Freeze Loan & Disburse Crop Insurance
  const handleDisasterTrigger = async (scenario) => {
    if (scenario.riskLevel !== 'NORMAL') {
      setWallet(prev => ({
        ...prev,
        bdtBalance: prev.bdtBalance + 8500,
        activeLoan: {
          ...prev.activeLoan,
          isFrozenDueToDisaster: true,
          disasterFreezeReason: scenario.title
        }
      }));

      const newTx = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'crop_insurance',
        title: 'স্বয়ংক্রিয় শস্যবীমা (Crop Insurance)',
        recipient: 'VoxPay Satellite Weather Oracle',
        amount: 8500,
        currency: '৳',
        timestamp: 'Just now',
        status: 'Completed',
        verifiedBy: 'Sentinel-3 Satellite Trigger',
        zkpHash: zkpEngine.generateTxAuditHash({ scenario })
      };
      setTransactions(prev => [newTx, ...prev]);

      try {
        await fetch(apiUrl('/api/weather/trigger-disaster'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenario_id: scenario.id,
            title: scenario.title,
            risk_level: scenario.riskLevel,
            insurance_amount: 8500.0
          })
        });
      } catch (err) {
        console.warn('Backend weather trigger offline', err);
      }
    } else {
      setWallet(prev => ({
        ...prev,
        activeLoan: {
          ...prev.activeLoan,
          isFrozenDueToDisaster: false,
          disasterFreezeReason: null
        }
      }));

      try {
        await fetch(apiUrl('/api/weather/reset'), { method: 'POST' });
      } catch (err) {
        console.warn('Backend weather reset offline', err);
      }
    }
  };

  // Claim Emergency Aid
  const handleClaimEmergencyAid = (amount) => {
    setWallet(prev => ({
      ...prev,
      bdtBalance: prev.bdtBalance + amount
    }));

    const newTx = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'emergency_aid',
      title: 'জরুরি দুর্যোগ ত্রাণ অনুদান (Disaster Aid)',
      recipient: 'VoxPay Relief Fund Pool',
      amount,
      currency: '৳',
      timestamp: 'Just now',
      status: 'Completed',
      verifiedBy: 'GPS Geofencing Smart Contract',
      zkpHash: zkpEngine.generateTxAuditHash({ amount })
    };
    setTransactions(prev => [newTx, ...prev]);
    syncTransactionToBackend(newTx);
  };

  return (
    <div className="min-h-screen bg-grid text-slate-100 flex flex-col overflow-x-hidden relative" style={{ background: '#070b14' }}>
      
      {/* Ambient background glow orbs */}
      <div className="ambient-glow w-96 h-96 pointer-events-none" style={{ top: '-80px', left: '-80px', background: '#e2136e' }} />
      <div className="ambient-glow w-96 h-96 pointer-events-none" style={{ top: '40%', right: '-100px', background: '#7c3aed' }} />
      <div className="ambient-glow w-72 h-72 pointer-events-none" style={{ bottom: '10%', left: '30%', background: '#0ea5e9' }} />

      <Navbar
        wallet={wallet}
        selectedDialect={selectedDialect}
        setSelectedDialect={setSelectedDialect}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCounselor={() => setCounselorModalOpen(true)}
        onOpenMlSpec={() => setMlSpecModalOpen(true)}
      />

      {/* Main Full-Width Responsive Container */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeTab === 'overview' && (
          <HomeScreen
            wallet={wallet}
            transactions={transactions}
            onActionClick={handleActionClick}
            onTriggerVoice={handleTriggerVoiceCommand}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'loan' && (
          <CreditScoringSection
            wallet={wallet}
            onApplyLoan={handleApplyLoan}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'voice' && (
          <VoiceHeroBar
            selectedDialect={selectedDialect}
            setSelectedDialect={setSelectedDialect}
            onTriggerVoiceCommand={handleTriggerVoiceCommand}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherProtectionSection
            wallet={wallet}
            onDisasterTrigger={handleDisasterTrigger}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'history' && (
          <TransactionHistory
            transactions={transactions}
          />
        )}
      </main>

      {/* Bottom Navigation Bar (Visible only on Mobile screens) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onVoiceClick={() => setActiveTab('voice')}
      />

      {/* Footer (Laptop View) */}
      <footer className="hidden md:block relative z-10 py-5 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#334155', background: 'rgba(7,11,20,0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink" />
            <span className="font-bold" style={{ color: '#475569' }}>VoxPay AI</span>
            <span style={{ color: '#1e293b' }}>·</span>
            <span>Voice-First MFS · Bangladesh</span>
          </div>
          <span style={{ color: '#1e293b' }}>Shenzhen International FinTechathon 2026</span>
          <div className="font-mono" style={{ color: '#1e293b' }}>
            PQC · ZKP Groth16 · Groq AI · Web Speech
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        transcript={voiceTranscript}
        selectedDialect={selectedDialect}
        onExecuteAction={handleExecuteVoiceAction}
        soundEnabled={soundEnabled}
      />

      <ZkpVerificationModal
        isOpen={zkpModalOpen}
        onClose={() => setZkpModalOpen(false)}
        wallet={wallet}
        soundEnabled={soundEnabled}
      />

      <CrossBorderEcnModal
        isOpen={cnyModalOpen}
        onClose={() => setCnyModalOpen(false)}
        wallet={wallet}
        onRemitSuccess={handleRemitSuccess}
        soundEnabled={soundEnabled}
      />

      <FinancialCounselorChat
        isOpen={counselorModalOpen}
        onClose={() => setCounselorModalOpen(false)}
        selectedDialect={selectedDialect}
        soundEnabled={soundEnabled}
        wallet={wallet}
      />

      <SoundboxDemoModal
        isOpen={soundboxModalOpen}
        onClose={() => setSoundboxModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      <SendMoneyModal
        isOpen={sendMoneyModalOpen}
        onClose={() => setSendMoneyModalOpen(false)}
        wallet={wallet}
        onSendSuccess={handleSendSuccess}
        soundEnabled={soundEnabled}
      />

      <EmergencyReliefModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onClaimAid={handleClaimEmergencyAid}
        soundEnabled={soundEnabled}
      />

      <MlSpecModal
        isOpen={mlSpecModalOpen}
        onClose={() => setMlSpecModalOpen(false)}
      />

      <Analytics />
    </div>
  );
}
