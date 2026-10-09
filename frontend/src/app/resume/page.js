'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FileUp, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Award, 
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resumeApi } from '../../services/api';

export default function ResumePage() {
  const { user, resume, refreshResume, showToast, isAuthenticated, demoLogin } = useAuth();
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const [parsedData, setParsedData] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [savingChanges, setSavingChanges] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (resume?.parsedData) {
      setParsedData(resume.parsedData);
    }
  }, [resume]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a PDF document.', 'error');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB.', 'error');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('Please select a PDF file first.', 'error');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please sign in or use Demo Mode to analyze your resume.', 'info');
      await demoLogin();
    }

    setUploading(true);
    try {
      const res = await resumeApi.uploadResume(file);
      if (res.success && res.parsedData) {
        setParsedData(res.parsedData);
        await refreshResume();
        showToast('Resume parsed successfully by Gemini AI!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to parse resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim() || !parsedData) return;
    const current = parsedData.technicalSkills || [];
    if (!current.includes(newSkill.trim())) {
      setParsedData({
        ...parsedData,
        technicalSkills: [...current, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      technicalSkills: (parsedData.technicalSkills || []).filter(s => s !== skillToRemove),
    });
  };

  const handleSaveProfileChanges = async () => {
    if (!parsedData) return;
    setSavingChanges(true);
    try {
      await resumeApi.updateParsedData(parsedData);
      showToast('Skills and parsed details saved!', 'success');
      await refreshResume();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingChanges(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemini AI Resume Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Upload & Parsing Center</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Upload your PDF resume. Our Gemini AI model extracts skills, projects, and coursework to compute real-time job match percentages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Drag & Drop Zone */}
        <div className="lg:col-span-5 space-y-6">
          
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px] ${
              file
                ? 'border-cyan-500/60 bg-cyan-950/20'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mb-4 shadow-inner">
              {file ? (
                <FileText className="w-7 h-7 text-cyan-400" />
              ) : (
                <FileUp className="w-7 h-7 text-zinc-400" />
              )}
            </div>

            {file ? (
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Selected PDF</span>
                <p className="text-sm font-semibold text-white max-w-[260px] truncate">{file.name}</p>
                <p className="text-[11px] text-zinc-500">{(file.size / 1024).toFixed(1)} KB • Click or drop to change</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">Drop your PDF resume here</p>
                <p className="text-xs text-zinc-400">or click to browse from your device</p>
                <p className="text-[11px] text-zinc-600">Supports standard ATS PDF formats up to 10MB</p>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              !file
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-indigo-600/25'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gemini AI is analyzing resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Parse Resume with Gemini AI</span>
              </>
            )}
          </button>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>How Gemini AI Evaluates Your Resume</span>
            </div>
            <p className="leading-relaxed">
              Extracted skills, projects, and education are used by the <strong>Smart Resume Matching Engine</strong> to compute match percentages against verified tech openings in Bengaluru and remote hubs.
            </p>
          </div>

        </div>

        {/* Right Column: Parsed Resume Overview */}
        <div className="lg:col-span-7">
          {parsedData ? (
            <div className="bg-zinc-900/50 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
              
              {/* Profile summary banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI Parsed & Verified
                  </span>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {parsedData.candidateName || user?.name || 'Candidate Profile'}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {parsedData.location || 'Bengaluru, India'} • {parsedData.email || user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/jobs"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-600/20"
                  >
                    <span>View Matched Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* AI Generated Summary */}
              {parsedData.summary && (
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                    Professional Summary
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                {[
                  { id: 'skills', label: 'Technical Skills', icon: Sparkles },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'projects', label: 'Projects', icon: FolderGit2 },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-zinc-800 text-white border border-zinc-700'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Technical Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Extracted skills used for Smart Resume Matching ({parsedData.technicalSkills?.length || 0})
                    </span>
                    <button
                      onClick={handleSaveProfileChanges}
                      disabled={savingChanges}
                      className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 flex items-center gap-1"
                    >
                      <Save className="w-3 h-3 text-emerald-400" />
                      {savingChanges ? 'Saving...' : 'Save Skills'}
                    </button>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-2">
                    {(parsedData.technicalSkills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 shadow-sm hover:border-zinc-700 transition-colors"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Remove skill"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Skill Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      placeholder="Add missing skill (e.g. Next.js, Redux, Docker)"
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-cyan-300 border border-zinc-700 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  {/* Soft Skills */}
                  {parsedData.softSkills && parsedData.softSkills.length > 0 && (
                    <div className="pt-4 border-t border-zinc-800/80">
                      <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold block mb-2">
                        Soft Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedData.softSkills.map((ss, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400"
                          >
                            {ss}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Education */}
              {activeTab === 'education' && (
                <div className="space-y-3">
                  {(parsedData.education || []).map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                      <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                      <p className="text-xs text-zinc-400">{edu.institution}</p>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                        <span>Year: {edu.year || '2024'}</span>
                        {edu.score && <span>• Score: {edu.score}</span>}
                      </div>
                    </div>
                  ))}
                  {(!parsedData.education || parsedData.education.length === 0) && (
                    <p className="text-xs text-zinc-500">No education entries extracted.</p>
                  )}
                </div>
              )}

              {/* Tab 3: Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-3">
                  {(parsedData.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:underline"
                          >
                            View Link
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{proj.description}</p>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!parsedData.projects || parsedData.projects.length === 0) && (
                    <p className="text-xs text-zinc-500">No project entries extracted.</p>
                  )}
                </div>
              )}

              {/* Tab 4: Experience */}
              {activeTab === 'experience' && (
                <div className="space-y-3">
                  {(parsedData.experience || []).map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                        <span className="text-[11px] text-zinc-500">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-medium text-cyan-400">{exp.company}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                  {(!parsedData.experience || parsedData.experience.length === 0) && (
                    <p className="text-xs text-zinc-500">Fresher profile - no prior corporate experience recorded.</p>
                  )}
                </div>
              )}

              {/* AI Resume Improvement Tips */}
              {parsedData.suggestedImprovements && parsedData.suggestedImprovements.length > 0 && (
                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Gemini Resume Polishing Tip
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {parsedData.suggestedImprovements[0]}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
              <FileText className="w-12 h-12 text-zinc-700 mb-3" />
              <h3 className="text-base font-bold text-zinc-300">No Resume Uploaded Yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Upload your PDF resume on the left to extract your skills, compute smart matches, and unlock customized interview preparation kits.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
