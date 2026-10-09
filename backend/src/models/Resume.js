import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  institution: { type: String, default: '' },
  year: { type: String, default: '' },
  score: { type: String, default: '' },
}, { _id: false });

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  techStack: [{ type: String }],
  description: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  rawText: {
    type: String,
    required: true,
  },
  parsedData: {
    candidateName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    certifications: [{ type: String }],
    recommendedRoles: [{ type: String }],
    suggestedImprovements: [{ type: String }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Resume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
