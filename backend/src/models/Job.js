import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  companyLogo: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: 'Bengaluru',
  },
  locationType: {
    type: String,
    enum: ['Onsite', 'Hybrid', 'Remote'],
    default: 'Onsite',
  },
  jobType: {
    type: String,
    enum: ['Fresher', 'Internship', 'Full-time', 'Contract'],
    default: 'Fresher',
  },
  experienceLevel: {
    type: String,
    default: 'Fresher (0-1 yrs)',
  },
  salaryRange: {
    type: String,
    default: 'Competitive',
  },
  salaryMin: {
    type: Number,
    default: 0,
  },
  salaryMax: {
    type: Number,
    default: 0,
  },
  stipendOrSalary: {
    type: String,
    enum: ['Salary', 'Stipend'],
    default: 'Salary',
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  skillsRequired: [{ type: String }],
  applyUrl: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: 'CuratedTech',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

JobSchema.index({ title: 'text', company: 'text', description: 'text', skillsRequired: 'text' });

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
