import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { config } from '../config/config.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

const signToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, targetRoles, preferredLocations, experienceLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const { isConnected } = getDbStatus();

    if (isConnected) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        targetRoles: targetRoles || ['Software Engineer', 'Frontend Developer'],
        preferredLocations: preferredLocations || ['Bengaluru', 'Remote'],
        experienceLevel: experienceLevel || 'Fresher',
      });

      const token = signToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRoles: user.targetRoles,
          preferredLocations: user.preferredLocations,
          experienceLevel: user.experienceLevel,
          skills: user.skills,
        },
      });
    } else {
      const existing = memoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = memoryStore.saveUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        targetRoles: targetRoles || ['Software Engineer', 'Frontend Developer'],
        preferredLocations: preferredLocations || ['Bengaluru', 'Remote'],
        experienceLevel: experienceLevel || 'Fresher',
        skills: [],
      });

      const token = signToken(newUser._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          targetRoles: newUser.targetRoles,
          preferredLocations: newUser.preferredLocations,
          experienceLevel: newUser.experienceLevel,
          skills: newUser.skills,
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const { isConnected } = getDbStatus();
    let user = null;

    if (isConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      user = memoryStore.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRoles: user.targetRoles,
        preferredLocations: user.preferredLocations,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo.fresher@jobfitai.com';
    const { isConnected } = getDbStatus();

    let user = null;
    if (isConnected) {
      user = await User.findOne({ email: demoEmail });
      if (!user) {
        user = await User.create({
          name: 'Priya Sharma',
          email: demoEmail,
          password: 'demoPassword123!',
          targetRoles: ['Full Stack Developer', 'Frontend Developer', 'Software Engineer Fresher'],
          preferredLocations: ['Bengaluru', 'Remote'],
          experienceLevel: 'Fresher',
          skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST API'],
        });
      }
    } else {
      user = memoryStore.findUserByEmail(demoEmail);
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('demoPassword123!', salt);
        user = memoryStore.saveUser({
          name: 'Priya Sharma',
          email: demoEmail,
          password: hashedPassword,
          targetRoles: ['Full Stack Developer', 'Frontend Developer', 'Software Engineer Fresher'],
          preferredLocations: ['Bengaluru', 'Remote'],
          experienceLevel: 'Fresher',
          skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Git', 'REST API'],
        });
      }
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRoles: user.targetRoles,
        preferredLocations: user.preferredLocations,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
      },
      message: 'Logged in as Demo Candidate (Priya Sharma)',
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, targetRoles, preferredLocations, experienceLevel, skills } = req.body;
    const { isConnected } = getDbStatus();

    if (isConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (targetRoles) user.targetRoles = targetRoles;
      if (preferredLocations) user.preferredLocations = preferredLocations;
      if (experienceLevel) user.experienceLevel = experienceLevel;
      if (skills) user.skills = skills;

      await user.save();
      return res.json({ success: true, user });
    } else {
      const updated = memoryStore.saveUser({
        ...req.user,
        name: name || req.user.name,
        targetRoles: targetRoles || req.user.targetRoles,
        preferredLocations: preferredLocations || req.user.preferredLocations,
        experienceLevel: experienceLevel || req.user.experienceLevel,
        skills: skills || req.user.skills,
      });
      return res.json({ success: true, user: updated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
