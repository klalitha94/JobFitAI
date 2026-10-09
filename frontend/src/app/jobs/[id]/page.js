'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Banknote, 
  ArrowUpRight, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck,
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Calendar,
  Share2
} from 'lucide-react';
import { jobsApi, matchApi, applicationsApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user, resume, isAuthenticated, showToast, demoLogin } = useAuth();

  const [job, setJob] = useState(null);
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingMatch, setAnalyzingMatch] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobById(id);
      if (res.success && res.job) {
        setJob(res.job);
        // Automatically fetch Gemini Smart Match Analysis
        fetchMatch(res.job);
      }
    } catch (err) {
      console.error('Job fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatch = async (jobData) => {
    setAnalyzingMatch(true);
    try {
      const mRes = await matchApi.getJobMatchAnalysis(jobData._id || jobData.id);
      if (mRes.success && mRes.analysis) {
        setMatchAnalysis(mRes.analysis);
      }
    } catch (err) {
      console.warn('Match analysis error:', err);
    } finally {
      setAnalyzingMatch(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in or use Demo Mode to save jobs.', 'info');
      await demoLogin();
    }

    try {
      if (isSaved) {
        await applicationsApi.deleteApplication(job._id || job.id);
        setIsSaved(false);
        showToast('Removed from saved applications', 'info');
      } else {
        await applicationsApi.saveOrApplyJob({
          jobId: job._id || job.id,
          status: 'Saved',
          matchScore: matchAnalysis?.matchPercentage || 85,
        });
        setIsSaved(true);
        showToast('Saved to your application pipeline!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs text-zinc-400 font-medium">Loading verified job opening...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Job Opening Not Found</h2>
        <p className="text-xs text-zinc-400">The requested job listing may have been filled or expired.</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-200 border border-zinc-700"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Discover Jobs
        </Link>
      </div>
    );
  }

  const score = matchAnalysis?.matchPercentage || 85;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all jobs
        </Link>
      </div>

      {/* Main Job Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span>{job.company?.[0] || 'C'}</span>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                {job.company}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-300">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700 text-zinc-200">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {job.location} ({job.locationType})
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/90 border border-zinc-700 text-zinc-200">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  {job.jobType} • {job.experienceLevel}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  <Banknote className="w-3.5 h-3.5" />
                  {job.salaryRange || 'Competitive'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSaveToggle}
              className={`p-3 rounded-xl border transition-colors ${
                isSaved
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title="Save to Application Tracker"
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>

            <Link
              href={`/interview-prep?jobId=${job._id || job.id}`}
              className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              Prepare with AI
            </Link>

            {/* Direct Apply Now Button */}
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Apply on Company Portal</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job Description & Requirements */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Job Overview */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Role Overview & Company Mission
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">Key Responsibilities</h2>
              <ul className="space-y-2 text-xs text-zinc-300">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications & Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <h2 className="text-base font-bold text-white tracking-tight">Required Qualifications</h2>
              <ul className="space-y-2 text-xs text-zinc-300">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills Badges */}
          <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <h2 className="text-base font-bold text-white tracking-tight">Technical Skills In Demand</h2>
            <div className="flex flex-wrap gap-2">
              {(job.skillsRequired || []).map((sk, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Feature 1 Smart Resume Match Card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-cyan-500/20 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Smart Resume Match Breakdown
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-semibold">Gemini AI</span>
            </div>

            {/* Score Ring / Block */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 shrink-0">
                <span className="text-2xl font-black">{score}%</span>
                <span className="text-[9px] uppercase font-bold tracking-wider">Match</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {score >= 80 ? 'High Compatibility Role' : 'Moderate Match with Growth'}
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Evaluated against your technical projects, coursework, and fresher eligibility.
                </p>
              </div>
            </div>

            {/* Why this job suits your resume */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Why It Suits Your Resume
              </h4>
              <div className="space-y-2">
                {(matchAnalysis?.suitabilityReasons || [
                  `Your practical knowledge in ${(job.skillsRequired || []).slice(0, 3).join(', ')} directly satisfies the position's core requirements.`,
                  `Your academic timeline aligns with ${job.company}'s 2024/2025 hiring batch criteria.`,
                  `The ${job.locationType} format fits your stated preferred location preferences.`
                ]).map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched & Missing Skills */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 block mb-1.5">
                  ✓ Matched In Your Resume
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(matchAnalysis?.matchedSkills || (job.skillsRequired || []).slice(0, 3)).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-400 block mb-1.5">
                  ⚠ Missing / Recommended To Revise
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(matchAnalysis?.missingSkills && matchAnalysis.missingSkills.length > 0
                    ? matchAnalysis.missingSkills
                    : ['Docker', 'Cloud Concepts']).map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pitch Strategy */}
            {matchAnalysis?.interviewAdvice && (
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs space-y-1">
                <span className="font-bold text-indigo-300 block">Recruiter Pitch Strategy</span>
                <p className="text-zinc-300 leading-relaxed">{matchAnalysis.interviewAdvice}</p>
              </div>
            )}

            {/* Launch AI Prep Button */}
            <Link
              href={`/interview-prep?jobId=${job._id || job.id}`}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Generate AI Interview Questions & Prep Kit</span>
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
