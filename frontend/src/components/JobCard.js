'use client';

import React, { useState } from 'react';
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
  Clock,
  Compass
} from 'lucide-react';
import { applicationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MatchModal from './MatchModal';

export default function JobCard({ job, onStatusChange }) {
  const { isAuthenticated, showToast } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const matchScore = job.estimatedMatchScore || job.matchScore || 85;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please sign in or use Demo Mode to save jobs.', 'info');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await applicationsApi.deleteApplication(job._id || job.id);
        setIsSaved(false);
        showToast(`Removed ${job.title} from saved jobs`, 'info');
      } else {
        await applicationsApi.saveOrApplyJob({
          jobId: job._id || job.id,
          status: 'Saved',
          matchScore,
        });
        setIsSaved(true);
        showToast(`Saved ${job.title} at ${job.company}`, 'success');
      }
      if (onStatusChange) onStatusChange();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 80) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (score >= 65) {
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  const isBengaluru = (job.city === 'Bengaluru' || (job.location && job.location.includes('Bengaluru')));
  const isRemote = (job.locationType === 'Remote' || (job.location && job.location.toLowerCase().includes('remote')));

  return (
    <>
      <div className="group relative rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 p-5 flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-cyan-950/20">
        
        {/* Top bar: Company & Badges */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/60 flex items-center justify-center text-base font-bold text-white shadow-inner">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span>{job.company?.[0] || 'C'}</span>
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase flex items-center gap-1.5">
                  {job.company}
                  {job.featured && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </span>
                <Link
                  href={`/jobs/${job._id || job.id}`}
                  className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mt-0.5 tracking-tight"
                >
                  {job.title}
                </Link>
              </div>
            </div>

            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-white hover:bg-zinc-800'
              }`}
              title={isSaved ? 'Saved to Pipeline' : 'Save Job'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Metrics (Location, Role, Salary) */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs text-zinc-300">
            {/* City pill with special glow for Bengaluru and Remote */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium border ${
              isBengaluru 
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/60'
                : isRemote
                ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
                : 'bg-zinc-800/70 text-zinc-300 border-zinc-700/60'
            }`}>
              <MapPin className="w-3 h-3 text-zinc-400" />
              {job.city || job.location}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/50 text-zinc-300">
              <Briefcase className="w-3 h-3 text-zinc-400" />
              {job.jobType}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/50 text-emerald-400 font-medium">
              <Banknote className="w-3 h-3 text-emerald-400" />
              {job.salaryRange || 'Competitive'}
            </span>
          </div>

          {/* Job Description Preview */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3.5">
            {job.description}
          </p>

          {/* Skill Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(job.skillsRequired || []).slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800/90 text-zinc-300 border border-zinc-700/50"
              >
                {skill}
              </span>
            ))}
            {(job.skillsRequired || []).length > 4 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800/40 text-zinc-500">
                +{(job.skillsRequired || []).length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions & Feature Triggers */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
          
          {/* Smart Match Trigger (Feature 1) */}
          <button
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105 ${getScoreBadge(matchScore)}`}
            title="Click to view Gemini AI Smart Match breakdown"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </button>

          <div className="flex items-center gap-2">
            {/* AI Interview Prep Trigger (Feature 3) */}
            <Link
              href={`/interview-prep?jobId=${job._id || job.id}`}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-cyan-300 border border-zinc-700/60 text-xs transition-colors"
              title="Generate Role Interview Questions & Prep Kit"
            >
              <BrainCircuit className="w-4 h-4" />
            </Link>

            {/* Direct Apply Now Button (opens real application portal in new tab) */}
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:shadow-cyan-500/30"
            >
              <span>Apply Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Feature 1 Smart Match Modal */}
      <MatchModal
        job={job}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
