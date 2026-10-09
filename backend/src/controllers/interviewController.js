import { generateInterviewPrepWithGemini, evaluateMockAnswerWithGemini } from '../services/geminiService.js';
import { getJobById } from '../services/jobApiService.js';
import { Resume } from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const generateInterviewKit = async (req, res) => {
  try {
    const { jobId, targetRole, customJobDescription } = req.body;
    const { isConnected } = getDbStatus();

    // 1. Resolve Job Details
    let jobData = {
      title: targetRole || 'Software Development Engineer (Fresher)',
      company: 'Tech Company',
      skillsRequired: ['JavaScript', 'React', 'Node.js', 'Data Structures', 'SQL'],
      description: customJobDescription || 'Engineering position focusing on frontend or backend web applications.',
    };

    if (jobId) {
      const foundJob = await getJobById(jobId);
      if (foundJob) {
        jobData = foundJob;
      }
    }

    // 2. Resolve User Resume
    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
    }

    const resumeData = resume?.parsedData || {
      candidateName: req.user.name,
      technicalSkills: req.user.skills || ['JavaScript', 'React', 'Node.js'],
      projects: [],
      education: [],
    };

    console.log(`[InterviewController] Generating AI Interview Kit for role: ${jobData.title} at ${jobData.company}`);

    const prepKit = await generateInterviewPrepWithGemini(resumeData, jobData);

    res.json({
      success: true,
      role: jobData.title,
      company: jobData.company,
      prepKit,
    });
  } catch (error) {
    console.error('Interview kit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitMockAnswer = async (req, res) => {
  try {
    const { question, answer, jobRole } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const feedback = await evaluateMockAnswerWithGemini(question, answer, jobRole || 'Software Engineer');

    res.json({
      success: true,
      evaluation: feedback,
    });
  } catch (error) {
    console.error('Mock answer evaluation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
