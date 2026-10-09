import { getJobsFiltered, getJobById } from '../services/jobApiService.js';
import { Resume } from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const listJobs = async (req, res) => {
  try {
    const {
      search = '',
      city = 'all',
      locationType = 'all',
      jobType = 'all',
      minSalary = 0,
      page = 1,
      limit = 15,
    } = req.query;

    const result = await getJobsFiltered({
      search,
      city,
      locationType,
      jobType,
      minSalary: Number(minSalary),
      page: Number(page),
      limit: Number(limit),
    });

    // Check if user has skills from resume to attach quick match percentage
    let userSkills = [];
    if (req.user) {
      userSkills = req.user.skills || [];
      if (userSkills.length === 0) {
        const { isConnected } = getDbStatus();
        let resume = null;
        if (isConnected) {
          resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        } else {
          resume = memoryStore.findResumeByUserId(req.user._id);
        }
        if (resume && resume.parsedData && resume.parsedData.technicalSkills) {
          userSkills = resume.parsedData.technicalSkills;
        }
      }
    }

    // Attach quick match score estimate if userSkills are available
    const jobsWithScores = result.jobs.map(job => {
      let matchScore = null;
      if (userSkills.length > 0 && job.skillsRequired && job.skillsRequired.length > 0) {
        const matched = job.skillsRequired.filter(js =>
          userSkills.some(us => us.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(us.toLowerCase()))
        );
        matchScore = Math.min(95, Math.max(45, Math.round((matched.length / job.skillsRequired.length) * 100)));
      }
      return {
        ...job,
        estimatedMatchScore: matchScore,
      };
    });

    res.json({
      success: true,
      jobs: jobsWithScores,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await getJobById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Get single job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobLocationsAndStats = async (req, res) => {
  try {
    const all = await getJobsFiltered({ limit: 1000 });
    const jobs = all.jobs;

    const stats = {
      total: jobs.length,
      bengaluruCount: jobs.filter(j => (j.city === 'Bengaluru' || j.location.includes('Bengaluru'))).length,
      remoteCount: jobs.filter(j => (j.locationType === 'Remote' || j.location.toLowerCase().includes('remote'))).length,
      fresherCount: jobs.filter(j => j.jobType === 'Fresher').length,
      internshipCount: jobs.filter(j => j.jobType === 'Internship').length,
      topLocations: ['Bengaluru', 'Remote', 'Hyderabad', 'Mumbai', 'Delhi-NCR', 'Pune'],
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
