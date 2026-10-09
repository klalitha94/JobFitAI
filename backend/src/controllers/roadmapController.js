import { generateSkillRoadmapWithGemini } from '../services/geminiService.js';
import { SkillRoadmap } from '../models/SkillRoadmap.js';
import { Resume } from '../models/Resume.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const getOrCreateRoadmap = async (req, res) => {
  try {
    const { targetRole } = req.query;
    const { isConnected } = getDbStatus();

    // 1. Check existing roadmap
    let roadmap = null;
    if (isConnected) {
      roadmap = await SkillRoadmap.findOne({ user: req.user._id });
    } else {
      roadmap = memoryStore.findRoadmapByUserId(req.user._id);
    }

    // Determine target role
    const effectiveRole = targetRole || (req.user.targetRoles && req.user.targetRoles[0]) || 'Full Stack Developer';

    // If existing roadmap matches role, return it
    if (roadmap && (!targetRole || roadmap.targetRole.toLowerCase() === targetRole.toLowerCase())) {
      return res.json({
        success: true,
        roadmap,
      });
    }

    // 2. Resolve Candidate's Current Skills
    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
    }

    const currentSkills = resume?.parsedData?.technicalSkills || req.user.skills || ['JavaScript', 'React'];

    console.log(`[RoadmapController] Generating AI Skill Gap Roadmap for ${req.user.name}, target: ${effectiveRole}`);

    // 3. Generate Roadmap with Gemini
    const generated = await generateSkillRoadmapWithGemini(currentSkills, effectiveRole);

    const roadmapDoc = {
      user: req.user._id,
      targetRole: effectiveRole,
      currentScore: generated.currentReadinessScore || 70,
      missingSkills: generated.missingSkills || [],
      milestones: generated.milestones || [],
      completionPercentage: 15,
      updatedAt: new Date(),
    };

    let saved = null;
    if (isConnected) {
      if (roadmap) {
        roadmap.targetRole = effectiveRole;
        roadmap.currentScore = roadmapDoc.currentScore;
        roadmap.missingSkills = roadmapDoc.missingSkills;
        roadmap.milestones = roadmapDoc.milestones;
        roadmap.completionPercentage = roadmapDoc.completionPercentage;
        saved = await roadmap.save();
      } else {
        saved = await SkillRoadmap.create(roadmapDoc);
      }
    } else {
      saved = memoryStore.saveRoadmap(roadmapDoc);
    }

    res.json({
      success: true,
      roadmap: saved,
    });
  } catch (error) {
    console.error('Skill roadmap error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkillStatus = async (req, res) => {
  try {
    const { skillName, status } = req.body;
    const { isConnected } = getDbStatus();

    if (!skillName || !['To Learn', 'In Progress', 'Mastered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid skillName and status required.' });
    }

    let roadmap = null;
    if (isConnected) {
      roadmap = await SkillRoadmap.findOne({ user: req.user._id });
    } else {
      roadmap = memoryStore.findRoadmapByUserId(req.user._id);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    const targetSkill = (roadmap.missingSkills || []).find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (targetSkill) {
      targetSkill.status = status;
    }

    // Recalculate progress
    const totalSkills = roadmap.missingSkills.length;
    const masteredCount = roadmap.missingSkills.filter(s => s.status === 'Mastered').length;
    const inProgressCount = roadmap.missingSkills.filter(s => s.status === 'In Progress').length;
    
    const calculatedProgress = totalSkills > 0 
      ? Math.round(((masteredCount * 1.0 + inProgressCount * 0.5) / totalSkills) * 100)
      : 0;

    roadmap.completionPercentage = calculatedProgress;
    roadmap.updatedAt = new Date();

    if (isConnected) {
      await roadmap.save();
    } else {
      memoryStore.saveRoadmap(roadmap);
    }

    res.json({
      success: true,
      message: `Updated ${skillName} status to ${status}`,
      roadmap,
      completionPercentage: calculatedProgress,
    });
  } catch (error) {
    console.error('Update skill status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleMilestone = async (req, res) => {
  try {
    const { milestoneWeek, completed } = req.body;
    const { isConnected } = getDbStatus();

    let roadmap = null;
    if (isConnected) {
      roadmap = await SkillRoadmap.findOne({ user: req.user._id });
    } else {
      roadmap = memoryStore.findRoadmapByUserId(req.user._id);
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    const milestone = (roadmap.milestones || []).find(m => m.week === Number(milestoneWeek));
    if (milestone) {
      milestone.completed = completed !== undefined ? completed : !milestone.completed;
    }

    if (isConnected) {
      await roadmap.save();
    } else {
      memoryStore.saveRoadmap(roadmap);
    }

    res.json({
      success: true,
      roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
