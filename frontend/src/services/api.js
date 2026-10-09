const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jobfit_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

// 1. Auth APIs
export const authApi = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  demoLogin: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};

// 2. Resume APIs
export const resumeApi = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  getMyResume: async () => {
    const res = await fetch(`${API_BASE_URL}/resume/my-resume`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateParsedData: async (parsedData) => {
    const res = await fetch(`${API_BASE_URL}/resume/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ parsedData }),
    });
    return handleResponse(res);
  },
};

// 3. Job Discovery APIs
export const jobsApi = {
  getJobs: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE_URL}/jobs?${query.toString()}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getJobById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getJobStats: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// 4. Feature 1: Smart Resume Matching APIs
export const matchApi = {
  getJobMatchAnalysis: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/match/job/${jobId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getTopRecommendations: async () => {
    const res = await fetch(`${API_BASE_URL}/match/recommendations`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

// 5. Feature 3: AI Interview Preparation APIs
export const interviewApi = {
  generateInterviewKit: async (jobId, targetRole, customJobDescription) => {
    const res = await fetch(`${API_BASE_URL}/interview/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ jobId, targetRole, customJobDescription }),
    });
    return handleResponse(res);
  },

  submitMockAnswer: async (question, answer, jobRole) => {
    const res = await fetch(`${API_BASE_URL}/interview/mock-answer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question, answer, jobRole }),
    });
    return handleResponse(res);
  },
};

// 6. Feature 4: Skill Gap & Career Roadmap APIs
export const roadmapApi = {
  getRoadmap: async (targetRole) => {
    const url = targetRole 
      ? `${API_BASE_URL}/roadmap?targetRole=${encodeURIComponent(targetRole)}` 
      : `${API_BASE_URL}/roadmap`;
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateSkillStatus: async (skillName, status) => {
    const res = await fetch(`${API_BASE_URL}/roadmap/skill-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ skillName, status }),
    });
    return handleResponse(res);
  },

  toggleMilestone: async (milestoneWeek, completed) => {
    const res = await fetch(`${API_BASE_URL}/roadmap/milestone-toggle`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ milestoneWeek, completed }),
    });
    return handleResponse(res);
  },
};

// 7. Applications & Saved Jobs APIs
export const applicationsApi = {
  getApplications: async () => {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  saveOrApplyJob: async (data) => {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateStatus: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteApplication: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/applications/${jobId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
