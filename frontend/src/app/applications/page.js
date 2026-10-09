'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Kanban, 
  Sparkles, 
  Building2, 
  MapPin, 
  ArrowUpRight, 
  Trash2, 
  Loader2, 
  Calendar, 
  FileText,
  Plus,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { applicationsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ApplicationsPage() {
  const { user, isAuthenticated, showToast, demoLogin } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('All');

  const STAGES = ['Saved', 'Applied', 'In Review', 'Interviewing', 'Offered', 'Rejected'];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.warn('Applications load err:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationsApi.updateStatus(appId, { status: newStatus });
      showToast(`Moved to ${newStatus}`, 'success');
      await fetchApplications();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await applicationsApi.deleteApplication(jobId);
      showToast('Removed from tracking board', 'info');
      await fetchApplications();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredApps = activeStage === 'All' 
    ? applications 
    : applications.filter(a => a.status === activeStage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-2">
            <Kanban className="w-3.5 h-3.5 text-cyan-400" />
            <span>Job Application & Saved Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Application Pipeline</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track your applied and saved fresher opportunities from application to offer.
          </p>
        </div>

        <Link
          href="/jobs"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          Find More Jobs
        </Link>
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-none">
        <button
          onClick={() => setActiveStage('All')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeStage === 'All'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          All ({applications.length})
        </button>

        {STAGES.map((st) => {
          const count = applications.filter(a => a.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setActiveStage(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeStage === st
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>{st}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pipeline Cards Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-zinc-400 font-medium">Loading your applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-zinc-900/30 border border-zinc-800/80 p-8 space-y-3">
          <Bookmark className="w-12 h-12 text-zinc-700 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">No applications in this stage</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Browse verified tech jobs in Bengaluru, Remote, and other cities to save and track your applications.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 mt-2"
          >
            Explore Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const job = app.job || {};
            const isBengaluru = (job.city === 'Bengaluru' || (job.location && job.location.includes('Bengaluru')));

            return (
              <div
                key={app._id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 shadow-lg flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
              >
                <div className="space-y-3">
                  {/* Status header & Delete */}
                  <div className="flex items-center justify-between">
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                        app.status === 'Offered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : app.status === 'Interviewing'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                          : app.status === 'Applied'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : app.status === 'In Review'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {STAGES.map(s => (
                        <option key={s} value={s} className="bg-zinc-950 text-white">
                          Stage: {s}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(job._id || job.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                      {job.company || 'Company'}
                    </span>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {job.title || 'Software Engineering Role'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {job.city || job.location || 'Bengaluru'}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">{job.salaryRange || 'Competitive'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                  <Link
                    href={`/interview-prep?jobId=${job._id || job.id}`}
                    className="text-zinc-400 hover:text-cyan-400 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Prep AI
                  </Link>

                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center gap-1 text-xs border border-zinc-700"
                    >
                      Apply Link <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
