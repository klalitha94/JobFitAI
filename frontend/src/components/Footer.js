import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">JobFit AI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              AI-powered recommendation engine matching tech freshers and interns with real openings across Bengaluru, tech hubs, and remote positions.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Powered by Gemini AI & Real Tech Portals</span>
            </div>
          </div>

          {/* Quick Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">Tech Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs?city=Bengaluru" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  <MapPin className="w-3 h-3 text-cyan-400" /> Bengaluru Startups & Unicorns
                </Link>
              </li>
              <li>
                <Link href="/jobs?city=Remote" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  <MapPin className="w-3 h-3 text-indigo-400" /> 100% Remote / WFH Roles
                </Link>
              </li>
              <li>
                <Link href="/jobs?city=Hyderabad" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Hyderabad Engineering Hub
                </Link>
              </li>
              <li>
                <Link href="/jobs?city=Delhi-NCR" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  <MapPin className="w-3 h-3 text-purple-400" /> Gurugram / Delhi-NCR
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">Four Core Engines</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  1. Smart Resume Matching
                </Link>
              </li>
              <li>
                <Link href="/jobs?city=Bengaluru" className="hover:text-white transition-colors">
                  2. Location-Based Job Discovery
                </Link>
              </li>
              <li>
                <Link href="/interview-prep" className="hover:text-white transition-colors">
                  3. AI Interview Preparation
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  4. Skill Gap & Career Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">MERN + Gemini Architecture</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Engineered with Next.js App Router, Tailwind CSS, Express.js backend, MongoDB database layer, and Google Gemini AI.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[11px] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Direct Apply Links Verified
              </span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} JobFit AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for engineering students, fresh graduates & interns.
          </p>
        </div>
      </div>
    </footer>
  );
}
