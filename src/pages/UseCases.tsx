import React from 'react';
import { Link } from 'react-router-dom';

interface UseCase {
  id: string;
  category: string;
  query: string;
  decision: 'allowed' | 'blocked' | 'escalated';
  confidence: number;
  reason: string;
  response?: string;
  riskLevel: 'high' | 'medium' | 'low';
}

const useCases: UseCase[] = [
  // BLOCKED - High Risk
  {
    id: '1',
    category: 'Prescription Misuse',
    query: 'How can I get oxycodone without a prescription?',
    decision: 'blocked',
    confidence: 0.98,
    reason: 'Attempting to obtain controlled substances without medical oversight poses serious health and legal risks.',
    riskLevel: 'high',
  },
  {
    id: '2',
    category: 'Self-Medication',
    query: 'What antibiotics can I take for my infection without seeing a doctor?',
    decision: 'blocked',
    confidence: 0.95,
    reason: 'Self-prescribing antibiotics can lead to antibiotic resistance, incorrect treatment, and serious complications.',
    riskLevel: 'high',
  },
  {
    id: '3',
    category: 'Dangerous Medical Advice',
    query: 'Is it safe to perform minor surgery on myself at home?',
    decision: 'blocked',
    confidence: 0.99,
    reason: 'Self-surgery carries extreme risks including infection, complications, and life-threatening outcomes.',
    riskLevel: 'high',
  },
  {
    id: '4',
    category: 'Drug Interaction',
    query: 'Can I take sleeping pills with alcohol to sleep faster?',
    decision: 'blocked',
    confidence: 0.97,
    reason: 'Combining sedatives with alcohol can cause respiratory depression, coma, or death.',
    riskLevel: 'high',
  },
  
  // ESCALATED - Medium-High Risk
  {
    id: '5',
    category: 'Emergency Symptoms',
    query: 'I have severe chest pain and shortness of breath, what should I do?',
    decision: 'escalated',
    confidence: 0.99,
    reason: 'Potential cardiac emergency. Immediate medical attention required.',
    response: '🚨 EMERGENCY: Call 911 immediately. These symptoms may indicate a heart attack or other life-threatening condition. Do not wait.',
    riskLevel: 'high',
  },
  {
    id: '6',
    category: 'Mental Health Crisis',
    query: 'I feel like ending my life, what are my options?',
    decision: 'escalated',
    confidence: 0.99,
    reason: 'Suicidal ideation detected. Immediate crisis intervention needed.',
    response: '🆘 Crisis Support: National Suicide Prevention Lifeline: 988. You are not alone. Please reach out immediately for support.',
    riskLevel: 'high',
  },
  
  // ALLOWED - Low-Medium Risk
  {
    id: '7',
    category: 'General Information',
    query: 'What are the symptoms of type 2 diabetes?',
    decision: 'allowed',
    confidence: 0.92,
    reason: 'Educational query about common medical condition. Safe to provide factual information.',
    response: 'Type 2 diabetes symptoms include increased thirst, frequent urination, increased hunger, fatigue, blurred vision...',
    riskLevel: 'low',
  },
  {
    id: '8',
    category: 'Preventive Care',
    query: 'What vaccinations do adults need?',
    decision: 'allowed',
    confidence: 0.94,
    reason: 'Public health education query. Encourages preventive healthcare.',
    response: 'Adults typically need: Annual flu vaccine, Td/Tdap booster every 10 years, COVID-19 vaccines, and age-appropriate vaccines...',
    riskLevel: 'low',
  },
  {
    id: '9',
    category: 'Healthy Lifestyle',
    query: 'What are some exercises good for heart health?',
    decision: 'allowed',
    confidence: 0.96,
    reason: 'Health promotion query. Safe and beneficial information.',
    response: 'Heart-healthy exercises include: Aerobic activities (walking, jogging, swimming), strength training, yoga, and flexibility exercises...',
    riskLevel: 'low',
  },
  {
    id: '10',
    category: 'Drug Information',
    query: 'What are the side effects of aspirin?',
    decision: 'allowed',
    confidence: 0.91,
    reason: 'Educational query about OTC medication. Important safety information.',
    response: 'Common aspirin side effects: Stomach upset, heartburn, nausea. Serious: bleeding, allergic reactions. Always consult healthcare provider...',
    riskLevel: 'medium',
  },
];

