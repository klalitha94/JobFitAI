import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'In Review', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Saved',
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  appliedDate: {
    type: Date,
  },
  interviewDate: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

export const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
