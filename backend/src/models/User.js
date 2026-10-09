import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  targetRoles: {
    type: [String],
    default: ['Software Engineer', 'Frontend Developer', 'Full Stack Developer'],
  },
  preferredLocations: {
    type: [String],
    default: ['Bengaluru', 'Remote'],
  },
  skills: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Internship', '1-2 years', '2+ years'],
    default: 'Fresher',
  },
  currentResumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
