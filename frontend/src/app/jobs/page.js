'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Briefcase, 
  Banknote, 
  Sparkles, 
  Loader2, 
  RotateCcw,
  CheckCircle2,
  Building2,
  Compass
} from 'lucide-react';
import { jobsApi } from '../../services/api';
import JobCard from '../../components/JobCard';
import { useAuth } from '../../context/AuthContext';

function JobsContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') || 'all';

  const { resume } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [locationType, setLocationType] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [minSalary, setMinSalary] = useState('0');
  const [page, setPage] = useState(1);

  const cityOptions = [
    { label: 'All Locations', value: 'all' },
    { label: '📍 Bengaluru (Silicon Valley of India)', value: 'Bengaluru' },
    { label: '🌐 100% Remote / WFH', value: 'Remote' },
    { label: '📍 Hyderabad Tech Hub', value: 'Hyderabad' },
    { label: '📍 Mumbai Fintech', value: 'Mumbai' },
    { label: '📍 Pune Engineering Hub', value: 'Pune' },
    { label: '📍 Gurugram / Delhi-NCR', value: 'Delhi-NCR' },
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobs({
        search,
        city: selectedCity,
        locationType,
        jobType,
        minSalary: minSalary === '0' ? undefined : minSalary,
        page,
        limit: 18,
      });

      if (res.success) {
        setJobs(res.jobs || []);
        setTotalJobs(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCity, locationType, jobType, minSalary, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCity('all');
    setLocationType('all');
    setJobType('all');
    setMinSalary('0');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feature 2: Location-Based Job Discovery</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Tech Fresher & Internship Discovery</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Explore verified openings across Bengaluru tech hubs, remote teams, and top Indian engineering cities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {resume ? (
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Resume Match Active</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs flex items-center gap-1.5">
              <span>Upload resume to activate match scores</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar & City Quick Chips */}
      <div className="space-y-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, or skills (e.g. React, Node.js, Python, Bengaluru)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all whitespace-nowrap"
          >
            Search Jobs
          </button>
        </form>

        {/* Location Filter Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {cityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelectedCity(opt.value);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === opt.value
                  ? opt.value === 'Bengaluru'
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 border shadow-sm'
                    : opt.value === 'Remote'
                    ? 'bg-purple-500/20 border-purple-500/60 text-purple-300 border shadow-sm'
                    : 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
        
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Work Mode */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Work Mode:</span>
            <select
              value={locationType}
              onChange={(e) => {
                setLocationType(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Modes (Onsite/Hybrid/Remote)</option>
              <option value="Remote">100% Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>

          {/* Job Type */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Opportunity Type:</span>
            <select
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Opportunities</option>
              <option value="Fresher">Fresher (Batch 2024 / 2025)</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time Junior</option>
            </select>
          </div>

          {/* Salary / Stipend Minimum */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 font-medium">Min Compensation:</span>
            <select
              value={minSalary}
              onChange={(e) => {
                setMinSalary(e.target.value);
                setPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              <option value="0">Any Compensation</option>
              <option value="35000">₹35,000+ / mo (Internships)</option>
              <option value="800000">₹8,00,000+ / yr (Fresher)</option>
              <option value="1200000">₹12,00,000+ / yr</option>
              <option value="1600000">₹16,00,000+ / yr</option>
            </select>
          </div>

        </div>

        {/* Reset Filter Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-semibold text-zinc-400">
          Showing <span className="text-white font-bold">{jobs.length}</span> of <span className="text-white font-bold">{totalJobs}</span> verified openings
          {selectedCity !== 'all' && ` in ${selectedCity}`}
        </p>

        <span className="text-[11px] text-zinc-500">
          Real apply links verified directly from company career portals
        </span>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-xs text-zinc-400 font-medium">Filtering tech jobs & fetching live openings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-zinc-900/30 border border-zinc-800/80 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-zinc-700 mx-auto" />
          <h3 className="text-base font-bold text-zinc-300">No Jobs Match Current Filters</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try loosening your salary threshold or select "All Locations" to view all tech fresher & internship listings.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 mt-2"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} onStatusChange={fetchJobs} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs text-zinc-400">Loading Jobs Engine...</p>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}
