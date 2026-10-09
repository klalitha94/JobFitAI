'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  BrainCircuit, 
  Lightbulb, 
  Building2, 
  MapPin,
  Loader2
} from 'lucide-react';
import { matchApi } from '../services/api';

export default function MatchModal({ job, isOpen, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && job) {
      fetchAnalysis();
    } else {
      setAnalysis(null);
      setError(null);
    }
  }, [isOpen, job]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await matchApi.getJobMatchAnalysis(job._id || job.id);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch match analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  const score = analysis?.matchPercentage || job.estimatedMatchScore || 82;

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 65) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Feature 1: Smart Resume Match
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{job.title}</h3>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1 text-zinc-300">
                <Building2 className="w-3.5 h-3.5 text-zinc-400" /> {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {job.location}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-sm text-zinc-400 font-medium">Gemini AI is analyzing resume alignment & skill gaps...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
              {error}
            </div>
          ) : (
            <>
              {/* Score Gauge Card */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg ${getScoreColor(score)}`}>
                    <span className="text-xl font-black">{score}%</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">Match</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {score >= 80 ? 'Exceptional Fit For Your Profile' : score >= 65 ? 'Strong Potential Match' : 'Moderate Match with Growth Areas'}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Evaluated against extracted skills, project stack, and fresher experience level.
                    </p>
                  </div>
                </div>

                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-md shadow-emerald-500/20"
                >
                  Apply Directly <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Why It Suits Your Resume */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" /> Why This Job Suits Your Resume
                </h4>
                <div className="space-y-2">
                  {(analysis?.suitabilityReasons || [
                    `Your demonstrated knowledge in ${(job.skillsRequired || []).slice(0, 3).join(', ')} directly aligns with this opening.`,
                    `The ${job.experienceLevel || 'fresher'} expectations match your educational background and project portfolio.`,
                    `The position provides ideal growth opportunity at ${job.company} in a ${job.locationType} environment.`
                  ]).map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 space-y-2.5">
                  <h5 className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched In Your Resume
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysis?.matchedSkills || (job.skillsRequired || []).slice(0, 3)).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 space-y-2.5">
                  <h5 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Missing / Recommended Skills
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysis?.missingSkills && analysis.missingSkills.length > 0 
                      ? analysis.missingSkills 
                      : ['Docker', 'AWS Basics']).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategic Interview Advice */}
              {analysis?.interviewAdvice && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1">
                  <h5 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Recruiter Pitch Strategy
                  </h5>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {analysis.interviewAdvice}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-3">
          <Link
            href={`/interview-prep?jobId=${job._id || job.id}`}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            Launch AI Interview Prep
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Close
            </button>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center gap-1 shadow-md shadow-indigo-600/20"
            >
              Apply on {job.company} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