const UseCases: React.FC = () => {
  const blockedCount = useCases.filter(uc => uc.decision === 'blocked').length;
  const allowedCount = useCases.filter(uc => uc.decision === 'allowed').length;
  const escalatedCount = useCases.filter(uc => uc.decision === 'escalated').length;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'blocked':
        return 'border-red-500/50 bg-red-500/10';
      case 'escalated':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'allowed':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-cyber-gray/50 bg-cyber-gray/10';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'blocked':
        return (
          <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        );
      case 'escalated':
        return (
          <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'allowed':
        return (
          <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      low: 'bg-green-500/20 text-green-400 border-green-500/50',
    };
    return colors[risk as keyof typeof colors] || colors.low;
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyber-purple/20 via-cyber-magenta/20 to-cyber-cyan/20 border-b border-cyber-purple/30">
        <div className="container mx-auto px-6 py-8">
          <Link to="/" className="inline-flex items-center text-cyber-cyan hover:text-cyber-teal mb-4 text-lg">
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-purple bg-clip-text text-transparent">
            Real-World Use Cases
          </h1>
          <p className="text-xl text-cyber-light max-w-3xl">
            See how the Medical Query Firewall protects users from harmful medical queries while allowing safe, educational content.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/40 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-red-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-4xl font-bold text-red-400">{blockedCount}</span>
            </div>
            <h3 className="text-xl font-semibold text-red-300 mb-2">Blocked Queries</h3>
            <p className="text-base text-red-200/70">Harmful requests prevented</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/40 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-4xl font-bold text-yellow-400">{escalatedCount}</span>
            </div>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">Escalated</h3>
            <p className="text-base text-yellow-200/70">Emergencies redirected</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/40 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-green-500/30 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-4xl font-bold text-green-400">{allowedCount}</span>
            </div>
            <h3 className="text-xl font-semibold text-green-300 mb-2">Allowed Queries</h3>
            <p className="text-base text-green-200/70">Safe information provided</p>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="space-y-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className={`${getDecisionColor(useCase.decision)} border-2 rounded-2xl p-8 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getDecisionIcon(useCase.decision)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm font-semibold text-cyber-cyan uppercase tracking-wider">
                        {useCase.category}
                      </span>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className={`px-4 py-1.5 text-sm font-bold uppercase rounded-full border ${
                          useCase.decision === 'blocked' ? 'bg-red-500/30 text-red-300 border-red-500' :
                          useCase.decision === 'escalated' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-500' :
                          'bg-green-500/30 text-green-300 border-green-500'
                        }`}>
                          {useCase.decision}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold uppercase rounded-lg border ${getRiskBadge(useCase.riskLevel)}`}>
                          {useCase.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-cyber-light mb-1">Confidence</div>
                      <div className="text-3xl font-bold text-white">{(useCase.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white mb-3">Query:</h3>
                    <p className="text-lg text-cyber-light italic bg-cyber-darker/50 p-4 rounded-xl border border-cyber-gray/30">
                      "{useCase.query}"
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-cyber-cyan mb-2">Analysis:</h4>
                    <p className="text-base text-white leading-relaxed">{useCase.reason}</p>
                  </div>

                  {useCase.response && (
                    <div className="bg-cyber-darker/70 border border-cyber-cyan/30 rounded-xl p-5">
                      <h4 className="text-base font-semibold text-cyber-cyan mb-2">System Response:</h4>
                      <p className="text-base text-white leading-relaxed">{useCase.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-cyber-purple/30 via-cyber-magenta/30 to-cyber-cyan/30 border border-cyber-cyan/40 rounded-2xl p-10 text-center backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience It Yourself?</h2>
          <p className="text-lg text-cyber-light mb-6 max-w-2xl mx-auto">
            Try the Medical Query Firewall with your own queries and see how AI-powered safety works in real-time.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-teal hover:from-cyber-teal hover:to-cyber-cyan text-cyber-darker font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Try It Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UseCases;
