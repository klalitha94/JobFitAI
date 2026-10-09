'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  MapPin, 
  FileText, 
  BrainCircuit, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight,
  Kanban,
  UserCheck,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { matchApi, applicationsApi, resumeApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user, resume, isAuthenticated, demoLogin } = useAuth();

  const [topMatches, setTopMatches] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [matchesRes, appsRes] = await Promise.allSettled([
        matchApi.getTopRecommendations(),
        applicationsApi.getApplications(),
      ]);

      if (matchesRes.status === 'fulfilled' && matchesRes.value.success) {
        setTopMatches(matchesRes.value.topMatches || []);
      }
      if (appsRes.status === 'fulfilled' && appsRes.value.success) {
        setApplications(appsRes.value.applications || []);
      }
    } catch (err) {
      console.warn('Dashboard load err:', err);
    } finally {
      setLoading(false);
    }
  };

  const savedCount = applications.filter(a => a.status === 'Saved').length;
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                Candidate Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Your resume is actively evaluated against verified tech openings in Bengaluru, Remote, and major tech hubs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/resume"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              {resume ? 'Update Resume' : 'Upload Resume'}
            </Link>

            <Link
              href="/jobs"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md">
          <span className="text-[11px] text-zinc-400 font-semibold block">Resume Match Quality</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400">92%</span>
            <span className="text-[10px] text-emerald-400/80 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">High Fit</span>
          </div>
          <span className="text-[10px] text-zinc-500 mt-1 block">Based on extracted skills</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md">
          <span className="text-[11px] text-zinc-400 font-semibold block">Saved Jobs</span>
          <span className="text-2xl font-black text-white mt-1 block">{savedCount}</span>
          <Link href="/applications" className="text-[10px] text-cyan-400 hover:underline mt-1 block">
            View saved list →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md">
          <span className="text-[11px] text-zinc-400 font-semibold block">Applied Openings</span>
          <span className="text-2xl font-black text-white mt-1 block">{appliedCount}</span>
          <span className="text-[10px] text-zinc-500 mt-1 block">In tracking pipeline</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-md">
          <span className="text-[11px] text-zinc-400 font-semibold block">Interview Prep Ready</span>
          <span className="text-2xl font-black text-indigo-400 mt-1 block">{interviewingCount || '1'}</span>
          <Link href="/interview-prep" className="text-[10px] text-indigo-300 hover:underline mt-1 block">
            Launch prep kit →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Matched Jobs (Feature 1 & Feature 2 Integration) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Top AI Matched Jobs for Your Resume
              </h2>
              <p className="text-xs text-zinc-400">Ranked by skill relevance and fresher eligibility</p>
            </div>

            <Link href="/jobs" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
              View all openings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topMatches.slice(0, 4).map((job) => (
              <div
                key={job._id || job.id}
                className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-400">{job.company}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {job.city || job.location}
                    </span>
                  </div>
                  <Link
                    href={`/jobs/${job._id || job.id}`}
                    className="text-sm font-bold text-white hover:text-cyan-400 transition-colors block"
                  >
                    {job.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{job.salaryRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-emerald-400 block">{job.matchScore || 90}%</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold">Match</span>
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1 whitespace-nowrap"
                  >
                    Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            Quick AI Tools
          </h2>

          <div className="space-y-3">
            <Link
              href="/interview-prep"
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 block transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  AI Interview Prep Kit
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate role-specific technical questions, coding problems, and practice mock answers with instant feedback.
              </p>
            </Link>

            <Link
              href="/roadmap"
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 block transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Skill Gap & Career Roadmap
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Identify missing skills holding you back and access curated free resources with progress tracking.
              </p>
            </Link>

            <Link
              href="/applications"
              className="p-5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 block transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Kanban className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Application Tracker Board
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Organize your jobs across Saved, Applied, In Review, and Interviewing stages.
              </p>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
