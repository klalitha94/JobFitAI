import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { User } from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const { isConnected } = getDbStatus();

    let user = null;
    if (isConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = memoryStore.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token: ' + error.message });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const { isConnected } = getDbStatus();

    let user = null;
    if (isConnected) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = memoryStore.findUserById(decoded.id);
    }

    req.user = user || null;
  } catch (err) {
    req.user = null;
  }
  next();
};
