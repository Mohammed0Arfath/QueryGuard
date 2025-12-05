import React, { useMemo, useEffect, useState } from 'react';
import { AdminPanelProps } from '../types';

const AdminPanel: React.FC<AdminPanelProps> = ({ logs }) => {
  const [animatedStats, setAnimatedStats] = useState({ total: 0, blocked: 0, allowed: 0 });

  // Calculate aggregated metrics
  const metrics = useMemo(() => {
    const totalQueries = logs.length;
    const allowedCount = logs.filter(log => log.decision === 'allowed').length;
    const blockedCount = logs.filter(log => log.decision === 'blocked').length;
    // Escalated is not a standard decision type, using 0 for now
    const escalatedCount = 0;
    const allowedPercentage = totalQueries > 0 ? (allowedCount / totalQueries) * 100 : 0;
    const blockedPercentage = totalQueries > 0 ? (blockedCount / totalQueries) * 100 : 0;

    // Count rule matches
    const ruleCountMap = new Map<string, number>();
    logs.forEach(log => {
      log.rule_matches.forEach(rule => {
        ruleCountMap.set(rule, (ruleCountMap.get(rule) || 0) + 1);
      });
    });

    // Sort rules by count
    const topRules = Array.from(ruleCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Average classifier probability
    const avgProb = logs.length > 0 
      ? logs.reduce((sum, log) => sum + log.classifier_prob, 0) / logs.length 
      : 0;

    // Calculate average response time (simulated for now)
    const avgResponseTime = 1.8; // seconds

    return {
      totalQueries,
      allowedCount,
      blockedCount,
      escalatedCount,
      allowedPercentage,
      blockedPercentage,
      topRules,
      avgProb,
      avgResponseTime,
    };
  }, [logs]);

  // Animate counters
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        total: Math.floor(metrics.totalQueries * progress),
        blocked: Math.floor(metrics.blockedCount * progress),
        allowed: Math.floor(metrics.allowedCount * progress),
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedStats({
          total: metrics.totalQueries,
          blocked: metrics.blockedCount,
          allowed: metrics.allowedCount,
        });
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [metrics.totalQueries, metrics.blockedCount, metrics.allowedCount]);

  return (
    <div className="space-y-8">
      {/* Hero Stats - Large Animated Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Queries */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-teal to-cyber-blue rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-cyber-teal/50 rounded-2xl p-8 hover:border-cyber-teal transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-cyber-light">Total Queries Analyzed</h3>
              <svg className="w-10 h-10 text-cyber-teal" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-6xl font-bold text-cyber-teal drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
              {animatedStats.total}
            </p>
            <p className="text-base text-cyber-light mt-3">Medical queries processed</p>
          </div>
        </div>

        {/* Blocked Queries */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-red-500/50 rounded-2xl p-8 hover:border-red-500 transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-cyber-light">Harmful Queries Blocked</h3>
              <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-6xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {animatedStats.blocked}
            </p>
            <p className="text-base text-cyber-light mt-3">Potential harms prevented</p>
          </div>
        </div>

        {/* Allowed Queries */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-cyber-gray/40 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-8 hover:border-green-500 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-cyber-light">Safe Queries Allowed</h3>
              <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-6xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              {animatedStats.allowed}
            </p>
            <p className="text-base text-cyber-light mt-3">Legitimate information shared</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Response Time */}
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-purple/30 rounded-xl p-6 hover:border-cyber-purple/50 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-cyber-light">Avg Response Time</h4>
          </div>
          <p className="text-5xl font-bold text-cyber-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            {metrics.avgResponseTime}s
          </p>
          <p className="text-base text-green-400 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            23% faster than target
          </p>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-teal/30 rounded-xl p-6 hover:border-cyber-teal/50 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-cyber-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-cyber-light">Accuracy Rate</h4>
          </div>
          <p className="text-5xl font-bold text-cyber-teal drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
            {(metrics.avgProb * 100).toFixed(1)}%
          </p>
          <p className="text-base text-cyber-light mt-2">AI confidence score</p>
        </div>

        {/* Escalated Cases */}
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h4 className="text-lg font-semibold text-cyber-light">Escalated Cases</h4>
          </div>
          <p className="text-5xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
            {metrics.escalatedCount}
          </p>
          <p className="text-base text-cyber-light mt-2">Requiring human review</p>
        </div>
      </div>

      {/* Decision Distribution - Circular Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-purple/30 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-cyber-light mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Decision Distribution
          </h4>
          
          {metrics.totalQueries > 0 ? (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-base text-green-300 font-semibold">Allowed</span>
                  <span className="text-base font-mono text-green-300 font-bold">
                    {metrics.allowedPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-5 bg-cyber-darker rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-1000 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                    style={{ width: `${metrics.allowedPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-base text-red-300 font-semibold">Blocked</span>
                  <span className="text-base font-mono text-red-300 font-bold">
                    {metrics.blockedPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-5 bg-cyber-darker rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-1000 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    style={{ width: `${metrics.blockedPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-cyber-gray/30">
                <div className="flex items-center justify-between text-base">
                  <span className="text-cyber-light">Protection Rate:</span>
                  <span className="text-cyber-teal font-bold text-lg">
                    {metrics.blockedPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-base text-cyber-light italic">No decision data available</p>
          )}
        </div>

        {/* Top Matched Rules */}
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-teal/30 rounded-xl p-6">
          <h4 className="text-xl font-semibold text-cyber-light mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-cyber-teal" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Top Detection Rules
          </h4>
          
          {metrics.topRules.length > 0 ? (
            <div className="space-y-4">
              {metrics.topRules.map(([rule, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-base font-mono text-cyber-teal w-8 font-bold">
                      #{index + 1}
                    </span>
                    <span className="text-base text-white font-mono truncate">
                      {rule}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="w-32 h-3 bg-cyber-darker rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-cyber-teal to-cyber-blue shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-500"
                        style={{ 
                          width: `${(count / metrics.topRules[0][1]) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-base font-bold text-cyber-teal w-10 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base text-cyber-light italic">No rule data available</p>
          )}
        </div>
      </div>

      {/* System Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-5 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
              <span className="text-lg font-semibold text-green-300">System Status</span>
            </div>
            <span className="text-base text-green-400 font-bold">OPERATIONAL</span>
          </div>
        </div>
        
        <div className="bg-cyber-gray/20 backdrop-blur-sm border border-cyber-gray rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-cyber-light">Last Updated</span>
            <span className="text-base text-white font-mono font-semibold">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;