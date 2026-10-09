import { Application } from '../models/Application.js';
import { getJobById } from '../services/jobApiService.js';
import { memoryStore } from '../config/memoryStore.js';
import { getDbStatus } from '../config/db.js';

export const getMyApplications = async (req, res) => {
  try {
    const { isConnected } = getDbStatus();
    let applications = [];

    if (isConnected) {
      applications = await Application.find({ user: req.user._id })
        .populate('job')
        .sort({ updatedAt: -1 })
        .lean();
    } else {
      applications = memoryStore.getUserApplications(req.user._id);
    }

    res.json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveOrApplyJob = async (req, res) => {
  try {
    const { jobId, status = 'Saved', matchScore = 0, notes = '' } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'jobId is required.' });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const { isConnected } = getDbStatus();
    let application = null;

    if (isConnected) {
      application = await Application.findOne({ user: req.user._id, job: jobId });

      if (application) {
        application.status = status;
        if (matchScore) application.matchScore = matchScore;
        if (notes) application.notes = notes;
        if (status === 'Applied' && !application.appliedDate) {
          application.appliedDate = new Date();
        }
        application.updatedAt = new Date();
        await application.save();
      } else {
        application = await Application.create({
          user: req.user._id,
          job: jobId,
          status,
          matchScore,
          notes,
          appliedDate: status === 'Applied' ? new Date() : null,
        });
      }
    } else {
      application = memoryStore.saveApplication({
        user: req.user._id,
        job: jobId,
        status,
        matchScore,
        notes,
        appliedDate: status === 'Applied' ? new Date() : null,
      });
    }

    res.json({
      success: true,
      message: `Job marked as ${status}`,
      application,
    });
  } catch (error) {
    console.error('Save or apply job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate } = req.body;
    const { isConnected } = getDbStatus();

    let updated = null;
    if (isConnected) {
      updated = await Application.findOne({ _id: id, user: req.user._id });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Application record not found' });
      }
      if (status) updated.status = status;
      if (notes !== undefined) updated.notes = notes;
      if (interviewDate !== undefined) updated.interviewDate = interviewDate;
      updated.updatedAt = new Date();
      await updated.save();
    } else {
      updated = memoryStore.updateApplication(id, {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(interviewDate !== undefined && { interviewDate }),
      });
    }

    res.json({
      success: true,
      message: 'Application updated',
      application: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { isConnected } = getDbStatus();

    if (isConnected) {
      await Application.findOneAndDelete({ user: req.user._id, job: jobId });
    } else {
      memoryStore.deleteApplication(req.user._id, jobId);
    }

    res.json({
      success: true,
      message: 'Job removed from applications / saved list',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
