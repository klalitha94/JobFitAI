import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Course', 'Docs', 'Video', 'Practice', 'Article'],
    default: 'Course',
  },
  url: { type: String, required: true },
  provider: { type: String, default: 'freeCodeCamp' },
  duration: { type: String, default: '2-4 hours' },
}, { _id: false });

const SkillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  importance: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'High',
  },
  status: {
    type: String,
    enum: ['To Learn', 'In Progress', 'Mastered'],
    default: 'To Learn',
  },
  resources: [ResourceSchema],
}, { _id: true });

const MilestoneSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  topics: [{ type: String }],
  completed: { type: Boolean, default: false },
}, { _id: true });

const SkillRoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  currentScore: {
    type: Number,
    default: 0,
  },
  missingSkills: [SkillItemSchema],
  milestones: [MilestoneSchema],
  completionPercentage: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const SkillRoadmap = mongoose.models.SkillRoadmap || mongoose.model('SkillRoadmap', SkillRoadmapSchema);
