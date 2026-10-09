// In-memory data store fallback for when MongoDB server is not locally active or Atlas URI is pending.
// Ensures 100% smooth, crash-proof operation out-of-the-box.

class MemoryStore {
  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.roadmaps = new Map();
  }

  generateId() {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  }

  // Users
  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) return user;
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id?.toString()) || null;
  }

  saveUser(userData) {
    const id = userData._id ? userData._id.toString() : this.generateId();
    const user = {
      _id: id,
      ...userData,
      createdAt: userData.createdAt || new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Resumes
  saveResume(resumeData) {
    const id = resumeData._id ? resumeData._id.toString() : this.generateId();
    const resume = {
      _id: id,
      ...resumeData,
      createdAt: resumeData.createdAt || new Date(),
    };
    this.resumes.set(id, resume);
    return resume;
  }

  findResumeById(id) {
    return this.resumes.get(id?.toString()) || null;
  }

  findResumeByUserId(userId) {
    for (const resume of this.resumes.values()) {
      if (resume.user?.toString() === userId?.toString()) return resume;
    }
    return null;
  }

  // Jobs
  saveJob(jobData) {
    const id = jobData._id ? jobData._id.toString() : this.generateId();
    const job = {
      _id: id,
      ...jobData,
      postedAt: jobData.postedAt || new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  findJobById(id) {
    return this.jobs.get(id?.toString()) || null;
  }

  getAllJobs() {
    return Array.from(this.jobs.values());
  }

  // Applications
  saveApplication(appData) {
    const key = `${appData.user}_${appData.job}`;
    const id = appData._id ? appData._id.toString() : this.generateId();
    const app = {
      _id: id,
      ...appData,
      updatedAt: new Date(),
      createdAt: appData.createdAt || new Date(),
    };
    this.applications.set(key, app);
    return app;
  }

  getUserApplications(userId) {
    const list = [];
    for (const app of this.applications.values()) {
      if (app.user?.toString() === userId?.toString()) {
        const job = this.findJobById(app.job);
        list.push({ ...app, job });
      }
    }
    return list;
  }

  findApplication(userId, jobId) {
    const key = `${userId}_${jobId}`;
    return this.applications.get(key) || null;
  }

  updateApplication(id, updates) {
    for (const [key, app] of this.applications.entries()) {
      if (app._id.toString() === id.toString()) {
        const updated = { ...app, ...updates, updatedAt: new Date() };
        this.applications.set(key, updated);
        return updated;
      }
    }
    return null;
  }

  deleteApplication(userId, jobId) {
    const key = `${userId}_${jobId}`;
    return this.applications.delete(key);
  }

  // Roadmaps
  saveRoadmap(roadmapData) {
    const id = roadmapData._id ? roadmapData._id.toString() : this.generateId();
    const roadmap = {
      _id: id,
      ...roadmapData,
      updatedAt: new Date(),
    };
    this.roadmaps.set(roadmapData.user.toString(), roadmap);
    return roadmap;
  }

  findRoadmapByUserId(userId) {
    return this.roadmaps.get(userId?.toString()) || null;
  }
}

export const memoryStore = new MemoryStore();
