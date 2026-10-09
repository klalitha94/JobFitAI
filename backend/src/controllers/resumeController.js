import { extractTextFromPdf } from '../services/pdfService.js';
import { parseResumeWithGemini } from '../services/geminiService.js';
import { Resume } from '../models/Resume.js';
import { User } from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume file.' });
    }

    console.log(`[ResumeController] Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

    // 1. Extract raw text from PDF
    const { text, numPages } = await extractTextFromPdf(req.file.buffer);

    if (!text || text.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from the PDF. Please ensure the document is not an image-only scan.',
      });
    }

    console.log(`[ResumeController] Extracted ${text.length} characters across ${numPages} page(s). Parsing with Gemini AI...`);

    // 2. Parse extracted text with Gemini
    const parsedData = await parseResumeWithGemini(text);

    const { isConnected } = getDbStatus();
    let savedResume = null;

    if (isConnected) {
      // Save or update existing resume for this user
      savedResume = await Resume.create({
        user: req.user._id,
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
        rawText: text,
        parsedData,
      });

      // Sync skills and target roles to User profile
      await User.findByIdAndUpdate(req.user._id, {
        currentResumeId: savedResume._id,
        skills: parsedData.technicalSkills || [],
        targetRoles: parsedData.recommendedRoles && parsedData.recommendedRoles.length > 0 
          ? parsedData.recommendedRoles 
          : req.user.targetRoles,
      });
    } else {
      savedResume = memoryStore.saveResume({
        user: req.user._id,
        originalFileName: req.file.originalname,
        fileSize: req.file.size,
        rawText: text,
        parsedData,
      });

      memoryStore.saveUser({
        ...req.user,
        currentResumeId: savedResume._id,
        skills: parsedData.technicalSkills || [],
        targetRoles: parsedData.recommendedRoles || req.user.targetRoles,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully by Gemini AI',
      resume: savedResume,
      parsedData,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyResume = async (req, res) => {
  try {
    const { isConnected } = getDbStatus();
    let resume = null;

    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
    }

    if (!resume) {
      return res.status(200).json({
        success: true,
        resume: null,
        message: 'No resume uploaded yet.',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateParsedResume = async (req, res) => {
  try {
    const { parsedData } = req.body;
    const { isConnected } = getDbStatus();

    if (!parsedData) {
      return res.status(400).json({ success: false, message: 'parsedData is required' });
    }

    let resume = null;
    if (isConnected) {
      resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (resume) {
        resume.parsedData = { ...resume.parsedData, ...parsedData };
        await resume.save();
      }
      if (parsedData.technicalSkills) {
        await User.findByIdAndUpdate(req.user._id, { skills: parsedData.technicalSkills });
      }
    } else {
      resume = memoryStore.findResumeByUserId(req.user._id);
      if (resume) {
        resume.parsedData = { ...resume.parsedData, ...parsedData };
      }
    }

    res.json({
      success: true,
      message: 'Resume details updated successfully',
      resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
