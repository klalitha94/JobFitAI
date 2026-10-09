'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  BrainCircuit, 
  Compass, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  Building2, 
  Zap, 
  ArrowUpRight,
  Code2,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { demoLogin, isAuthenticated } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const features = [
    {
      id: 'feature-1',
      title: '1. Smart Resume Matching',
      badge: 'Feature 1',
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
      description: 'Upload your PDF resume. Gemini AI calculates a real-time match percentage for every job, provides 3 bullet points explaining why it suits you, and flags missing skills.',
      highlights: [
        'Precise match percentage calculated using semantic skill reasoning',
        'Concise recruiter explanations on why the job fits your projects',
        'Color-coded missing skills breakdown with recommended remedies'
      ],
      preview: {
        score: 94,
        role: 'Full Stack Engineer - Fresher',
        company: 'CRED',
        location: 'Bengaluru, Karnataka',
        reasons: [
          'Strong proficiency in React, Node.js, and MongoDB from your portfolio',
          'Demonstrated microservices architecture experience aligns with CRED core stack'
        ],
        missing: ['Docker', 'TypeScript'],
        matched: ['React', 'Node.js', 'MongoDB', 'REST API']
      }
    },
    {
      id: 'feature-2',
      title: '2. Location-Based Job Discovery',
      badge: 'Feature 2',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
      description: 'Filter real openings by Bengaluru tech parks, major Indian engineering hubs (Hyderabad, Mumbai, Pune, Delhi-NCR), and 100% Remote / Work-From-Home opportunities.',
      highlights: [
        'Dedicated Bengaluru filter for Koramangala, Indiranagar, and Bellandur hubs',
        'Salary and stipend sliders ranging from ₹20,000/mo to ₹24,00,000/yr',
        'Direct "Apply Now" links opening official company career portals'
      ],
      preview: {
        locations: ['Bengaluru', 'Remote / WFH', 'Hyderabad', 'Mumbai', 'Pune'],
        types: ['Internship (₹35k - ₹60k/mo)', 'Fresher (₹10L - ₹24L/yr)'],
        sources: ['Direct Career Portals', 'Arbeitnow Live API', 'Remotive Remote API']
      }
    },
    {
      id: 'feature-3',
      title: '3. AI Interview Preparation',
      badge: 'Feature 3',
      icon: BrainCircuit,
      color: 'from-indigo-500 to-purple-600',
      description: 'Generate customized interview preparation kits for any role or company using Gemini AI. Practice technical questions, coding problems, and mock answers with instant feedback.',
      highlights: [
        'Role-specific conceptual questions with in-depth model answers',
        'Fresher/Intern level coding challenges with problem statement, hints, and optimal approach',
        '7-day structured interview preparation roadmap and mock answer evaluation'
      ],
      preview: {
        topics: ['Virtual DOM & Reconciliation', 'Event Loop & Libuv', 'B-Tree DB Indexing'],
        coding: ['Two Sum Target (Hash Map O(N))', 'Longest Substring Sliding Window'],
        mockRating: '9/10 with actionable feedback from Gemini'
      }
    },
    {
      id: 'feature-4',
      title: '4. Skill Gap & Career Roadmap',
      badge: 'Feature 4',
      icon: Compass,
      color: 'from-amber-500 to-rose-600',
      description: 'Identify exact missing skills holding your resume back from high-paying roles. Access curated free learning resources and track your progress with an interactive checklist.',
      highlights: [
        'High, Medium, and Low priority skill gap classification',
        'Curated links to freeCodeCamp, MDN, official docs, and YouTube courses',
        'Interactive checklist with completion progress saved to your profile'
      ],
      preview: {
        skills: [
          { name: 'Docker', status: 'In Progress', provider: 'freeCodeCamp' },
          { name: 'TypeScript', status: 'To Learn', provider: 'Official Docs' },
          { name: 'PostgreSQL', status: 'Mastered', provider: 'PostgreSQL Tutorial' }
        ],
        progress: '68% Readiness Score'
      }
    }
  ];

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-grid opacity-60 pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        
        {/* Top pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-8 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400">Gemini AI Engine Active</span>
          <span className="text-zinc-500">|</span>
          <span>Matched to Bengaluru & Global Remote Openings</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Land Your Dream Tech Job with{' '}
          <span className="gradient-text-emerald">AI Precision</span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Upload your resume once. <span className="text-zinc-200 font-medium">JobFit AI</span> analyzes your exact skills, computes real-time match scores for fresher & internship roles, generates custom interview kits, and builds your career roadmap.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/resume"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-900/30 hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            Upload Resume & Match
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm border border-zinc-800 hover:border-zinc-700 transition-all"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            Discover Bengaluru & Remote Jobs
          </Link>

          {!isAuthenticated && (
            <button
              onClick={demoLogin}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-cyan-300 font-semibold text-sm border border-cyan-500/30 hover:border-cyan-500/60 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              1-Click Demo Login
            </button>
          )}
        </div>

        {/* Tech Hiring Companies Strip */}
        <div className="mt-16 pt-10 border-t border-zinc-900/90">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-6">
            Curated Real Openings from Top Tech Employers & Startups
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-300 text-zinc-400 font-bold text-sm tracking-wider">
            <span className="hover:text-white transition-colors">GOOGLE</span>
            <span className="hover:text-white transition-colors">MICROSOFT</span>
            <span className="hover:text-white transition-colors">RAZORPAY</span>
            <span className="hover:text-white transition-colors">CRED</span>
            <span className="hover:text-white transition-colors">SWIGGY</span>
            <span className="hover:text-white transition-colors">ZERODHA</span>
            <span className="hover:text-white transition-colors">ZOMATO</span>
            <span className="hover:text-white transition-colors">PHONEPE</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Interactive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-900">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/60">
            Engineered for Modern Tech Hiring
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            Four Unique Engines Built Into One Platform
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Everything a fresher or intern needs: from understanding your match percentage to mastering interview questions and filling skill gaps.
          </p>
        </div>

        {/* Feature Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const active = activeFeatureTab === idx;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeatureTab(idx)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-zinc-900 border-zinc-700 shadow-xl shadow-cyan-950/20'
                    : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${feature.color} p-0.5 shrink-0`}>
                  <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                    {feature.badge}
                  </span>
                  <span className="text-xs font-semibold text-white truncate block">
                    {feature.title.replace(/^\d+\.\s*/, '')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Content Display */}
        {(() => {
          const current = features[activeFeatureTab];
          const Icon = current.icon;
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{current.badge}: {current.title}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {current.title.replace(/^\d+\.\s*/, '')}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {current.description}
                </p>

                <div className="space-y-3 pt-2">
                  {current.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={
                      activeFeatureTab === 0 ? '/resume' :
                      activeFeatureTab === 1 ? '/jobs' :
                      activeFeatureTab === 2 ? '/interview-prep' : '/roadmap'
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <span>Try {current.title.replace(/^\d+\.\s*/, '')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Interactive Visual Preview Box */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  {activeFeatureTab === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <div>
                          <span className="text-[11px] text-zinc-400 uppercase font-semibold">Candidate Match Rating</span>
                          <h4 className="text-sm font-bold text-white">Full Stack Engineer (Fresher) at CRED</h4>
                        </div>
                        <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black">
                          94% Match
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block">Why It Suits You</span>
                        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 space-y-1.5">
                          <p>• Your portfolio projects in React, Node.js & MongoDB mirror CRED's core full-stack stack.</p>
                          <p>• Demonstrated CS fundamentals match entry-level engineering benchmarks.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs space-y-1">
                          <span className="text-emerald-400 font-semibold block text-[11px]">Matched Skills (4)</span>
                          <span className="text-zinc-300">React, Node.js, MongoDB, REST API</span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs space-y-1">
                          <span className="text-amber-400 font-semibold block text-[11px]">Missing / Need (2)</span>
                          <span className="text-zinc-300">Docker, TypeScript</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeatureTab === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <span className="text-xs font-semibold text-zinc-300">Location Discovery Engine</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          Bengaluru Focus
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                          📍 Bengaluru (Koramangala, Bellandur, Whitefield)
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                          🌐 100% Remote / WFH
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                          📍 Hyderabad Tech City
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-2">
                        <div className="flex justify-between items-center text-zinc-300">
                          <span className="font-semibold">Razorpay - Associate Software Engineer</span>
                          <span className="text-emerald-400 font-bold">₹14L - ₹18L / yr</span>
                        </div>
                        <p className="text-zinc-400">Bengaluru • Hybrid • Fresher Batch 2024/2025</p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[11px] text-zinc-500">Official Razorpay Careers Link</span>
                          <span className="text-cyan-400 font-bold flex items-center gap-1">Direct Apply Link <ArrowUpRight className="w-3 h-3" /></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFeatureTab === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <span className="text-xs font-semibold text-zinc-300">Gemini AI Interview Kit</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          SDE Intern Prep
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-2">
                        <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider">Generated Technical Question</span>
                        <p className="text-white font-medium">"How does reconciliation optimize Virtual DOM diffing in React?"</p>
                        <p className="text-zinc-400 text-[11px] italic">Gemini evaluates candidate answers with instant 1-10 scoring & suggestions.</p>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs flex justify-between items-center">
                        <span className="text-zinc-300 font-medium">Coding Problem: Two Sum Target</span>
                        <span className="text-emerald-400 font-bold">Easy • O(N)</span>
                      </div>
                    </div>
                  )}

                  {activeFeatureTab === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                        <span className="text-xs font-semibold text-zinc-300">Skill Gap & Progress Roadmap</span>
                        <span className="text-emerald-400 text-xs font-bold">Readiness: 68%</span>
                      </div>

                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full w-[68%]" />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                          <span className="text-white">Docker & Containerization</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30">In Progress</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                          <span className="text-white">TypeScript Handbook</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/30">To Learn</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          );
        })()}

      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-3xl font-extrabold text-white block">100%</span>
            <span className="text-xs text-zinc-400 mt-1 block">Legitimate Tech Openings</span>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-3xl font-extrabold text-cyan-400 block">Bengaluru</span>
            <span className="text-xs text-zinc-400 mt-1 block">Dedicated Tech Park Hub</span>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-3xl font-extrabold text-emerald-400 block">&lt; 3 Sec</span>
            <span className="text-xs text-zinc-400 mt-1 block">Gemini AI Resume Parsing</span>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <span className="text-3xl font-extrabold text-indigo-400 block">4 in 1</span>
            <span className="text-xs text-zinc-400 mt-1 block">Matching, Discovery, Prep & Roadmap</span>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-12">
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight relative">
            Ready to find fresher jobs tailored to your skills?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mt-3 relative leading-relaxed">
            Upload your PDF resume now to generate match scores, prepare with AI, and apply directly to verified openings.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 relative">
            <Link
              href="/resume"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20"
            >
              Upload Resume (PDF)
            </Link>
            <Link
              href="/jobs?city=Bengaluru"
              className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm border border-zinc-700"
            >
              Browse Bengaluru Jobs
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
