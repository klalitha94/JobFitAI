import { calculateJobMatchWithGemini } from '../services/geminiService.js';
import { getJobById, getJobsFiltered } from '../services/jobApiService.js';
import { Resume } from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const getJobMatchAnalysis = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { isConnected } = getDbStatus();

    // 1. Fetch Job
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // 2. Fetch User Resume
    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
    }

    // If user has not uploaded a resume yet, use profile skills or return guided prompt
    const resumeData = resume && resume.parsedData ? resume.parsedData : {
      candidateName: req.user.name,
      technicalSkills: req.user.skills || ['JavaScript', 'React', 'Git'],
      education: [{ degree: 'Engineering Student / Graduate', institution: 'University', year: '2024' }],
      projects: [],
      experience: [],
    };

    console.log(`[MatchController] Calculating Gemini match for user: ${req.user.name} on job: ${job.title} at ${job.company}`);

    // 3. Compute Smart Match with Gemini
    const matchAnalysis = await calculateJobMatchWithGemini(resumeData, job);

    res.json({
      success: true,
      jobId,
      jobTitle: job.title,
      company: job.company,
      analysis: matchAnalysis,
    });
  } catch (error) {
    console.error('Job match analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopRecommendations = async (req, res) => {
  try {
    const { isConnected } = getDbStatus();

    // 1. Fetch Resume
    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
    }

    const candidateSkills = (resume?.parsedData?.technicalSkills || req.user.skills || []).map(s => s.toLowerCase());

    // 2. Fetch all jobs
    const { jobs } = await getJobsFiltered({ limit: 50 });

    // 3. Score all jobs against candidate skills
    const rankedJobs = jobs.map(job => {
      const required = (job.skillsRequired || []).map(s => s.toLowerCase());
      let matchedCount = 0;
      let matchedList = [];
      let missingList = [];

      job.skillsRequired.forEach(reqSkill => {
        const found = candidateSkills.some(cs => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs));
        if (found) {
          matchedCount++;
          matchedList.push(reqSkill);
        } else {
          missingList.push(reqSkill);
        }
      });

      let score = required.length > 0 ? Math.round((matchedCount / required.length) * 100) : 75;
      if (score > 96) score = 94;
      if (score < 50 && candidateSkills.length > 0) score = 55 + Math.floor(Math.random() * 15);

      return {
        ...job,
        matchScore: score,
        matchedSkills: matchedList,
        missingSkills: missingList,
      };
    });

    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      topMatches: rankedJobs.slice(0, 6),
      totalMatches: rankedJobs.length,
    });
  } catch (error) {
    console.error('Top recommendations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
