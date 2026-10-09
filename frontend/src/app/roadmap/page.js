'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  Loader2, 
  CheckSquare, 
  Square,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { roadmapApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CareerRoadmapPage() {
  const { user, resume, isAuthenticated, showToast, demoLogin } = useAuth();
  
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingSkill, setUpdatingSkill] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, [targetRole]);

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const res = await roadmapApi.getRoadmap(targetRole);
      if (res.success && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.warn('Roadmap fetch err:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (skillName, newStatus) => {
    if (!isAuthenticated) {
      showToast('Please sign in or use Demo Mode to track your learning progress.', 'info');
      await demoLogin();
    }

    setUpdatingSkill(skillName);
    try {
      const res = await roadmapApi.updateSkillStatus(skillName, newStatus);
      if (res.success && res.roadmap) {
        setRoadmap(res.roadmap);
        showToast(`Updated ${skillName} to ${newStatus}`, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdatingSkill(null);
    }
  };

  const handleToggleMilestone = async (week, currentCompleted) => {
    if (!isAuthenticated) {
      showToast('Please sign in or use Demo Mode to update milestones.', 'info');
      await demoLogin();
    }

    try {
      const res = await roadmapApi.toggleMilestone(week, !currentCompleted);
      if (res.success && res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const progress = roadmap?.completionPercentage || 25;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Feature 4: Skill Gap & Career Roadmap</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Personalized Tech Readiness Roadmap</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Bridge missing skill gaps with verified free resources and track your preparation milestones.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold">Target:</span>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Software Engineer Fresher">Software Engineer Fresher</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs text-zinc-400 font-medium">Analyzing skill gaps and building roadmap...</p>
        </div>
      ) : roadmap ? (
        <div className="space-y-8">
          
          {/* Progress Overview Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 shadow-2xl backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Target Role: {roadmap.targetRole}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  Interview Readiness Progress
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">{progress}%</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Completed</span>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-zinc-950 rounded-full h-3.5 p-0.5 border border-zinc-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 pt-1">
              <span>{roadmap.missingSkills?.filter(s => s.status === 'Mastered').length || 0} Skills Mastered</span>
              <span>{roadmap.missingSkills?.filter(s => s.status === 'In Progress').length || 0} In Progress</span>
              <span>{roadmap.missingSkills?.filter(s => s.status === 'To Learn').length || 0} Remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Identified Skill Gaps & Recommended Free Learning Resources */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Identified Missing Skills & Free Curated Courses
              </h3>

              <div className="space-y-4">
                {(roadmap.missingSkills || []).map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                            skill.importance === 'High'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {skill.importance} Priority
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">{skill.category || 'Core Skill'}</span>
                      </div>

                      {/* Interactive Status Changer */}
                      <div className="flex items-center gap-1.5">
                        {['To Learn', 'In Progress', 'Mastered'].map((st) => (
                          <button
                            key={st}
                            disabled={updatingSkill === skill.name}
                            onClick={() => handleUpdateStatus(skill.name, st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              skill.status === st
                                ? st === 'Mastered'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : st === 'In Progress'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                                : 'text-zinc-500 hover:text-zinc-300 bg-zinc-950/60 border border-transparent'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    {skill.resources && skill.resources.length > 0 && (
                      <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                          Verified Free Resources
                        </span>
                        <div className="space-y-1.5">
                          {skill.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between text-xs group transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="text-zinc-200 group-hover:text-white font-medium">{res.title}</span>
                                <span className="text-[10px] text-zinc-500">({res.provider} • {res.duration})</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: 4-Week Milestone Checklist */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                4-Week Preparation Milestones
              </h3>

              <div className="space-y-3">
                {(roadmap.milestones || []).map((m) => (
                  <div
                    key={m.week}
                    onClick={() => handleToggleMilestone(m.week, m.completed)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      m.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button className="mt-0.5 text-emerald-400">
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-600" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                          Week {m.week}
                        </span>
                        <h4 className={`text-xs font-bold ${m.completed ? 'text-zinc-400 line-through' : 'text-white'}`}>
                          {m.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {m.description}
                        </p>
                        {m.topics && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {m.topics.map((top, tIdx) => (
                              <span key={tIdx} className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-950 text-zinc-400 border border-zinc-800">
                                {top}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready to apply callout */}
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                <p>
                  As you master skills and complete milestones, your match percentage across Bengaluru and remote tech openings increases!
                </p>
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline"
                >
                  Browse Updated Job Matches <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
}
